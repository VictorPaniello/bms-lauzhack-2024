import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const Chart = () => {
  const [chartData, setChartData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const chartRef = useRef(null);

  useEffect(() => {
    const csvData = localStorage.getItem('csvData');

    if (csvData) {
      const rows = csvData.split('\n').filter((row) => row.trim() !== '');
      const dataPoints = rows.map((row) => {
        const columns = row.split(',');
        return {
          date: new Date(columns[0]),
          value: parseFloat(columns[1]),
        };
      });

      setChartData(dataPoints);
      setFilteredData(dataPoints);
    }
  }, []);

  useEffect(() => {
    const fetchPredictions = async () => {
      const response = await fetch('/future_predictions.csv');
      const text = await response.text();
      const rows = text.split('\n').filter((row) => row.trim() !== '');
      rows.shift();
      const predictions = rows.map((row) => {
        const [month, year, prediction] = row.split(',');
        const date = new Date(year, month - 1, 1);
        return {
          date: date,
          value: parseFloat(prediction.split('\r')[0]).toFixed(0),
        };
      });

      setPredictionData(predictions);
    };

    fetchPredictions();
  }, []);

  useEffect(() => {
    if (chartData) {
      const filtered = chartData.filter((point) => {
        const isAfterFromDate = fromDate ? new Date(fromDate) <= point.date : true;
        const isBeforeToDate = toDate ? point.date <= new Date(toDate) : true;
        return isAfterFromDate && isBeforeToDate;
      });

      setFilteredData(filtered);
    }
  }, [fromDate, toDate, chartData]);

  if (!filteredData || !predictionData) {
    return <p>Loading...</p>;
  }

  const allDates = [...filteredData, ...predictionData]
    .map((point) => point.date)
    .sort((a, b) => a - b);

  const labels = [...new Set(allDates.map((date) =>
    date.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()
  ))];

  const baseDataValues = labels.map((label) => {
    const dataPoint = filteredData.find(
      (point) =>
        point.date.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase() ===
        label
    );
    return dataPoint ? dataPoint.value : null;
  });

  const predictionDataValues = labels.map((label) => {
    const dataPoint = predictionData.find(
      (point) =>
        point.date.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase() ===
        label
    );
    return dataPoint ? dataPoint.value : null;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Base Data',
        data: baseDataValues,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.1,
        pointRadius: 5,
      },
      {
        label: 'Predictions',
        data: predictionDataValues,
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderDash: [5, 5],
        tension: 0.1,
        pointRadius: 5,
      },
    ],
  };

  return (
    <div className="chart-content" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <div className="date-picker-container">
          <label>
            <b>From Date:</b>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div className="date-picker-container">
          <label style={{ marginLeft: '10px' }}>
            <b>To Date:</b>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
      </div>

      <Line
        ref={chartRef}
        data={data}
        options={{
          plugins: {
            tooltip: {
              enabled: true,
              callbacks: {
                title: (tooltipItems) => tooltipItems[0].label,
                label: (tooltipItem) => `Value: ${tooltipItem.raw}`,
              },
            },
          },
          elements: {
            point: {
              hoverBackgroundColor: 'rgba(75,192,192,1)',
              hoverBorderColor: 'rgba(0,0,0,0.8)',
            },
          },
          interaction: {
            mode: 'nearest',
            intersect: true,
          },
          onHover: (event, chartElement) => {
            if (chartElement.length) {
              event.native.target.style.cursor = 'pointer';
            } else {
              event.native.target.style.cursor = 'default';
            }
          },
        }}
      />
    </div>
  );
};

export default Chart;
