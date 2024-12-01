"use client";

import '/app/globals.css';
import Link from 'next/link';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faFileCsv } from "@fortawesome/free-solid-svg-icons";

import React, { useState, useRef } from "react";

export default function Home() {
  const [fileAttached, setFileAttached] = useState(false);
  const [fileName, setFileName] = useState("");
  const [csvData, setCsvData] = useState([]);

  const fileInputRef = useRef(null); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileName(file.name); 
      setFileAttached(true);

      const reader = new FileReader();

      reader.onload = () => {
        localStorage.setItem("csvData", reader.result);
        console.log("CSV content saved to localStorage:", reader.result);
      };

      reader.readAsText(file); 
    } else {
      setFileName("");
      setFileAttached(false);
    }
  };

  const handleSave = async () => {
    const csvData = localStorage.getItem("csvData")
    if (!csvData) {
      alert("No CSV data found to save.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/run-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csvData }),
      });

  
      if (response.ok) {
        const updatedResponse = await fetch("updated_data.csv");
        if (updatedResponse.ok) {
          const updatedCsvNew = await updatedResponse.text();
          localStorage.setItem("csvData", updatedCsvNew);
          alert("CSV data saved and prediction updated successfully!");
        }
      } else {
        alert("Failed to update prediction. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the prediction.");
    }
    window.location.href = "/chart"
  };

  return (
    <div className="container">
      <header>
        <h1>
          Welcome to{" "}
          <img
            src="https://lauzhack.com/images/logo.svg"
            className="lauzhack-logo"
            alt="Lauzhack Logo"
          />
        </h1>
        <p>This is the Home Page of our predictive Health Charts.</p>
      </header>

      <main>
        <div className="description">
          <p className="description-para">
            Explore a variety of charts that help you track and understand health-related
            trends such as exercise, nutrition, and wellness statistics.
          </p>
        </div>
        <div>
          <form>
            <label className="attach-file">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                id="fileInput"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <FontAwesomeIcon icon={faFolderOpen} style={{ color: "white" }} />
              Attach a file
            </label>
          </form>
          {fileAttached && (
            <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={faFileCsv}
                style={{ color: "green", marginRight: "5px" }}
              />
              <span>{fileName}</span>
            </div>
          )}
        </div>

        <p>Click the button below to get started:</p>
        <button onClick={handleSave} className="charts-link">
          View our Charts!
        </button>
      </main>

      <footer>
        &copy; 2024 Health Charts. Empowering you to make better health decisions.
      </footer>
    </div>
  );
}
