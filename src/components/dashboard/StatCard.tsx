import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, color }) => {
  const getBgColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-500 bg-opacity-20';
      case 'green': return 'bg-green-500 bg-opacity-20';
      case 'yellow': return 'bg-yellow-500 bg-opacity-20';
      case 'red': return 'bg-red-500 bg-opacity-20';
      default: return 'bg-blue-500 bg-opacity-20';
    }
  };

  const getTextColor = () => {
    switch (color) {
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      case 'yellow': return 'text-yellow-500';
      case 'red': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${getBgColor()}`}>
          <div className={getTextColor()}>{icon}</div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        {change >= 0 ? (
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
          {Math.abs(change)}%
        </span>
        <span className="text-slate-400 text-sm ml-1">since last week</span>
      </div>
    </div>
  );
};

export default StatCard;