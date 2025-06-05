import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Coffee, Wifi, Tv, Wind, CheckSquare, XCircle, Clock, PenTool as Tool, AlertCircle } from 'lucide-react';
import RoomManageModal from './RoomManageModal';

interface RoomProps {
  room: {
    id: number;
    type: string;
    beds: string;
    capacity: number;
    price: number;
    status: string;
    guest: string | null;
    guestPhoto?: string | null;
    checkIn: string | null;
    checkOut: string | null;
    features: string[];
  };
}

const RoomCard: React.FC<RoomProps> = ({ room }) => {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          icon: <Tool size={16} className="mr-1.5" />,
          text: t('rooms.status.maintenance')
        };
      default:
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-500',
          bgColor: 'bg-blue-500 bg-opacity-10',
          icon: <AlertCircle size={16} className="mr-1.5" />,
          text: t('rooms.status.unknown')
        };
    }
  };

  // Get feature icon
  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'wi-fi':
        return <Wifi size={14} />;
      case 'breakfast':
        return <Coffee size={14} />;
      case 'tv':
        return <Tv size={14} />;
      case 'ac':
        return <Wind size={14} />;
      default:
        return <CheckSquare size={14} />;
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <div className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-4 border-b border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-white">{room.id}</span>
            <div className={`px-3 py-1 rounded-full flex items-center ${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-medium`}>
              {statusInfo.icon}
              {statusInfo.text}
            </div>
          </div>
          <div className="mb-2">
            <h3 className="text-lg font-semibold">{t(`rooms.types.${room.type.toLowerCase()}`)} {t('rooms.title', 'Room')}</h3>
            <p className="text-slate-400">{room.beds} {t('rooms.bed', 'Bed')} · {room.capacity} {t('rooms.guests', 'Guests')}</p>
          </div>
        </div>
        
        <div className="p-4">
          {room.guest && (
            <div className="mb-4">
              <div className="flex items-center gap-2">
                {/* Foto do hóspede */}
                {room.guestPhoto ? (
                  <img
                    src={room.guestPhoto}
                    alt={room.guest || 'Guest'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold text-white">
                    {room.guest ? room.guest[0] : ''}
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium">{room.guest}</span>
                  {room.checkIn && room.checkOut && (
                    <div className="flex items-center mt-1">
                      <Calendar size={16} className="text-slate-400 mr-2" />
                      <span className="text-sm text-slate-400">
                        {room.checkIn} - {room.checkOut}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {room.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center bg-slate-700 px-2 py-1 rounded text-xs">
                {getFeatureIcon(feature)}
                <span className="ml-1">{t(`rooms.features.${feature.toLowerCase()}`, feature)}</span>
              </div>
            ))}
            {room.features.length > 4 && (
              <div className="flex items-center bg-slate-700 px-2 py-1 rounded text-xs">
                +{room.features.length - 4} {t('rooms.more', 'more')}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">${room.price} <span className="text-sm text-slate-400 font-normal">/ {t('rooms.night', 'night')}</span></span>
            <div className="flex gap-2">
              <button
                className="btn-primary py-1.5 px-3 text-sm"
                onClick={() => {
                  if (room.guest) {
                    navigate(`/guests/${encodeURIComponent(room.guest)}`);
                  }
                }}
              >
                {t('rooms.viewDetails', 'View Details')}
              </button>
              <button 
                className="btn-secondary py-1.5 px-3 text-sm"
                onClick={() => setIsManageModalOpen(true)}
              >
                {t('rooms.manage', 'Manage')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <RoomManageModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        room={room}
      />
    </>
  );
};

export default RoomCard;