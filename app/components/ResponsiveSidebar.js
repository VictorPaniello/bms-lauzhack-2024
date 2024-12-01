"use client";

import { useState } from "react";
import "../ResponsiveSidebar.css";

function CollapsibleSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible-section">
      <button className="section-title" onClick={() => setIsOpen(!isOpen)}>
        {title} {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && <div className="section-content">{children}</div>}
    </div>
  );
}

export default function FixedSidebar({ children, sidebarContent }) {
  return (
    <div className="fixed-layout">
      <div className="main-content">{children}</div>

      <div className="fixed-sidebar">
        <div className="sidebar-content">
        <img src="/Bristol-Myers_Squibb_logo.png" className="bms-img"/>

            <br />
            <br />
            <br />
          <h2>Filters</h2>
          <CollapsibleSection title="Ex-factory Volumes" className="collap-section">
            <p>No filter option available</p>
          </CollapsibleSection>
          <CollapsibleSection title="Demand Volumes" className="collap-section">
            <ul>
              <li>
                <input type="checkbox" /> Categoría 1
              </li>
              <li>
                <input type="checkbox" /> Categoría 2
              </li>
              <li>
                <input type="checkbox" /> Categoría 3
              </li>
            </ul>
          </CollapsibleSection>
          <CollapsibleSection title="Activity" className="collap-section">
            <ul>
              <li>
                <input type="checkbox" /> Categoría 1
              </li>
              <li>
                <input type="checkbox" /> Categoría 2
              </li>
              <li>
                <input type="checkbox" /> Categoría 3
              </li>
            </ul>
          </CollapsibleSection>
          <CollapsibleSection title="Share of Voice" className="collap-section">
            <ul>
              <li>
                <input type="checkbox" /> Categoría 1
              </li>
              <li>
                <input type="checkbox" /> Categoría 2
              </li>
              <li>
                <input type="checkbox" /> Categoría 3
              </li>
            </ul>
          </CollapsibleSection>
          <CollapsibleSection title="New Patient Share" className="collap-section">
            <ul>
              <li>
                <input type="checkbox" /> Categoría 1
              </li>
              <li>
                <input type="checkbox" /> Categoría 2
              </li>
              <li>
                <input type="checkbox" /> Categoría 3
              </li>
            </ul>
          </CollapsibleSection>
          <CollapsibleSection title="Indication Split" className="collap-section">
            <ul>
              <li>
                <input type="checkbox" /> Categoría 1
              </li>
              <li>
                <input type="checkbox" /> Categoría 2
              </li>
              <li>
                <input type="checkbox" /> Categoría 3
              </li>
            </ul>
          </CollapsibleSection>
          <CollapsibleSection title="Date" className="collap-section">
            <label>
              From: <input type="date" />
            </label>
            <br />
            <br />
            <label>
              To: <input type="date" />
            </label>
          </CollapsibleSection>
          <CollapsibleSection title="Estado" className="collap-section">
            <ul>
              <li>
                <input type="checkbox" /> Activo
              </li>
              <li>
                <input type="checkbox" /> Inactivo
              </li>
            </ul>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
