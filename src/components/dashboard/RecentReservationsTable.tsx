import React from 'react';
import { Eye, MoreVertical } from 'lucide-react';

const guestData = [
  {
    id: 'G001',
    name: 'John Smith',
    room: '101',
    roomType: 'Deluxe King',
    checkIn: '2023-06-12',
    checkOut: '2023-06-15',
    status: 'Checked In',
    payment: 'Paid'
  },
  {
    id: 'G002',
    name: 'Emma Wilson',
    room: '205',
    roomType: 'Standard Twin',
    checkIn: '2023-06-14',
    checkOut: '2023-06-18',
    status: 'Reserved',
    payment: 'Partially Paid'
  },
  {
    id: 'G003',
    name: 'Michael Brown',
    room: '304',
    roomType: 'Executive Suite',
    checkIn: '2023-06-15',
    checkOut: '2023-06-20',
    status: 'Checked In',
    payment: 'Paid'
  },
  {
    id: 'G004',
    name: 'Olivia Johnson',
    room: '402',
    roomType: 'Deluxe Queen',
    checkIn: '2023-06-16',
    checkOut: '2023-06-19',
    status: 'Reserved',
    payment: 'Not Paid'
  },
  {
    id: 'G005',
    name: 'William Davis',
    room: '503',
    roomType: 'Premium Suite',
    checkIn: '2023-06-15',
    checkOut: '2023-06-22',
    status: 'Checked In',
    payment: 'Paid'
  }
];

const RecentReservationsTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-700 text-left">
            <th className="p-4 font-medium text-slate-300">Guest</th>
            <th className="p-4 font-medium text-slate-300">Room</th>
            <th className="p-4 font-medium text-slate-300">Check In</th>
            <th className="p-4 font-medium text-slate-300">Check Out</th>
            <th className="p-4 font-medium text-slate-300">Status</th>
            <th className="p-4 font-medium text-slate-300">Payment</th>
            <th className="p-4 font-medium text-slate-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {guestData.map((guest, index) => (
            <tr 
              key={guest.id} 
              className={`border-b ${index === guestData.length - 1 ? '' : 'border-slate-700'} hover:bg-slate-700 transition-colors`}
            >
              <td className="p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                    {guest.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{guest.name}</p>
                    <p className="text-slate-400 text-sm">#{guest.id}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <p className="font-medium">{guest.room}</p>
                <p className="text-slate-400 text-sm">{guest.roomType}</p>
              </td>
              <td className="p-4">{guest.checkIn}</td>
              <td className="p-4">{guest.checkOut}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  guest.status === 'Checked In' 
                    ? 'bg-green-500 bg-opacity-10 text-green-500' 
                    : 'bg-blue-500 bg-opacity-10 text-blue-500'
                }`}>
                  {guest.status}
                </span>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  guest.payment === 'Paid' 
                    ? 'bg-green-500 bg-opacity-10 text-green-500' 
                    : guest.payment === 'Partially Paid' 
                    ? 'bg-yellow-500 bg-opacity-10 text-yellow-500' 
                    : 'bg-red-500 bg-opacity-10 text-red-500'
                }`}>
                  {guest.payment}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-slate-600 rounded-full transition-colors">
                    <Eye size={16} className="text-slate-400 hover:text-white" />
                  </button>
                  <button className="p-1 hover:bg-slate-600 rounded-full transition-colors">
                    <MoreVertical size={16} className="text-slate-400 hover:text-white" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentReservationsTable;