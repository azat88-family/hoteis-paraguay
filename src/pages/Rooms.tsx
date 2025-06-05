import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import RoomCard from '../components/rooms/RoomCard';
import { useTranslation } from 'react-i18next';

// Mock data for rooms
const roomsData = [
  {
    id: 101,
    type: 'Standard',
    beds: 'Queen',
    capacity: 2,
    price: 120,
    status: 'occupied',
    guest: 'John Smith',
    guestPhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
    checkIn: '2023-06-12',
    checkOut: '2023-06-15',
    features: ['Wi-Fi', 'TV', 'AC', 'Breakfast']
  },
  {
    id: 102,
    type: 'Standard',
    beds: 'Twin',
    capacity: 2,
    price: 120,
    status: 'available',
    guest: null,
    guestPhoto: null,
    checkIn: null,
    checkOut: null,
    features: ['Wi-Fi', 'TV', 'AC']
  },
  {
    id: 103,
    type: 'Deluxe',
    beds: 'King',
    capacity: 2,
    price: 180,
    status: 'cleaning',
    guest: null,
    guestPhoto: null,
    checkIn: null,
    checkOut: null,
    features: ['Wi-Fi', 'TV', 'AC', 'Minibar', 'Breakfast']
  },
  {
    id: 104,
    type: 'Deluxe',
    beds: 'Queen',
    capacity: 2,
    price: 160,
    status: 'occupied',
    guest: 'Emma Wilson',
    guestPhoto: 'https://randomuser.me/api/portraits/women/2.jpg',
    checkIn: '2023-06-14',
    checkOut: '2023-06-18',
    features: ['Wi-Fi', 'TV', 'AC', 'Minibar', 'Breakfast']
  },
  {
    id: 105,
    type: 'Suite',
    beds: 'King',
    capacity: 3,
    price: 250,
    status: 'maintenance',
    guest: null,
    guestPhoto: null,
    checkIn: null,
    checkOut: null,
    features: ['Wi-Fi', 'TV', 'AC', 'Minibar', 'Living Area', 'Breakfast']
  },
  {
    id: 202,
    type: 'Deluxe',
    beds: 'Twin',
    capacity: 2,
    price: 160,
    status: 'reserved',
    guest: 'Olivia Johnson',
    guestPhoto: 'https://randomuser.me/api/portraits/women/3.jpg',
    checkIn: '2023-06-16',
    checkOut: '2023-06-19',
    features: ['Wi-Fi', 'TV', 'AC', 'Minibar', 'Breakfast']
  },
  {
    id: 561,
    type: 'Deluxe',
    beds: 'Twin',
    capacity: 2,
    price: 160,
    status: 'available',
    guest: '',
    guestPhoto: '',
    checkIn: '',
    checkOut: '',
    features: ['Wi-Fi', 'TV', 'AC', 'Minibar', 'Breakfast']
  },
  {
    id: 560,
    type: 'Deluxe',
    beds: 'Twin',
    capacity: 2,
    price: 160,
    status: 'available',
    guest: '',
    guestPhoto: '',
    checkIn: '',
    checkOut: '',
    features: ['Wi-Fi', 'TV', 'AC', 'Minibar', 'Breakfast']
  }
];

const Rooms: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { t } = useTranslation();

  // Filter rooms based on search query and filters
  const filteredRooms = roomsData.filter(room => {
    const searchMatches =
      room.id.toString().includes(searchQuery) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.guest && room.guest.toLowerCase().includes(searchQuery.toLowerCase()));

    const statusMatches = statusFilter === 'all' || room.status === statusFilter;
    const typeMatches = typeFilter === 'all' || room.type === typeFilter;

    return searchMatches && statusMatches && typeMatches;
  });

  // Count rooms by status
  const roomCounts = {
    all: roomsData.length,
    available: roomsData.filter(room => room.status === 'available').length,
    occupied: roomsData.filter(room => room.status === 'occupied').length,
    reserved: roomsData.filter(room => room.status === 'reserved').length,
    cleaning: roomsData.filter(room => room.status === 'cleaning').length,
    maintenance: roomsData.filter(room => room.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">{t('rooms.title')}</h1>
      </div>

      <div className="flex flex-wrap gap-3 bg-slate-800 rounded-lg p-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {t('rooms.all', 'All')} ({roomCounts.all})
        </button>
        <button
          onClick={() => setStatusFilter('available')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === 'available' ? 'bg-green-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {t('rooms.status.available')} ({roomCounts.available})
        </button>
        <button
          onClick={() => setStatusFilter('occupied')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === 'occupied' ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {t('rooms.status.occupied')} ({roomCounts.occupied})
        </button>
        <button
          onClick={() => setStatusFilter('reserved')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === 'reserved' ? 'bg-yellow-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {t('rooms.status.reserved')} ({roomCounts.reserved})
        </button>
        <button
          onClick={() => setStatusFilter('cleaning')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === 'cleaning' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {t('rooms.status.cleaning')} ({roomCounts.cleaning})
        </button>
        <button
          onClick={() => setStatusFilter('maintenance')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === 'maintenance' ? 'bg-gray-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {t('rooms.status.maintenance')} ({roomCounts.maintenance})
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('rooms.searchPlaceholder', 'Search by room number, type, or guest name...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 appearance-none"
            >
              <option value="all">{t('rooms.allTypes', 'All Types')}</option>
              <option value="Standard">{t('rooms.types.standard')}</option>
              <option value="Deluxe">{t('rooms.types.deluxe')}</option>
              <option value="Premium">{t('rooms.types.premium')}</option>
              <option value="Suite">{t('rooms.types.suite')}</option>
            </select>
          </div>
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-slate-800 rounded-lg">
          <div className="text-slate-400 mb-4">
            <Search size={48} />
          </div>
          <h3 className="text-xl font-medium mb-2">{t('rooms.noRoomsFound', 'No Rooms Found')}</h3>
          <p className="text-slate-400 text-center max-w-md">
            {t('rooms.noRoomsMatch', 'No rooms match your current search criteria. Try adjusting your filters or search query.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;