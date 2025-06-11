import React, { useState, useEffect } from 'react';
import { getExchangeRates } from '../../services/currencyService';
import { useTranslation } from 'react-i18next';

// Mock flag components - replace with actual flag icons or images
const FlagBR = () => {
  const { t } = useTranslation();
  return <span role="img" aria-label={t('components.currencyRates.brazilFlagAlt')}>🇧🇷</span>;
};
const FlagPY = () => {
  const { t } = useTranslation();
  return <span role="img" aria-label={t('components.currencyRates.paraguayFlagAlt')}>🇵🇾</span>;
};
const FlagUS = () => {
  const { t } = useTranslation();
  return <span role="img" aria-label={t('components.currencyRates.usaFlagAlt')}>🇺🇸</span>;
};
const FlagCA = () => {
  const { t } = useTranslation();
  return <span role="img" aria-label={t('components.currencyRates.canadaFlagAlt')}>🇨🇦</span>;
};
const FlagEU = () => {
  const { t } = useTranslation();
  return <span role="img" aria-label={t('components.currencyRates.euFlagAlt')}>🇪🇺</span>;
};
const FlagGB = () => {
  const { t } = useTranslation();
  return <span role="img" aria-label={t('components.currencyRates.ukFlagAlt')}>🇬🇧</span>;
};

const CurrencyRates: React.FC = () => {
  const { t } = useTranslation(); // Added for the title, though not strictly in the report for this component
  const [rates, setRates] = useState({
    USD: 1,
    PYG: 0,
    BRL: 0,
    CAD: 0,
    EUR: 0,
    GBP: 0,
  });

  useEffect(() => {
    const fetchRates = async () => {
      const allRates = await getExchangeRates();
      // Ensure that allRates and its properties are valid numbers before setting state
      const defaultRates = { USD: 1, PYG: 0, BRL: 0, CAD: 0, EUR: 0, GBP: 0 };
      setRates({
        USD: typeof allRates.USD === 'number' ? allRates.USD : defaultRates.USD,
        PYG: typeof allRates.PYG === 'number' ? allRates.PYG : defaultRates.PYG,
        BRL: typeof allRates.BRL === 'number' ? allRates.BRL : defaultRates.BRL,
        CAD: typeof allRates.CAD === 'number' ? allRates.CAD : defaultRates.CAD,
        EUR: typeof allRates.EUR === 'number' ? allRates.EUR : defaultRates.EUR,
        GBP: typeof allRates.GBP === 'number' ? allRates.GBP : defaultRates.GBP,
      });
    };
    fetchRates();
  }, []);

  const formatRate = (rate: number) => {
    return rate.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="p-4 border-t border-slate-700 text-slate-300">
      <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">{t('sidebar.financials', 'Cotações')}</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <FlagUS />
            <span className="ml-2">USD</span>
          </div>
          <span>{formatRate(rates.USD)}</span>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <FlagPY />
            <span className="ml-2">PYG</span>
          </div>
          <span>{formatRate(rates.PYG)}</span>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <FlagBR />
            <span className="ml-2">BRL</span>
          </div>
          <span>{formatRate(rates.BRL)}</span>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <FlagCA />
            <span className="ml-2">CAD</span>
          </div>
          <span>{formatRate(rates.CAD)}</span>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <FlagEU />
            <span className="ml-2">EUR</span>
          </div>
          <span>{formatRate(rates.EUR)}</span>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <FlagGB />
            <span className="ml-2">GBP</span>
          </div>
          <span>{formatRate(rates.GBP)}</span>
        </li>
      </ul>
    </div>
  );
};

export default CurrencyRates;