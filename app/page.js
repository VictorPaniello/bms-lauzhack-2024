"use client";

import '/app/globals.css';
import Link from 'next/link';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faFileCsv } from "@fortawesome/free-solid-svg-icons";

import React, { useState } from 'react';


export default function Home() {
  
  const [fileAttached, setFileAttached] = useState(false);

  const handleFileChange = (event) => {
      if (event.target.files.length > 0) {
        document.getElementById('attach-file').innerHTML = event.target.files[0].name;
          setFileAttached(true);
      } else {
          setFileAttached(false);
      }
  };
    
  return (
    <div className="container">
    <header>
      <h1>Welcome to <img src="https://lauzhack.com/images/logo.svg" className="lauzhack-logo"></img></h1>
      <p>This is the Home Page of our predictive Health Charts.</p>
    </header>

    <main>
      <div className='description'>
        <p className='description-para'>
          Explore a variety of charts that help you track and understand health-related
          trends such as exercise, nutrition, and wellness statistics.
        </p>
      </div>
      <div>
      <form>
        <label className="attach-file" id='attach-file'>
          <input
            type="file"
            accept=".csv, .xlsx"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <FontAwesomeIcon icon={faFolderOpen} style={{ color: "white" }} />
          Attach a file
          {fileAttached && (
              <FontAwesomeIcon
                icon={faFileCsv}
                style={{ color: "white", marginLeft: "10px" }}
            /> 
          )}
        </label>
      </form>
    </div>
      
      <p>Click the button below to get started:</p>
      <Link href="/dashboard" className='charts-link'>View our Charts!</Link>
    </main>

    <footer>
      &copy; 2024 Health Charts. Empowering you to make better health decisions.
    </footer>
  </div>
  );
}