import React, { useEffect, useState } from 'react';
import { History, Play } from 'lucide-react';
import { v6Service } from '../../services/v6Service';
import { DRY_COMPOUNDS } from '../../config/constants';

export default function ReplayTab() {
  const [sessions, setSessions] = useState([]);
  const [selectedId, setSelectedId] = useState('silverstone_2023');
  const [detail, setDetail] = useState(null);
  const [whatIfLap, setWhatIfLap] = useState(33);
  const [proposedCompound, setProposedCompound] = useState('soft');
  const [counterfactual, setCounterfactual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    v6Service
      .getReplaySessions()
      .then((list) => {
        if (Array.isArray(list)) setSessions(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    v6Service
      .getReplaySession(selectedId, false)
      .then((data) => {
        setDetail(data);
        setCounterfactual(null);
        const firstPit = data?.events?.find((e) => e.type === 'pit');
        if (firstPit) setWhatIfLap(firstPit.lap);
      })
      .catch((err) => setError(err.message));
  }, [selectedId]);

  const handleRunCounterfactual = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await v6Service.runReplayCounterfactual({
        session_id: selectedId,
        what_if_lap: whatIfLap,
        proposed_compound: proposedCompound,
        search_budget: 250,
      });
      setCounterfactual(res);
    } catch (err) {
      setError(err.message || 'Counterfactual evaluation failed.');
    } finally {
      setLoading(false);
    }
  };

  const maxLap = detail?.stints?.[detail.stints.length - 1]?.end_lap || 57;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.25rem', width: '100%' }}>
      <div className="card">
        <div className="card-title">
          <History size={18} style={{ color: '#06b6d4' }} />
          OpenF1 Historical Replay (v6)
        </div>

        <div className="form-group">
          <label className="form-label">Grand Prix Session</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: '6px',
              background: '#0f172a',
              color: '#fff',
              border: '1px solid var(--border-color)',
            }}
          >
            {sessions.map((s) => (
              <option key={s.session_id} value={s.session_id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group slider-container">
          <div className="form-label">
            <span>Counterfactual Decision Lap</span>
            <span className="slider-val">Lap {whatIfLap}</span>
          </div>
          <input
            type="range"
            min={1}
            max={maxLap}
            value={whatIfLap}
            onChange={(e) => setWhatIfLap(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">What-If Compound</label>
          <div className="compound-selector">
            {DRY_COMPOUNDS.map((c) => (
              <button
                key={c}
                type="button"
                className={`compound-pill ${proposedCompound === c ? `selected-${c}` : ''}`}
                onClick={() => setProposedCompound(c)}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="btn-primary" onClick={handleRunCounterfactual} disabled={loading}>
          {loading ? <div className="spinner"></div> : <Play size={16} fill="currentColor" />}
          Compare Real vs. MCTS
        </button>

        {error && (
          <div role="alert" style={{ marginTop: '0.75rem', color: '#ef4444', fontSize: '0.8rem' }}>
            {error}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">{detail?.name || 'Race Timeline & Counterfactual'}</div>
        {detail && (
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <strong>Actual Pit-Wall Strategy:</strong> {detail.actual_strategy} ({detail.actual_time_seconds}s)
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {detail.events?.map((ev, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.06)',
                    color: ev.type === 'sc' ? '#eab308' : '#cbd5e1',
                  }}
                >
                  Lap {ev.lap} ({ev.type.toUpperCase()}): {ev.note}
                </span>
              ))}
            </div>
          </div>
        )}

        {counterfactual && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
            <div className="stats-banner" style={{ marginBottom: '1rem' }}>
              <div className="stat-box">
                <div className="stat-label">Actual Pit-Wall Call</div>
                <div className="stat-value" style={{ fontSize: '1.1rem' }}>
                  {counterfactual.actual_action}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">MCTS Recommendation</div>
                <div className="stat-value" style={{ fontSize: '1.1rem', color: '#4ade80' }}>
                  {counterfactual.mcts_recommended_action}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">What-If Delta ({counterfactual.proposed_action})</div>
                <div className="stat-value" style={{ fontSize: '1.1rem' }}>
                  {counterfactual.proposed_vs_actual_delta_seconds !== null
                    ? `${counterfactual.proposed_vs_actual_delta_seconds > 0 ? '+' : ''}${counterfactual.proposed_vs_actual_delta_seconds}s`
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
