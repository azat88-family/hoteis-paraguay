import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OccupancyChart: React.FC = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: '#475569',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: '#334155',
        },
        ticks: {
          color: '#94a3b8',
        },
        beginAtZero: true,
        max: 100,
      },
    },
    barPercentage: 0.6,
  };

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Standard Rooms',
        data: [65, 70, 80, 75, 90, 95, 85],
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
      {
        label: 'Deluxe Rooms',
        data: [55, 60, 85, 70, 80, 90, 75],
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
      {
        label: 'Suite Rooms',
        data: [45, 50, 60, 85, 75, 80, 70],
        backgroundColor: '#f97316',
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="h-72">
      <Bar options={options} data={data} />
    </div>
  );
};

export default OccupancyChart;