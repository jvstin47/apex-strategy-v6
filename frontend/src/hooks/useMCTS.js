/**
 * useMCTS Hook
 * Encapsulates live MCTS race state transitions and replanning requests.
 */

import { useState, useCallback } from 'react';
import { SEARCH_MODES } from '../config/constants';
import { optimizationService } from '../services/optimizationService';

const WEATHER_CYCLE = { dry: 'damp', damp: 'wet', wet: 'dry' };

const INITIAL_STATE_OVERRIDES = {
  compound: 'medium',
  tire_age: 1,
  weather_state: 'dry',
  is_sc_active: false,
  stops_made: 0,
};

export function useMCTS({ trackId, driverId }) {
  const [currentLap, setCurrentLap] = useState(1);
  const [stateOverrides, setStateOverrides] = useState(INITIAL_STATE_OVERRIDES);
  const [riskAversion, setRiskAversion] = useState(0.5);
  const [searchMode, setSearchMode] = useState('balanced');
  const [mctsData, setMctsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runReplan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const modeConfig = SEARCH_MODES[searchMode] || SEARCH_MODES.balanced;
      const payload = {
        track_id: trackId || 'bahrain',
        driver_id: driverId || 'generic',
        current_lap: currentLap,
        risk_aversion: riskAversion,
        weather_enabled: true,
        weather_start_state: stateOverrides.weather_state,
        search_budget: modeConfig.search_budget,
        refine_top_k: modeConfig.refine_top_k,
        current_state_overrides: stateOverrides,
      };
      const data = await optimizationService.runMCTSReplan(payload);
      setMctsData(data);
    } catch (err) {
      setError(err.message || 'Failed to compute MCTS decision tree');
    } finally {
      setLoading(false);
    }
  }, [trackId, driverId, currentLap, riskAversion, searchMode, stateOverrides]);

  const advanceLap = useCallback(() => {
    setCurrentLap((prev) => prev + 1);
    setStateOverrides((prev) => ({
      ...prev,
      tire_age: prev.tire_age + 1,
    }));
  }, []);

  const toggleSafetyCar = useCallback(() => {
    setStateOverrides((prev) => ({ ...prev, is_sc_active: !prev.is_sc_active }));
  }, []);

  const cycleWeather = useCallback(() => {
    setStateOverrides((prev) => ({
      ...prev,
      weather_state: WEATHER_CYCLE[prev.weather_state] || 'dry',
    }));
  }, []);

  const executePit = useCallback((compound) => {
    setStateOverrides((prev) => ({
      ...prev,
      compound,
      tire_age: 1,
      stops_made: prev.stops_made + 1,
    }));
  }, []);

  const resetRace = useCallback(() => {
    setCurrentLap(1);
    setStateOverrides(INITIAL_STATE_OVERRIDES);
    setMctsData(null);
    setError(null);
  }, []);

  return {
    currentLap,
    stateOverrides,
    riskAversion,
    setRiskAversion,
    searchMode,
    setSearchMode,
    mctsData,
    loading,
    error,
    runReplan,
    advanceLap,
    toggleSafetyCar,
    cycleWeather,
    executePit,
    resetRace,
  };
}

export default useMCTS;
