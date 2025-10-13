'use client'
import { useState, useEffect } from 'react';
export const ScaleControllers: React.FC = () => {
  const [nightlordScale, setNightlordScale] = useState(1.0);
  const [buildingScale, setBuildingScale] = useState(1.0);
  const [eventScale, setEventScale] = useState(1.0);
  useEffect(() => {
    document.documentElement.style.setProperty('--nightlord-icon-scale', nightlordScale.toString());
  }, [nightlordScale]);
  useEffect(() => {
    document.documentElement.style.setProperty('--building-icon-scale', buildingScale.toString());
  }, [buildingScale]);
  useEffect(() => {
    document.documentElement.style.setProperty('--event-icon-scale', eventScale.toString());
  }, [eventScale]);
  return (
    <div className="scale-controllers">
      <h3 className="text-white text-sm font-bold mb-3">Icon Scale Controls</h3>
      <div className="scale-controller">
        <label htmlFor="nightlord-scale">Nightlord Icon</label>
        <input
          id="nightlord-scale"
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={nightlordScale}
          onChange={(e) => setNightlordScale(parseFloat(e.target.value))}
        />
        <div className="scale-value">{nightlordScale.toFixed(1)}x</div>
      </div>
      <div className="scale-controller">
        <label htmlFor="building-scale">Building Icons (01-27)</label>
        <input
          id="building-scale"
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={buildingScale}
          onChange={(e) => setBuildingScale(parseFloat(e.target.value))}
        />
        <div className="scale-value">{buildingScale.toFixed(1)}x</div>
      </div>
      <div className="scale-controller">
        <label htmlFor="event-scale">Event Icon</label>
        <input
          id="event-scale"
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={eventScale}
          onChange={(e) => setEventScale(parseFloat(e.target.value))}
        />
        <div className="scale-value">{eventScale.toFixed(1)}x</div>
      </div>
    </div>
  );
};