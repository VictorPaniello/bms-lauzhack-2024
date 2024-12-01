"use client";

import { useEffect, useState } from "react";
import "../table.css"; // Import the CSS file
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faChartSimple } from "@fortawesome/free-solid-svg-icons";

export default function About() {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const storedCsv = localStorage.getItem("csvData");
    if (storedCsv) {
      const rows = storedCsv.split("\n").map((row) => row.split(","));
      setCsvData(rows); // Load CSV data into state
    }
  }, []);

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedCsv = [...csvData];
    updatedCsv[rowIndex][colIndex] = value; // Update the cell value

    // Add the "edited-cell" class dynamically
    const cell = document.querySelector(
      `#cell-${rowIndex}-${colIndex}`
    );
    if (cell) {
      cell.classList.add("edited-cell");
    }

    setCsvData(updatedCsv);
  };

  const handleSave = () => {
    const csvString = csvData.map((row) => row.join(",")).join("\n");
    localStorage.setItem("csvData", csvString); // Save updated CSV data to localStorage
    alert("CSV data saved successfully!");
  };

  return (
    <div className="about-container">
      <div className="header">
        <div className="left-buttons">
          <button className="home-button">
            <a href="/">
              <FontAwesomeIcon icon={faHouse} style={{ color: "white", marginRight: "5px" }} />
              Home
            </a>
          </button>
          <button className="back-button">
            <a href="/chart">
              <FontAwesomeIcon icon={faChartSimple} style={{ color: "white", marginRight: "5px" }} />
              Chart
            </a>
          </button>
        </div>
        <img src="/Bristol-Myers_Squibb_logo.png" className="bms-img"/>
      </div>
      <h1 className="ex-fac-vol">Value editor</h1>
      <div className="table-container">
        <table className="csv-table">
          <thead>
            <tr>
              {csvData[0]?.map((header, colIndex) => (
                <th key={`header-${colIndex}`} className="sticky-header">
                  {header.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.slice(1).map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, colIndex) => (
                  <td
                    key={`cell-${rowIndex + 1}-${colIndex}`}
                    id={`cell-${rowIndex + 1}-${colIndex}`}
                    className={colIndex === 0 ? "sticky-column" : ""}
                  >
                    {colIndex === 0 ? (
                      cell.trim()
                    ) : (
                      <input
                        type="text"
                        value={cell.trim()}
                        onChange={(e) =>
                          handleCellChange(rowIndex + 1, colIndex, e.target.value)
                        }
                        className="editable-cell"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
