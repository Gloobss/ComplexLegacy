import React, { useState } from 'react';

const tabs = [
  { label: 'General', content: <div>Contenido general...</div> },
  { label: 'Normativas', content: <div>Aquí van tus normativas ordenadas...</div> },
];

export default function NormativasTabs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === idx ? '2px solid #4c6fff' : 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === idx ? '#4c6fff' : '#333',
              fontWeight: activeTab === idx ? 'bold' : 'normal',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ padding: '20px' }}>
        {tabs[activeTab].content}
      </div>
    </div>
  );
}