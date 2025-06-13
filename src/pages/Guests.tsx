import React, { useEffect, useState } from 'react';
import { Plus, Search, UserX } from 'lucide-react'; // Removed Filter for now
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getGuests, Guest } from '../apiService/guestService'; // Adjusted import path

const GuestsPage: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // const [statusFilter, setStatusFilter] = useState('all'); // Status not directly on guest table
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getGuests();
        setGuests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.unknownError', 'An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuests();
  }, [t]); // Added t to dependency array

  // Filter guests based on search query
  const filteredGuests = guests.filter(guest => {
    const searchString = searchQuery.toLowerCase();
    return (
      guest.id.toString().toLowerCase().includes(searchString) ||
      guest.name.toLowerCase().includes(searchString) ||
      guest.email.toLowerCase().includes(searchString) ||
      (guest.phone && guest.phone.toLowerCase().includes(searchString))
    );
  });

  // Guest counts - simplified as status is not on the guest table
  // const guestCounts = {
  //   all: guests.length,
  // };

  // Status labels - simplified
  // const statusLabels = {
  //   'Checked In': t('guests.status.checkedIn'),
  //   'Reserved': t('guests.status.reserved'),
  //   'Checked Out': t('guests.status.checkedOut'),
  // };

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
        <h1 className="text-3xl font-bold text-white">{t('guests.title')}</h1>
        <div className="text-red-400 bg-red-900 p-4 rounded-lg">
          <p>{t('common.errorLoading', 'Error loading data')}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">{t('guests.title')}</h1>
        <Link to="/guests/new" className="btn-primary flex items-center justify-center">
          <Plus size={18} className="mr-2" />
          {t('guests.addNew')}
        </Link>
      </div>

      {/* Simplified filter buttons as status is not directly on guest table */}
      {/* <div className="flex flex-wrap gap-3 bg-slate-800 rounded-lg p-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {t('common.all', 'All')} ({guestCounts.all})
        </button>
      </div> */}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('common.search', 'Search by ID, name, email, or phone...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5" // Assuming this class handles styling
          />
        </div>
        {/* Removed country filter for now as it's not in the Guest data */}
      </div>

      {filteredGuests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-slate-800 rounded-lg">
          <div className="text-slate-400 mb-4">
            <UserX size={48} />
          </div>
          <h3 className="text-xl font-medium mb-2">{t('guests.noGuestsFound', 'No Guests Found')}</h3>
          <p className="text-slate-400 text-center max-w-md">
            {searchQuery
              ? t('guests.noGuestsMatchSearch', 'No guests match your current search query.')
              : t('guests.noGuestsYet', 'There are no guests in the system yet. Try adding a new one!')}
          </p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700 text-left">
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.id', 'ID')}</th>
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.name', 'Name')}</th>
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.contact', 'Contact')}</th>
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.phone', 'Phone')}</th>
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.createdAt', 'Created At')}</th>
                  <th className="p-4 font-medium text-slate-300">{t('common.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest, index) => (
                  <tr 
                    key={guest.id} 
                    className={`border-b ${index === filteredGuests.length - 1 ? '' : 'border-slate-700'} hover:bg-slate-700 transition-colors`}
                  >
                    <td className="p-4 font-medium">#{guest.id}</td>
                    <td className="p-4">
                      <Link to={`/guests/${guest.id}`} className="font-medium text-white hover:text-blue-400 transition-colors">
                        {guest.name}
                      </Link>
                    </td>
                    <td className="p-4">
                       <span className="text-blue-400 hover:underline">{guest.email}</span>
                    </td>
                    <td className="p-4">{guest.phone || 'N/A'}</td>
                    <td className="p-4">{new Date(guest.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Link 
                        to={`/guests/${guest.id}`} // Individual guest view page not yet implemented
                        className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-md transition-colors"
                      >
                        {t('common.view', 'View')}
                      </Link>
                      {/* Add Edit/Delete buttons later if needed */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestsPage;