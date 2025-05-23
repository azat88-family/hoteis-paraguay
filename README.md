# Hotel Management System

A modern hotel management system with a beautiful dark theme UI.

## Features

- Admin authentication system
- Interactive dashboard with KPIs and analytics
- Guest management (registration, details, documents)
- Room management with real-time status visualization
- Reservation calendar with flexible views
- Check-in/Check-out functionality
- Responsive design for all devices
- Document upload capability
- Automated database backup

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **UI Components**: Custom components with dark theme
- **Charting**: Chart.js with React-Chartjs-2
- **Routing**: React Router v6
- **Database**: Supports PostgreSQL or SQLite (requires backend implementation)
- **Backup**: Python script for database backup to Google Drive

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn
- Python 3.6+ (for database backup script)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Access the application at http://localhost:5173

### Default Credentials

- Email: admin@hotel.com
- Password: password

## Database Backup Script

The system includes a Python script (`src/utils/backupScript.py`) for automated database backups:

1. Install required Python packages:

```bash
pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
```

2. Set up Google Drive API credentials:
   - Create a project in Google Cloud Console
   - Enable the Google Drive API
   - Create OAuth 2.0 credentials
   - Download the credentials JSON file and save as `credentials.json`

3. Configure the database connection in `config.json`:

```json
{
  "db_type": "postgresql", 
  "pg_host": "localhost",
  "pg_port": 5432,
  "pg_dbname": "hoteldb",
  "pg_user": "admin",
  "pg_password": "admin123",
  "sqlite_path": "meubanco.db"
}
```

4. Set up a cron job for daily backups at 3:00 AM:

```
0 3 * * * cd /path/to/hotel-system && python src/utils/backupScript.py
```

## License

This project is licensed under the MIT License.