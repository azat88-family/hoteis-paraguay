import React from 'react';
import { useTranslation } from 'react-i18next';
const OwnerDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4"> {/* Added p-4 for some padding */}
      <div className="bg-slate-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-amber-400 mb-4">{t('ownerDashboard.title', 'Painel do Proprietário')}</h1> {/* Changed color for owner */}
        <p className="text-slate-300">
          {t('ownerDashboard.welcomeMessage', 'Bem-vindo ao painel do proprietário. Aqui você terá acesso a todos os dados do hotel, com ênfase nas entradas financeiras e sugestões de metas para otimizar o negócio.')}
        </p>
        
        {/* Placeholder for owner-specific components and data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Financial Data Section */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold text-amber-500 mb-3">{t('ownerDashboard.financialData', 'Dados Financeiros')}</h2>
            <p className="text-slate-400 mb-2">{t('ownerDashboard.financialPlaceholder', 'Relatórios de receita, despesas, lucratividade, etc.')}</p>
            {/* Example placeholder for a chart or key metrics */}
            <div className="bg-slate-600 p-3 rounded mt-2">
              <p className="text-sm text-slate-300">{t('ownerDashboard.revenueChartPlaceholder', 'Gráfico de Receita (Exemplo)')}</p>
            </div>
          </div>

          {/* Business Goals Section */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold text-amber-500 mb-3">{t('ownerDashboard.businessGoals', 'Metas de Negócios')}</h2>
            <p className="text-slate-400 mb-2">{t('ownerDashboard.goalsPlaceholder', 'Análise de desempenho, sugestões de melhorias, acompanhamento de metas.')}</p>
            <div className="bg-slate-600 p-3 rounded mt-2">
              <p className="text-sm text-slate-300">{t('ownerDashboard.kpiPlaceholder', 'Principais Indicadores de Desempenho (KPIs) (Exemplo)')}</p>
            </div>
          </div>
        </div>

        {/* Further sections can be added here, e.g., Occupancy Reports, Guest Feedback Summaries */}
        <div className="mt-6 bg-slate-700 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-amber-500 mb-3">{t('ownerDashboard.occupancyReports', 'Relatórios de Ocupação')}</h2>
          <p className="text-slate-400">{t('ownerDashboard.occupancyPlaceholder', 'Taxas de ocupação, tendências, etc.')}</p>
        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;