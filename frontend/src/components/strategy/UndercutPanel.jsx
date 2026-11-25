/**
 * UndercutPanel Component
 * Configuration card for the two-car dirty-air undercut / overcut probability simulation.
 */

import React from 'react';
import { Play, Zap } from 'lucide-react';

export default function UndercutPanel({
  undercutParams,
  onChange,
  onRunUndercut,
  loading,
}) {
  return (
    <div className="card">
      <div className="card-title">
        <Zap size={18} style={{ color: '#06b6d4' }} />
        Undercut Battle Parameters
      </div>

      <div className="form-group">
        <div className="form-label">
          <span>Defender (Car B) Pit Lap</span>
          <span className="slider-val">Lap {undercutParams.base_pit_lap_b}</span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min={10}
            max={40}
            value={undercutParams.base_pit_lap_b}
            onChange={(e) =>
              onChange((p) => ({
                ...p,
                base_pit_lap_b: parseInt(e.target.value, 10),
              }))
            }
          />
        </div>
      </div>

      <div className="form-group">
        <div className="form-label">
          <span>Initial Gap (Car A Behind B)</span>
          <span className="slider-val">{undercutParams.initial_gap_seconds.toFixed(1)}s</span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min={0.2}
            max={3.0}
            step={0.1}
            value={undercutParams.initial_gap_seconds}
            onChange={(e) =>
              onChange((p) => ({
                ...p,
                initial_gap_seconds: parseFloat(e.target.value),
              }))
            }
          />
        </div>
      </div>

      <div className="form-group">
        <div className="form-label">
          <span>Dirty Air Penalty / Lap</span>
          <span className="slider-val">+{undercutParams.dirty_air_penalty.toFixed(2)}s</span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min={0.0}
            max={0.6}
            step={0.05}
            value={undercutParams.dirty_air_penalty}
            onChange={(e) =>
              onChange((p) => ({
                ...p,
                dirty_air_penalty: parseFloat(e.target.value),
              }))
            }
          />
        </div>
      </div>

      <button type="button" className="btn-primary" onClick={onRunUndercut} disabled={loading}>
        {loading ? <div className="spinner"></div> : <Play size={18} fill="currentColor" />}
        Analyze Undercut Curve
      </button>
    </div>
  );
}
