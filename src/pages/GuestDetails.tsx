import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Printer, Upload, CreditCard, User, Mail, Phone, MapPin, Calendar, Bed, Clock, FileText } from 'lucide-react';

// Mock data for a guest
const guestData = {
  id: 'G001',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+1-555-123-4567',
  address: '123 Main Street, Anytown, USA',
  nationality: 'USA',
  passportNumber: 'US12345678',
  birthDate: '1985-06-15',
  visits: 3,
  totalSpent: 1280,
  notes: 'Prefers rooms away from elevator. Allergic to feather pillows.',
  currentStay: {
    roomNumber: '101',
    checkIn: '2023-06-12',
    checkOut: '2023-06-15',
    nights: 3,
    rate: 120,
    status: 'Checked In'
  },
  paymentMethods: [
    {
      type: 'Credit Card',
      last4: '4242',
      expiry: '05/25'
    }
  ],
  history: [
    {
      id: 'B001',
      date: '2023-05-15',
      roomNumber: '203',
      nights: 2,
      amount: 240,
      status: 'Completed'
    },
    {
      id: 'B002',
      date: '2023-02-22',
      roomNumber: '105',
      nights: 4,
      amount: 480,
      status: 'Completed'
    },
    {
      id: 'B003',
      date: '2022-11-10',
      roomNumber: '301',
      nights: 3,
      amount: 420,
      status: 'Completed'
    }
  ],
  documents: [
    {
      name: 'Passport.pdf',
      uploadDate: '2023-06-12',
      size: '2.4 MB'
    },
    {
      name: 'ID_Card.jpg',
      uploadDate: '2023-06-12',
      size: '1.1 MB'
    }
  ]
};

const GuestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // In a real app, fetch guest data based on id

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/guests" className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Guest Details</h1>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <Printer size={16} className="mr-2" />
            Print
          </button>
          <button className="btn-primary flex items-center">
            <Edit size={16} className="mr-2" />
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Guest info */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white">
                  {guestData.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{guestData.name}</h2>
                  <p className="text-slate-400">#{guestData.id}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="font-medium">{guestData.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="font-medium">{guestData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-slate-400">Address</p>
                  <p className="font-medium">{guestData.address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <User className="w-5 h-5 text-slate-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-slate-400">Nationality</p>
                  <p className="font-medium">{guestData.nationality}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-slate-400">Birth Date</p>
                  <p className="font-medium">{guestData.birthDate}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-lg font-bold">Payment Methods</h2>
            </div>
            
            <div className="p-6">
              {guestData.paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">{method.type}</p>
                    <p className="text-slate-400 text-sm">**** {method.last4} · Expires {method.expiry}</p>
                  </div>
                </div>
              ))}
              
              <button className="mt-4 w-full py-2 border border-slate-600 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
                Add Payment Method
              </button>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-lg font-bold">Documents</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {guestData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-slate-400 text-xs">{doc.uploadDate} · {doc.size}</p>
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-slate-600 rounded-md transition-colors">
                      <Printer size={16} className="text-slate-400" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full flex items-center justify-center py-2 border border-slate-600 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
                <Upload size={16} className="mr-2" />
                Upload Document
              </button>
            </div>
          </div>
        </div>
        
        {/* Right column - Current stay and history */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-lg font-bold">Current Stay</h2>
            </div>
            
            {guestData.currentStay ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-500 bg-opacity-20 rounded-md">
                        <Bed className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Room Number</p>
                        <p className="font-bold text-lg">{guestData.currentStay.roomNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-slate-400">Room Rate</p>
                        <p className="font-medium">${guestData.currentStay.rate}/night</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Total</p>
                        <p className="font-medium">${guestData.currentStay.rate * guestData.currentStay.nights}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-green-500 bg-opacity-20 rounded-md">
                        <Calendar className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Duration</p>
                        <p className="font-bold text-lg">{guestData.currentStay.nights} Nights</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-slate-400">Check In</p>
                        <p className="font-medium">{guestData.currentStay.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Check Out</p>
                        <p className="font-medium">{guestData.currentStay.checkOut}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button className="btn-secondary py-2 px-4">Extend Stay</button>
                  <button className="btn-primary py-2 px-4">Check Out</button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-slate-400">No current stay found.</p>
                <button className="mt-4 btn-primary">Book New Stay</button>
              </div>
            )}
          </div>
          
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Stay History</h2>
                <div>
                  <span className="text-slate-400 mr-2">Total Visits:</span>
                  <span className="font-bold">{guestData.visits}</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700 text-left">
                    <th className="p-4 font-medium text-slate-300">Booking ID</th>
                    <th className="p-4 font-medium text-slate-300">Date</th>
                    <th className="p-4 font-medium text-slate-300">Room</th>
                    <th className="p-4 font-medium text-slate-300">Nights</th>
                    <th className="p-4 font-medium text-slate-300">Amount</th>
                    <th className="p-4 font-medium text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {guestData.history.map((booking, index) => (
                    <tr 
                      key={booking.id} 
                      className={`border-b ${index === guestData.history.length - 1 ? '' : 'border-slate-700'} hover:bg-slate-700 transition-colors`}
                    >
                      <td className="p-4 font-medium">#{booking.id}</td>
                      <td className="p-4">{booking.date}</td>
                      <td className="p-4">{booking.roomNumber}</td>
                      <td className="p-4">{booking.nights}</td>
                      <td className="p-4">${booking.amount}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 bg-opacity-10 text-green-500">
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-lg font-bold">Notes</h2>
            </div>
            
            <div className="p-6">
              <p className="text-slate-300">{guestData.notes}</p>
              <button className="mt-4 text-blue-500 hover:text-blue-400 transition-colors flex items-center">
                <Edit size={16} className="mr-1" />
                Edit Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDetails;