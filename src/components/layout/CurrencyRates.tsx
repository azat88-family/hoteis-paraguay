import React, { useState, useEffect } from 'react';
import { getExchangeRates } from '../../services/currencyService';

// Mock flag components - replace with actual flag icons or images
const FlagBR = () => <span role="img" aria-label="Brazil Flag">🇧🇷</span>;
const FlagPY = () => <span role="img" aria-label="Paraguay Flag">🇵🇾</span>;
const FlagUS = () => <span role="img" aria-label="USA Flag">🇺🇸</span>;
const FlagCA = () => <span role="img" aria-label="Canada Flag">🇨🇦</span>;
const FlagEU = () => <span role="img" aria-label="EU Flag">🇪🇺</span>;
const FlagGB = () => <span role="img" aria-label="UK Flag">🇬🇧</span>;

const CurrencyRates: React.FC = () => {
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
      setRates({
        USD: allRates.USD || 1,
        PYG: allRates.PYG || 0,
        BRL: allRates.BRL || 0,
        CAD: allRates.CAD || 0,
        EUR: allRates.EUR || 0,
        GBP: allRates.GBP || 0,
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
      <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Cotações</h3>
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