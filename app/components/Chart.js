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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tooltip, setTooltip] = useState({
    visible: false,
    value: null,
    date: null,
    x: 0,
    y: 0,
  });
  const chartRef = useRef(null);

  // Load the initial CSV data
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
      setFilteredData(dataPoints); // Initially, show all data
    }
  }, []);

  // Apply the date filter whenever `fromDate` or `toDate` changes
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

  const handleChartClick = (event) => {
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const elements = chart.getElementsAtEventForMode(
      event,
      'nearest',
      { intersect: true },
      false
    );

    if (elements.length > 0) {
      const element = elements[0];
      const datasetIndex = element.datasetIndex;
      const index = element.index;

      const value = filteredData[index].value;
      const date = filteredData[index].date.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase();

      const { x, y } = element.element;

      setTooltip({
        visible: true,
        value: new Intl.NumberFormat('en-DE').format(value),
        date: date,
        x: x,
        y: y,
      });
    } else {
      setTooltip({ visible: false, value: null, date: null, x: 0, y: 0 });
    }
  };

  if (!filteredData) {
    return <p>Loading...</p>;
  }

  const labels = filteredData.map((point) =>
    point.date.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()
  );
  const values = filteredData.map((point) => point.value);

  const data = {
    labels,
    datasets: [
      {
        label: 'Time Series Data',
        data: values,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.1,
        pointRadius: 5,
      },
    ],
  };

  return (
    <div className="chart-content" style={{ position: 'relative' }}>
      {/* Date Filters */}
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
          <label style={{marginLeft: '10px'}}>
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

      {/* Chart */}
      <Line
        ref={chartRef}
        data={data}
        options={{
          plugins: {
            tooltip: {
              enabled: false, // Disable default tooltip
            },
          },
          elements: {
            point: {
              hoverBackgroundColor: 'rgba(75,192,192,1)', // Highlight point on hover
              hoverBorderColor: 'rgba(0,0,0,0.8)', // Add border on hover
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
          onClick: handleChartClick,
        }}
      />

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y - 10, // Adjust tooltip to appear above the point
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
            pointerEvents: 'none',
            transform: 'translate(-50%, -100%)',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{tooltip.date}</div>
          <div>{`Value: ${tooltip.value}`}</div>
          <div
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '0',
              height: '0',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '10px solid white',
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Chart;
