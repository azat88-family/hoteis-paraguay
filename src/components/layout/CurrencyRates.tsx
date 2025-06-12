import React, { useState, useEffect } from 'react';
import { getExchangeRates } from '../../services/currencyService';
import { useTranslation } from 'react-i18next';

interface FlagIconProps {
  countryCode: string;
  altText: string;
}

const FlagIcon: React.FC<FlagIconProps> = ({ countryCode, altText }) => {
  return (
    <img
      src={`https://flagcdn.com/${countryCode}.svg`}
      alt={altText}
      width="20"
      className="inline mr-2" // Added inline styling for consistency
    />
  );
};

const CurrencyRates: React.FC = () => {
  const { t } = useTranslation();
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
            <FlagIcon countryCode="us" altText={t('components.currencyRates.usaFlagAlt')} />
            <span className="ml-2">USD</span>
          </div>
          <span>{formatRate(rates.USD)}</span>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <FlagIcon countryCode="py" altText={t('components.currencyRates.paraguayFlagAlt')} />
            <span className="ml-2">PYG</span>
          </div>
          <span>{formatRate(rates.PYG)}</span>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <FlagIcon countryCode="br" altText={t('components.currencyRates.brazilFlagAlt')} />
            <span className="ml-2">BRL</span>
          </div>
          <span>{formatRate(rates.BRL)}</span>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <FlagIcon countryCode="ca" altText={t('components.currencyRates.canadaFlagAlt')} />
            <span className="ml-2">CAD</span>
          </div>
          <span>{formatRate(rates.CAD)}</span>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <FlagIcon countryCode="eu" altText={t('components.currencyRates.euFlagAlt')} />
            <span className="ml-2">EUR</span>
          </div>
          <span>{formatRate(rates.EUR)}</span>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <FlagIcon countryCode="gb" altText={t('components.currencyRates.ukFlagAlt')} />
            <span className="ml-2">GBP</span>
          </div>
          <span>{formatRate(rates.GBP)}</span>
        </li>
      </ul>
    </div>
  );
};

export default CurrencyRates;