import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Chart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Retrieve CSV data from localStorage
    const csvData = localStorage.getItem('csvData');

    if (csvData) {
      // Parse CSV
      const rows = csvData.split('\n').filter(row => row.trim() !== '');
      const dataPoints = rows.map(row => {
        const columns = row.split(',');
        const date = new Date(columns[0]);
        const value = parseFloat(columns[1]);

        return {
          date: date.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase(),
          value: value,
        };
      });

      // Format for Chart.js
      const labels = dataPoints.map(point => point.date);
      const values = dataPoints.map(point => point.value);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Time Series Data',
            data: values,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            tension: 0.1,
          },
        ],
      });
    }
  }, []);

  if (!chartData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="chart-content">
      <Line data={chartData} />
    </div>
  );
};

export default Chart;
