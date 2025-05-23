#!/usr/bin/env python3
"""
Hotel Management System - Database Backup Script
Automatically backs up PostgreSQL or SQLite database and uploads to Google Drive.
"""

import os
import sys
import logging
import datetime
import subprocess
import json
import shutil
import time
from pathlib import Path

# Try to import Google Drive API libraries
try:
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    from googleapiclient.http import MediaFileUpload
except ImportError:
    print("Google API libraries not found. Please install them with:")
    print("pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib")
    sys.exit(1)

# Setup logging
log_file = "backup_log.txt"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("backup")

# Path configuration
BACKUP_DIR = Path("backups")
CONFIG_FILE = Path("config.json")
CREDENTIALS_FILE = Path("credentials.json")
TOKEN_FILE = Path("token.json")

# Google API configuration
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def load_config():
    """Load database configuration from config.json"""
    if not CONFIG_FILE.exists():
        default_config = {
            "db_type": "postgresql",  # or "sqlite"
            "pg_host": "localhost",
            "pg_port": 5432,
            "pg_dbname": "hoteldb",
            "pg_user": "admin",
            "pg_password": "admin123",
            "sqlite_path": "meubanco.db"
        }
        with open(CONFIG_FILE, 'w') as f:
            json.dump(default_config, f, indent=2)
        logger.info(f"Created default config file at {CONFIG_FILE}")
        
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)

def get_google_drive_service():
    """Authenticate and create Google Drive service"""
    creds = None
    
    # Check if token.json file exists
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_info(
            json.loads(TOKEN_FILE.read_text()), SCOPES)
    
    # If credentials don't exist or are invalid, get new ones
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_FILE.exists():
                logger.error(f"Credentials file not found: {CREDENTIALS_FILE}")
                logger.error("Please download credentials.json from Google Cloud Console")
                sys.exit(1)
                
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save credentials for future use
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
    
    return build('drive', 'v3', credentials=creds)

def backup_postgresql(config):
    """Create PostgreSQL database backup"""
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    backup_file = BACKUP_DIR / f"backup_{today}.sql"
    
    # Ensure backup directory exists
    BACKUP_DIR.mkdir(exist_ok=True)
    
    # Set PostgreSQL environment variables
    pg_env = os.environ.copy()
    if config.get("pg_password"):
        pg_env["PGPASSWORD"] = config["pg_password"]
    
    cmd = [
        "pg_dump",
        "-h", config.get("pg_host", "localhost"),
        "-p", str(config.get("pg_port", 5432)),
        "-U", config.get("pg_user", "admin"),
        "-d", config.get("pg_dbname", "hoteldb"),
        "-f", str(backup_file)
    ]
    
    try:
        logger.info(f"Starting PostgreSQL backup to {backup_file}")
        process = subprocess.run(cmd, env=pg_env, check=True, 
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        logger.info("PostgreSQL backup completed successfully")
        return backup_file
    except subprocess.CalledProcessError as e:
        logger.error(f"PostgreSQL backup failed: {e.stderr.decode()}")
        sys.exit(1)

def backup_sqlite(config):
    """Create SQLite database backup"""
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    sqlite_path = Path(config.get("sqlite_path", "meubanco.db"))
    backup_file = BACKUP_DIR / f"backup_{today}.db"
    
    # Ensure backup directory exists
    BACKUP_DIR.mkdir(exist_ok=True)
    
    if not sqlite_path.exists():
        logger.error(f"SQLite database not found: {sqlite_path}")
        sys.exit(1)
    
    try:
        logger.info(f"Starting SQLite backup to {backup_file}")
        shutil.copy2(sqlite_path, backup_file)
        logger.info("SQLite backup completed successfully")
        return backup_file
    except Exception as e:
        logger.error(f"SQLite backup failed: {str(e)}")
        sys.exit(1)

def upload_to_google_drive(file_path):
    """Upload backup file to Google Drive"""
    try:
        service = get_google_drive_service()
        file_name = os.path.basename(file_path)
        
        # Create file metadata
        file_metadata = {
            'name': file_name,
            'mimeType': 'application/octet-stream'
        }
        
        # Create media
        media = MediaFileUpload(
            file_path, 
            mimetype='application/octet-stream',
            resumable=True
        )
        
        # Upload file
        logger.info(f"Uploading {file_name} to Google Drive...")
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()
        
        logger.info(f"Upload successful. File ID: {file.get('id')}")
        return True
    except HttpError as e:
        logger.error(f"Google Drive upload error: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error uploading to Google Drive: {str(e)}")
        return False

def cleanup_local_backup(file_path):
    """Remove local backup file after successful upload"""
    try:
        os.remove(file_path)
        logger.info(f"Local backup file {file_path} deleted")
    except Exception as e:
        logger.error(f"Error deleting local backup: {str(e)}")

def main():
    """Main backup function"""
    logger.info("Starting database backup process")
    
    try:
        # Load configuration
        config = load_config()
        db_type = config.get("db_type", "postgresql").lower()
        
        # Create backup based on database type
        if db_type == "postgresql":
            backup_file = backup_postgresql(config)
        elif db_type == "sqlite":
            backup_file = backup_sqlite(config)
        else:
            logger.error(f"Unsupported database type: {db_type}")
            sys.exit(1)
        
        # Upload to Google Drive
        if upload_to_google_drive(backup_file):
            # Clean up local backup file
            cleanup_local_backup(backup_file)
            logger.info("Backup process completed successfully")
        else:
            logger.error("Backup upload failed")
            
    except Exception as e:
        logger.error(f"Backup process failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()