"use client";

import '../chart.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHouse, faPenToSquare} from "@fortawesome/free-solid-svg-icons";


import ResponsiveSidebar from "../components/ResponsiveSidebar";
import Chart from "../components/Chart";

export default function ChartPage(){


    return(
        <div className='chart-container'>
            <div className="header">
                <div className="left-buttons">
                    <button className="home-button">
                        <a href="/">
                            <FontAwesomeIcon icon={faHouse} style={{ color: "white", marginRight: "5px" }} />
                            Home
                        </a>
                    </button>
                    <button className="back-button">
                        <a href="/table">
                            <FontAwesomeIcon icon={faPenToSquare} style={{ color: "white", marginRight: "5px" }} />
                            Editor
                        </a>
                    </button>
                </div>
            </div>
                <ResponsiveSidebar
      sidebarContent={
        <div>
            <br/>
            <br/>
            <br/>
          <h2>Sidebar Fija</h2>
          <p>Este es el contenido de la barra lateral fija.</p>
          <ul>
            <li>Elemento 1</li>
            <li>Elemento 2</li>
            <li>Elemento 3</li>
          </ul>
        </div>
      }
    >
      <div className='chart-content chart-content-box'>
        <h1 className='chart-name'>Predictions</h1>
          <Chart/>
      </div>
    </ResponsiveSidebar>
        </div>
    );
}