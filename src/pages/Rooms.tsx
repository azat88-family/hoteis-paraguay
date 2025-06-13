import React, { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import RoomCard from '../components/rooms/RoomCard';
import { useTranslation } from 'react-i18next';
import { getRooms, Room } from '../apiService/roomService'; // Adjusted import

const RoomsPage: React.FC = () => {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getRooms();
        setAllRooms(data);
        setFilteredRooms(data); // Initialize filteredRooms with all data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    let currentRooms = [...allRooms];

    // Filter by search query
    if (searchQuery) {
      const lowerSearchQuery = searchQuery.toLowerCase();
      currentRooms = currentRooms.filter(room =>
        room.room_number.toLowerCase().includes(lowerSearchQuery) ||
        room.type.toLowerCase().includes(lowerSearchQuery)
        // Guest name search is not possible as guest info is not directly on room
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      currentRooms = currentRooms.filter(room => room.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      currentRooms = currentRooms.filter(room => room.type === typeFilter);
    }

    setFilteredRooms(currentRooms);
  }, [searchQuery, statusFilter, typeFilter, allRooms]);


  // Calculate room counts based on allRooms for accurate totals
  const roomCounts = {
    all: allRooms.length,
    available: allRooms.filter(room => room.status === 'available').length,
    occupied: allRooms.filter(room => room.status === 'occupied').length,
    reserved: allRooms.filter(room => room.status === 'reserved').length,
    cleaning: allRooms.filter(room => room.status === 'cleaning').length,
    maintenance: allRooms.filter(room => room.status === 'maintenance').length,
  };

  // Get unique room types for the filter dropdown
  const roomTypes = Array.from(new Set(allRooms.map(room => room.type)));


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in p-4">
        <h1 className="text-3xl font-bold text-white">{t('rooms.title')}</h1>
        <div className="text-red-400 bg-red-900 p-4 rounded-lg">
          <p>{t('common.errorLoading', 'Error loading data')}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">{t('rooms.title')}</h1>
        {/* TODO: Add New Room Button? <Link to="/rooms/new" className="btn-primary">New Room</Link> */}
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
        {/* Dynamically create status buttons or ensure keys match room.status values */}
        {['available', 'occupied', 'reserved', 'cleaning', 'maintenance'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === status
                ? status === 'available' ? 'bg-green-600 text-white'
                : status === 'occupied' ? 'bg-red-600 text-white'
                : status === 'reserved' ? 'bg-yellow-600 text-white'
                : status === 'cleaning' ? 'bg-purple-600 text-white'
                : 'bg-gray-600 text-white' // maintenance
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t(`rooms.status.${status}` as const, status.charAt(0).toUpperCase() + status.slice(1))} ({(roomCounts as any)[status] || 0})
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('rooms.searchPlaceholder', 'Search by room number or type...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5" // Assuming this class handles styling
          />
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 appearance-none" // Assuming this class handles styling
            >
              <option value="all">{t('rooms.allTypes', 'All Types')}</option>
              {roomTypes.map(type => (
                 <option key={type} value={type}>{t(`rooms.types.${type.toLowerCase()}` as const, type)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-slate-800 rounded-lg">
          <div className="text-slate-400 mb-4">
            <Search size={48} /> {/* Changed icon to Search to reflect filtering */}
          </div>
          <h3 className="text-xl font-medium mb-2">{t('rooms.noRoomsFound', 'No Rooms Found')}</h3>
          <p className="text-slate-400 text-center max-w-md">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? t('rooms.noRoomsMatch', 'No rooms match your current search criteria. Try adjusting your filters or search query.')
              : t('rooms.noRoomsYet', 'There are no rooms in the system yet.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map(room => (
            // Ensure RoomCard props match the actual Room data structure
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;