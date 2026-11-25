import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Users, Play } from 'lucide-react';
import { v6Service } from '../../services/v6Service';

export default function VirtualGridPanel({ trackId, strategy }) {
  const [startPos, setStartPos] = useState(5);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runGridSim = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        track_id: trackId || 'bahrain',
        compounds: strategy?.compounds || ['soft', 'medium', 'hard'],
        pit_laps: strategy?.pit_laps || [16, 37],
        start_position: startPos,
        num_simulations: 400,
      };
      const res = await v6Service.simulateGrid(payload);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to run virtual grid simulation.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = result
    ? Object.entries(result.position_distribution).map(([pos, count]) => ({
        position: pos,
        count,
      }))
    : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem', width: '100%' }}>
      <div className="card">
        <div className="card-title">
          <Users size={18} style={{ color: '#06b6d4' }} />
          10-Car Virtual Grid (v6)
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Simulates dirty-air traffic and DRS overtakes against 9 rival strategies using circuit overtaking difficulty.
        </p>

        <div className="form-group slider-container">
          <div className="form-label">
            <span>Grid Start Position</span>
            <span className="slider-val">P{startPos}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={startPos}
            onChange={(e) => setStartPos(Number(e.target.value))}
          />
        </div>

        <button type="button" className="btn-primary" onClick={runGridSim} disabled={loading}>
          {loading ? <div className="spinner"></div> : <Play size={16} fill="currentColor" />}
          Simulate Virtual Pack
        </button>

        {error && (
          <div role="alert" style={{ marginTop: '0.75rem', color: '#ef4444', fontSize: '0.8rem' }}>
            {error}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Projected Finish Position Distribution</div>
        {!result ? (
          <p style={{ color: 'var(--text-muted)', padding: '3rem 0', textAlign: 'center' }}>
            Click &ldquo;Simulate Virtual Pack&rdquo; to evaluate track-position outcomes on {trackId}.
          </p>
        ) : (
          <>
            <div className="stats-banner" style={{ marginBottom: '1rem' }}>
              <div className="stat-box">
                <div className="stat-label">Mean Finish</div>
                <div className="stat-value">P{result.mean_finish_position}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Podium Prob</div>
                <div className="stat-value">{result.podium_probability_pct}%</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Avg Overtakes</div>
                <div className="stat-value">{result.mean_overtakes}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Dirty-Air Loss</div>
                <div className="stat-value">+{result.mean_traffic_loss_seconds}s</div>
              </div>
            </div>

            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="position" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Races" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
