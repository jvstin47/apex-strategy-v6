import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CloudRain } from 'lucide-react';
import { v6Service } from '../../services/v6Service';

export default function WeatherCrossoverChart({ baseLapTime = 94.0 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let active = true;
    v6Service
      .getWeatherCrossover(baseLapTime, 5)
      .then((res) => {
        if (active && Array.isArray(res)) setData(res);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [baseLapTime]);

  if (data.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <div className="card-title">
        <CloudRain size={18} style={{ color: '#22c55e' }} />
        Compound Crossover Curve (Track Wetness 0% → 100%)
      </div>
      <div style={{ width: '100%', height: '260px', marginTop: '0.75rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="wetness_pct"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              stroke="#64748b"
              domain={['auto', 'auto']}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(v) => `${v}s`}
            />
            <Tooltip
              formatter={(value) => [`${value}s`, '']}
              labelFormatter={(label) => `Track Wetness: ${label}%`}
              contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
            />
            <Legend />
            <Line type="monotone" dataKey="slick_time" stroke="#eab308" strokeWidth={2.5} dot={false} name="Slick (Medium)" />
            <Line type="monotone" dataKey="intermediate_time" stroke="#22c55e" strokeWidth={2.5} dot={false} name="Intermediate" />
            <Line type="monotone" dataKey="wet_time" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Full Wet" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
