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
  const fileInputRef = useRef(null); // Use a React ref for the file input

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileName(file.name); // Update the file name in state
      setFileAttached(true);

      const reader = new FileReader();

      // Read the file as text
      reader.onload = () => {
        // Save the file content to local storage
        localStorage.setItem("csvData", reader.result);
        console.log("CSV content saved to localStorage:", reader.result);
      };

      reader.readAsText(file); // Read file as text for CSV files
    } else {
      setFileName("");
      setFileAttached(false);
    }
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
        <Link href="/table" className="charts-link">
          View our Charts!
        </Link>
      </main>

      <footer>
        &copy; 2024 Health Charts. Empowering you to make better health decisions.
      </footer>
    </div>
  );
}
