import React from 'react';
import { useTranslation } from 'react-i18next';

// Placeholder for Hotel Header component - In a real app, this would be a shared component
const HotelHeader = () => {
  const { t } = useTranslation(); // Added t hook for the alt text
  return (
    <div className="bg-gray-800 p-4 text-white mb-6 rounded">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <img src="/public/hotel-icon.svg" alt={t('components.layout.hotelLogoAlt')} className="h-12 mr-3 inline" />
          <span className="text-xl font-bold">Hotel Name</span>
        </div>
        <div>
        <p className="text-sm">123 Main Street, City, Country</p>
        <p className="text-sm">Phone: (123) 456-7890 | Email: info@hotel.com</p>
      </div>
    </div>
  </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto">
      <HotelHeader />
      <div className="bg-slate-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-sky-400 mb-4">{t('adminDashboard.title', 'Painel do Administrador')}</h1>
        <p className="text-slate-300">
          {t('adminDashboard.welcomeMessage', 'Bem-vindo ao painel do administrador. Aqui você terá acesso aos dados gerais do hotel, excluindo informações sensíveis de clientes como cartões de crédito e valores totais de locação.')}
        </p>
        {/* Placeholder for admin-specific components and data */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-sky-500 mb-3">{t('adminDashboard.generalHotelData', 'Dados Gerais do Hotel')}</h2>
          <p className="text-slate-400">{t('adminDashboard.dataPlaceholder', 'Gráficos de ocupação, relatórios de check-in/check-out, status dos quartos, etc.')}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;