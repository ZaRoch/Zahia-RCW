import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

function ServicePieChart({ mg, ria, wu }) {
  const total = mg + ria + wu;
  const data = {
    labels: ['MoneyGram', 'RIA', 'Western Union'],
    datasets: [
      {
        data: [mg, ria, wu],
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)',
          'rgba(39, 174, 96, 0.7)',
          'rgba(241, 196, 15, 0.7)'
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(39, 174, 96, 1)',
          'rgba(241, 196, 15, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 16 } }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percent = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percent}%)`;
          }
        }
      }
    }
  };
  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Pie data={data} options={options} />
    </div>
  );
}

export default ServicePieChart;
