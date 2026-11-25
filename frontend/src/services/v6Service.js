/**
 * v6 API Service
 * Handles 10-car Virtual Grid, Weather Crossover Curves, and OpenF1 Historical Replay endpoints.
 */

import { api } from './api';

export const v6Service = {
  simulateGrid(payload) {
    return api.post('/simulate-grid', payload);
  },

  getWeatherCrossover(baseLapTime = 94.0, tireAge = 5) {
    return api.get(
      `/weather/crossover?base_lap_time=${encodeURIComponent(baseLapTime)}&tire_age=${encodeURIComponent(tireAge)}`
    );
  },

  getReplaySessions() {
    return api.get('/replay/sessions');
  },

  getReplaySession(sessionId, fetchLive = false) {
    return api.get(`/replay/session/${encodeURIComponent(sessionId)}?fetch_live=${fetchLive}`);
  },

  runReplayCounterfactual(payload) {
    return api.post('/replay/counterfactual', payload);
  },
};

export default v6Service;
