import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Placeholder for Hotel Header component
const HotelHeader = () => (
  <div className="bg-gray-800 p-4 text-white mb-6 rounded">
    <div className="container mx-auto flex justify-between items-center">
      <div>
        <img src="/public/hotel-icon.svg" alt="Hotel Logo" className="h-12 mr-3 inline" />
        <span className="text-xl font-bold">Hotel Name</span>
      </div>
      <div>
        <p className="text-sm">123 Main Street, City, Country</p>
        <p className="text-sm">Phone: (123) 456-7890 | Email: info@hotel.com</p>
      </div>
    </div>
  </div>
);

interface CardProps {
  title: string;
  description: string;
  linkTo: string;
}

const InfoCard: React.FC<CardProps> = ({ title, description, linkTo }) => {
  return (
    <Link to={linkTo} className="block transform transition-transform hover:scale-105">
      <div className="bg-slate-800 shadow-lg rounded-lg p-6 min-h-[150px] flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-sky-400 mb-2">{title}</h3>
          <p className="text-slate-300">{description}</p>
        </div>
      </div>
    </Link>
  );
};

const PortalPage: React.FC = () => {
  const { t } = useTranslation();

  // These keys would ideally be in your translation files
  const cardData = [
    {
      title: t('portal.adminArea.title', 'Área do Administrador'),
      description: t('portal.adminArea.description', 'Acesso aos dados gerais do hotel e gerenciamento.'),
      linkTo: '/login/admin', // Changed to admin login
    },
    {
      title: t('portal.ownerArea.title', 'Área do Proprietário'),
      description: t('portal.ownerArea.description', 'Visão completa dos dados financeiros e metas de negócios.'),
      linkTo: '/login/owner', // Changed to owner login
    },
    {
      title: t('portal.attendantArea.title', 'Área do Atendente'),
      description: t('portal.attendantArea.description', 'Gerenciamento de quartos, calendário de locações e manutenções.'),
      linkTo: '/login/attendant', // Changed to attendant login
    },
  ];

  return (
    <div className="container mx-auto">
      <HotelHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card) => (
          <InfoCard key={card.title} title={card.title} description={card.description} linkTo={card.linkTo} />
        ))}
      </div>
    </div>
  );
};

export default PortalPage;