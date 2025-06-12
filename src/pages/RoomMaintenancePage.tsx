// src/pages/RoomMaintenancePage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
// import { useTranslation } from 'react-i18next'; // Add if titles need translation immediately

const RoomMaintenancePage: React.FC = () => {
  const { id: roomId } = useParams<{ id: string }>();
  // const { t } = useTranslation(); // For later use

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center space-x-4 mb-6">
        <Link to={`/rooms`} className="p-2 rounded-full hover:bg-slate-700 transition-colors"> {/* Or back to modal if possible, but /rooms is safer for now */}
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-white">
          {/* Placeholder Title - to be internationalized later */}
          Room Maintenance Management (Room {roomId})
        </h1>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <p className="text-slate-300">
          Maintenance details and form for room {roomId} will go here.
        </p>
        {/*
          TODO:
          - Add form fields as per user request:
            - Name of who requested maintenance
            - Date (day, month, year)
            - Time of maintenance
            - Who will perform the maintenance
            - Description of the maintenance
          - Add buttons: "Put in maintenance" and "Remove from maintenance"
          - Implement logic for these actions.
        */}
      </div>
    </div>
  );
};

export default RoomMaintenancePage;
