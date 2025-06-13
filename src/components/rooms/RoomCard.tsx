import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Coffee, Wifi, Tv, Wind, CheckSquare, XCircle, Clock, User, Settings, AlertCircle, Edit3, BedDouble, Users } from 'lucide-react';
import RoomManageModal from './RoomManageModal';
import type { Room } from '../../apiService/roomService';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const { user } = useAuth(); // Get user from AuthContext
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const canManageRoom = user?.role && ['admin', 'owner', 'attendant'].includes(user.role);

  // Function to determine status colors and translated text
  const getStatusInfo = () => {
    switch (room.status) {
      case 'available':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-500',
          bgColor: 'bg-green-500 bg-opacity-10',
          icon: <CheckSquare size={16} className="mr-1.5" />,
          text: t('rooms.status.available')
        };
      case 'occupied':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-500',
          bgColor: 'bg-red-500 bg-opacity-10',
          icon: <XCircle size={16} className="mr-1.5" />,
          text: t('rooms.status.occupied')
        };
      case 'reserved':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-500',
          bgColor: 'bg-yellow-500 bg-opacity-10',
          icon: <Calendar size={16} className="mr-1.5" />,
          text: t('rooms.status.reserved')
        };
      case 'cleaning':
        return {
          color: 'bg-purple-500',
          textColor: 'text-purple-500',
          bgColor: 'bg-purple-500 bg-opacity-10',
          icon: <Clock size={16} className="mr-1.5" />,
          text: t('rooms.status.cleaning')
        };
      case 'maintenance':
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-500',
          bgColor: 'bg-gray-500 bg-opacity-10',
          icon: <Settings size={16} className="mr-1.5" />, // Changed icon
          text: t('rooms.status.maintenance')
        };
      default:
        return {
          color: 'bg-slate-500', // Default to a neutral color
          textColor: 'text-blue-500',
          bgColor: 'bg-slate-500 bg-opacity-10',
          icon: <AlertCircle size={16} className="mr-1.5" />,
          text: t('rooms.status.unknown', room.status) // Pass actual status if unknown
        };
    }
  };

  // Get feature icon
  const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('wi-fi') || lowerFeature.includes('wifi')) return <Wifi size={14} />;
    if (lowerFeature.includes('breakfast')) return <Coffee size={14} />;
    if (lowerFeature.includes('tv')) return <Tv size={14} />;
    if (lowerFeature.includes('ac') || lowerFeature.includes('air conditioning')) return <Wind size={14} />;
    if (lowerFeature.includes('bed')) return <BedDouble size={14} />;
    if (lowerFeature.includes('user') || lowerFeature.includes('guest')) return <Users size={14} />;
    return <CheckSquare size={14} />;
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <div className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <div className="p-5 border-b border-slate-700">
          <div className="flex justify-between items-start mb-3">
            <span className="text-2xl font-bold text-white">{room.room_number}</span>
            <div className={`px-3 py-1 rounded-full flex items-center ${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-medium whitespace-nowrap`}>
              {statusInfo.icon}
              {statusInfo.text}
            </div>
          </div>
          <div className="mb-1">
            <h3 className="text-lg font-semibold text-slate-100">{t(`rooms.types.${room.type.toLowerCase()}`, room.type)}</h3>
            <p className="text-slate-400 text-sm">
              {t(`rooms.beds.${room.beds.toLowerCase()}`, room.beds)} · {room.capacity} {t(room.capacity > 1 ? 'rooms.guests' : 'rooms.guest', { count: room.capacity })}
            </p>
          </div>
        </div>
        
        <div className="p-5 flex-grow">
          {/* Guest information removed as it's not directly on the room object from the API */}

          {room.features && room.features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-300 mb-2">{t('rooms.featuresTitle', 'Features')}</h4>
              <div className="flex flex-wrap gap-2">
                {room.features.slice(0, 4).map((feature, index) => (
                  <div key={index} title={feature} className="flex items-center bg-slate-700 px-2.5 py-1 rounded text-xs text-slate-300">
                    {getFeatureIcon(feature)}
                    <span className="ml-1.5">{t(`rooms.features.${feature.toLowerCase().replace(/\s+/g, '')}`, feature)}</span>
                  </div>
                ))}
                {room.features.length > 4 && (
                  <div className="flex items-center bg-slate-700 px-2.5 py-1 rounded text-xs text-slate-300">
                    +{room.features.length - 4} {t('rooms.more', 'more')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-white">
              ${room.price_per_night.toFixed(2)}
              <span className="text-sm text-slate-400 font-normal"> / {t('rooms.night', 'night')}</span>
            </span>
            <div className="flex gap-2">
              <button
                title={t('rooms.viewDetailsTitle', 'View room details')}
                className="btn-secondary py-2 px-4 text-sm flex items-center" // Changed to secondary, primary for manage
                onClick={() => navigate(`/rooms/${room.id}`)} // Navigate to a future room details page
              >
                <Edit3 size={14} className="mr-1.5" />
                {t('common.details', 'Details')}
              </button>
              {canManageRoom && (
                <button
                  title={t('rooms.manageTitle', 'Manage room status or maintenance')}
                  className="btn-primary py-2 px-4 text-sm flex items-center"
                  onClick={() => setIsManageModalOpen(true)}
                >
                  <Settings size={14} className="mr-1.5" />
                  {t('rooms.manage', 'Manage')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isManageModalOpen && (
        <RoomManageModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          room={room}
          // onRoomUpdate might be needed here if status can be changed from modal
          // Pass relevant props for role-based actions inside modal if needed
        />
      )}
    </>
  );
};

export default RoomCard;