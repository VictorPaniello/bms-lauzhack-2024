"use client";

import { useState } from "react";
import "../ResponsiveSidebar.css";

function CollapsibleSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible-section">
      {/* Título del filtro */}
      <button className="section-title" onClick={() => setIsOpen(!isOpen)}>
        {title} {isOpen ? "▲" : "▼"}
      </button>

      {/* Contenido colapsable */}
      {isOpen && <div className="section-content">{children}</div>}
    </div>
  );
}

export default function FixedSidebar({ children, sidebarContent }) {
  return (
    <div className="fixed-layout">
      {/* Contenido principal */}
      <div className="main-content">{children}</div>

      {/* Sidebar fija */}
      <div className="fixed-sidebar">
        <div className="sidebar-content">
            <br />
            <br />
            <br />
          <h2>Filters</h2>
          {/* Collapsible Sections */}
          <CollapsibleSection title="Ex-factory Volumes" className="collap-section">
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
