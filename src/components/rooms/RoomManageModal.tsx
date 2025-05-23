import React, { useState } from 'react';
import { X, Search, User, Calendar, DollarSign, Settings, Trash2 } from 'lucide-react';

interface RoomManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    id: number;
    type: string;
    beds: string;
    capacity: number;
    price: number;
    status: string;
    guest: string | null;
    checkIn: string | null;
    checkOut: string | null;
    features: string[];
  };
}

const RoomManageModal: React.FC<RoomManageModalProps> = ({ isOpen, onClose, room }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Room {room.id}</h2>
            <p className="text-slate-400">{room.type} Room · {room.beds} Bed</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-700">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'details'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'history'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'maintenance'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('maintenance')}
          >
            Maintenance
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Room Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400">Room Type</label>
                      <p className="font-medium">{room.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400">Bed Type</label>
                      <p className="font-medium">{room.beds}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400">Capacity</label>
                      <p className="font-medium">{room.capacity} Guests</p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400">Price</label>
                      <p className="font-medium">${room.price}/night</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, index) => (
                        <span key={index} className="bg-slate-700 px-3 py-1 rounded-full text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current Guest</h3>
                  {room.guest ? (
                    <>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold">
                          {room.guest.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{room.guest}</p>
                          <p className="text-slate-400 text-sm">
                            {room.checkIn} - {room.checkOut}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn-primary py-1.5 px-3 text-sm">
                          View Details
                        </button>
                        <button className="btn-secondary py-1.5 px-3 text-sm">
                          Check Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 bg-slate-700 rounded-lg">
                      <User size={32} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-slate-400">No guest currently checked in</p>
                      <button className="btn-primary mt-4 py-1.5 px-4 text-sm">
                        New Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center justify-center p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <Calendar size={24} className="mb-2 text-blue-500" />
                    <span className="text-sm">New Booking</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <Settings size={24} className="mb-2 text-yellow-500" />
                    <span className="text-sm">Maintenance</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <DollarSign size={24} className="mb-2 text-green-500" />
                    <span className="text-sm">Update Price</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <Trash2 size={24} className="mb-2 text-red-500" />
                    <span className="text-sm">Remove Room</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Booking History</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-700 rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-700">
                      <th className="pb-3 font-medium text-slate-300">Guest</th>
                      <th className="pb-3 font-medium text-slate-300">Check In</th>
                      <th className="pb-3 font-medium text-slate-300">Check Out</th>
                      <th className="pb-3 font-medium text-slate-300">Nights</th>
                      <th className="pb-3 font-medium text-slate-300">Total</th>
                      <th className="pb-3 font-medium text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700">
                      <td className="py-3">John Smith</td>
                      <td className="py-3">2023-05-15</td>
                      <td className="py-3">2023-05-18</td>
                      <td className="py-3">3</td>
                      <td className="py-3">$360</td>
                      <td className="py-3">
                        <span className="bg-green-500 bg-opacity-10 text-green-500 px-2 py-1 rounded-full text-xs">
                          Completed
                        </span>
                      </td>
                    </tr>
                    {/* Add more history rows as needed */}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Maintenance Log</h3>
                <button className="btn-primary py-1.5 px-3 text-sm">
                  Add Record
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Regular Cleaning</h4>
                      <p className="text-slate-400 text-sm">2023-06-15</p>
                    </div>
                    <span className="bg-green-500 bg-opacity-10 text-green-500 px-2 py-1 rounded-full text-xs">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Standard room cleaning and sanitization performed.
                  </p>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">AC Maintenance</h4>
                      <p className="text-slate-400 text-sm">2023-06-10</p>
                    </div>
                    <span className="bg-green-500 bg-opacity-10 text-green-500 px-2 py-1 rounded-full text-xs">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Regular AC maintenance and filter replacement.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomManageModal;