"use client";

import '../chart.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHouse, faPenToSquare} from "@fortawesome/free-solid-svg-icons";


import ResponsiveSidebar from "../components/ResponsiveSidebar";

export default function Chart(){


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
            <img src="/Bristol-Myers_Squibb_logo.png" className="bms-img"/>
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
      <div className='chart-content'>
        <h1>Contenido Principal</h1>
        <p>
          Este es el contenido principal de la página. Puedes agregar todo lo
          que desees aquí.
        </p>
        <p>
          La barra lateral permanecerá fija en el lado derecho, incluso cuando
          hagas scroll.
        </p>
      </div>
    </ResponsiveSidebar>
        </div>
    );
}