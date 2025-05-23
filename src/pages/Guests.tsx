import React, { useState } from 'react';
import { Plus, Search, Filter, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Mock data for guests
const guestsData = [
  {
    id: 'G001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1-555-123-4567',
    nationality: 'USA',
    visits: 3,
    lastVisit: '2023-05-15',
    status: 'Checked In',
    roomNumber: '101'
  },
  {
    id: 'G002',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    phone: '+1-555-765-4321',
    nationality: 'UK',
    visits: 1,
    lastVisit: null,
    status: 'Reserved',
    roomNumber: '205'
  },
  {
    id: 'G003',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1-555-987-6543',
    nationality: 'Canada',
    visits: 5,
    lastVisit: '2023-04-22',
    status: 'Checked In',
    roomNumber: '304'
  },
  {
    id: 'G004',
    name: 'Olivia Johnson',
    email: 'olivia.johnson@example.com',
    phone: '+1-555-234-5678',
    nationality: 'Australia',
    visits: 2,
    lastVisit: '2023-03-10',
    status: 'Reserved',
    roomNumber: '402'
  },
  {
    id: 'G005',
    name: 'William Davis',
    email: 'william.davis@example.com',
    phone: '+1-555-876-5432',
    nationality: 'Germany',
    visits: 4,
    lastVisit: '2023-05-30',
    status: 'Checked In',
    roomNumber: '503'
  },
  {
    id: 'G006',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@example.com',
    phone: '+1-555-345-6789',
    nationality: 'Spain',
    visits: 1,
    lastVisit: '2023-02-18',
    status: 'Checked Out',
    roomNumber: null
  },
  {
    id: 'G007',
    name: 'James Taylor',
    email: 'james.taylor@example.com',
    phone: '+1-555-456-7890',
    nationality: 'USA',
    visits: 7,
    lastVisit: '2023-05-05',
    status: 'Checked Out',
    roomNumber: null
  },
  {
    id: 'G008',
    name: 'Isabella Anderson',
    email: 'isabella.anderson@example.com',
    phone: '+1-555-567-8901',
    nationality: 'Italy',
    visits: 2,
    lastVisit: '2023-04-12',
    status: 'Checked Out',
    roomNumber: null
  }
];

const Guests: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { t } = useTranslation();

  // Filter guests based on search query and status filter
  const filteredGuests = guestsData.filter(guest => {
    // Search filter
    const searchMatches = 
      guest.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone.includes(searchQuery) ||
      (guest.roomNumber && guest.roomNumber.includes(searchQuery));
    
    // Status filter
    const statusMatches = statusFilter === 'all' || guest.status === statusFilter;
    
    return searchMatches && statusMatches;
  });

  // Count guests by status
  const guestCounts = {
    all: guestsData.length,
    'Checked In': guestsData.filter(guest => guest.status === 'Checked In').length,
    'Reserved': guestsData.filter(guest => guest.status === 'Reserved').length,
    'Checked Out': guestsData.filter(guest => guest.status === 'Checked Out').length,
  };

  // Tradução dos status para exibir nos botões e badges
  const statusLabels = {
    'Checked In': t('guests.status.checkedIn'),
    'Reserved': t('guests.status.reserved'),
    'Checked Out': t('guests.status.checkedOut'),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">{t('guests.title')}</h1>
        <Link to="/guests/new" className="btn-primary flex items-center justify-center">
          <Plus size={18} className="mr-2" />
          {t('guests.addNew')}
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 bg-slate-800 rounded-lg p-4">
        <button 
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {t('common.all', 'All')} ({guestCounts.all})
        </button>
        <button 
          onClick={() => setStatusFilter('Checked In')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === 'Checked In' ? 'bg-green-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {statusLabels['Checked In']} ({guestCounts['Checked In']})
        </button>
        <button 
          onClick={() => setStatusFilter('Reserved')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === 'Reserved' ? 'bg-yellow-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {statusLabels['Reserved']} ({guestCounts['Reserved']})
        </button>
        <button 
          onClick={() => setStatusFilter('Checked Out')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === 'Checked Out' ? 'bg-slate-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {statusLabels['Checked Out']} ({guestCounts['Checked Out']})
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('common.search', 'Search by ID, name, email, phone, or room...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select className="pl-10 pr-8 py-2.5 appearance-none">
              <option>{t('common.all', 'All Countries')}</option>
              <option>USA</option>
              <option>UK</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      {filteredGuests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-slate-800 rounded-lg">
          <div className="text-slate-400 mb-4">
            <UserX size={48} />
          </div>
          <h3 className="text-xl font-medium mb-2">{t('guests.noGuestsFound', 'No Guests Found')}</h3>
          <p className="text-slate-400 text-center max-w-md">
            {t('guests.noGuestsMatch', 'No guests match your current search criteria. Try adjusting your filters or search query.')}
          </p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700 text-left">
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.id')}</th>
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.name')}</th>
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.contact')}</th>
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.nationality')}</th>
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.visits')}</th>
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.status')}</th>
                  <th className="p-4 font-medium text-slate-300">{t('guests.list.room')}</th>
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
                      <div className="flex flex-col">
                        <span className="text-blue-400 hover:underline">{guest.email}</span>
                        <span className="text-slate-400 text-sm">{guest.phone}</span>
                      </div>
                    </td>
                    <td className="p-4">{guest.nationality}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span>
                          {guest.visits} {guest.visits === 1 ? t('guests.list.visit', 'visit') : t('guests.list.visits')}
                        </span>
                        {guest.lastVisit && (
                          <span className="text-slate-400 text-sm">
                            {t('guests.lastVisit', 'Last')}: {guest.lastVisit}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        guest.status === 'Checked In' 
                          ? 'bg-green-500 bg-opacity-10 text-green-500' 
                          : guest.status === 'Reserved' 
                          ? 'bg-yellow-500 bg-opacity-10 text-yellow-500' 
                          : 'bg-slate-500 bg-opacity-10 text-slate-400'
                      }`}>
                        {statusLabels[guest.status as keyof typeof statusLabels] || guest.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {guest.roomNumber ? (
                        <span className="bg-blue-500 bg-opacity-10 text-blue-500 px-2 py-1 rounded-full text-xs font-medium">
                          {guest.roomNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Link 
                        to={`/guests/${guest.id}`}
                        className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-md transition-colors"
                      >
                        {t('common.view', 'View')}
                      </Link>
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

export default Guests;