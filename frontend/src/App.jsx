/**
 * Root Application Component
 * Coordinates top navigation, active tab views, and global alerts using StrategyContext.
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { Play } from 'lucide-react';

import { StrategyProvider } from './context/StrategyContext';
import { useStrategyContext, useSimulation, useOptimizer } from './hooks';
import { VIEW_TABS } from './config/constants';

import {
  ColdStartOverlay,
  ErrorBanner,
  ErrorBoundary,
  HeaderNav,
  TrackSelector,
  DriverSelector,
  FastF1Banner,
  StatsBanner,
} from './components/common';

import {
  StrategyForm,
  OptimizerPanel,
  AlternativesTable,
  UndercutPanel,
} from './components/strategy';

const ResultsChart = lazy(() => import('./components/charts/ResultsChart'));
const UndercutChart = lazy(() => import('./components/charts/UndercutChart'));
const WeatherVarianceChart = lazy(() => import('./components/charts/WeatherVarianceChart'));
const WeatherCrossoverChart = lazy(() => import('./components/charts/WeatherCrossoverChart'));
const VirtualGridPanel = lazy(() => import('./components/charts/VirtualGridPanel'));
const DriverImpactChart = lazy(() => import('./components/charts/DriverImpactChart'));
const StintTimeline = lazy(() => import('./components/charts/StintTimeline'));
const RaceSimulatorTab = lazy(() => import('./components/simulator/RaceSimulatorTab'));
const ReplayTab = lazy(() => import('./components/simulator/ReplayTab'));

function DashboardLayout() {
  const {
    serverWaking,
    viewTab,
    setViewTab,
    mode,
    setMode,
    activeSubTab,
    setActiveSubTab,
    tracks,
    selectedTrackId,
    drivers,
    calibrationData,
    error,
    setError,
    handleSelectTrack,
  } = useStrategyContext();

  const {
    strategyA,
    setStrategyA,
    strategyB,
    setStrategyB,
    singleResults,
    compareResults,
    undercutResults,
    undercutParams,
    setUndercutParams,
    weatherDryData,
    weatherMixedData,
    loading: simLoading,
    simulate: handleSimulate,
    runUndercut: handleRunUndercut,
    runDemo: handleRunDemo,
  } = useSimulation();

  const {
    results: optimizeResults,
    loading: optLoading,
    optimize: handleOptimize,
  } = useOptimizer();

  const loading = simLoading || optLoading;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const trackParam = params.get('track');
    if (tabParam) {
      const matched = VIEW_TABS.find((t) => t.id === tabParam);
      if (matched) {
        setViewTab(matched.id);
        if (matched.targetMode) setMode(matched.targetMode);
      }
    }
    if (trackParam && tracks[trackParam]) {
      handleSelectTrack(trackParam);
    }
  }, [tracks, handleSelectTrack, setMode, setViewTab]);

  const handleSelectTab = (tab) => {
    setViewTab(tab.id);
    if (tab.targetMode) {
      setMode(tab.targetMode);
    }
  };

  return (
    <div className="app-container">
      <ColdStartOverlay isWaking={serverWaking} />

      <HeaderNav
        activeTrack={tracks[selectedTrackId]}
        selectedTrackId={selectedTrackId}
        viewTab={viewTab}
        onSelectTab={handleSelectTab}
        onRunDemo={handleRunDemo}
        loading={loading}
      />

      {/* FastF1 Validation Banner */}
      {viewTab === 'fastf1' && (
        <FastF1Banner
          calibrationData={calibrationData}
          simMeanTime={singleResults?.summary?.mean}
        />
      )}

      {/* Main Stats Banner */}
      {['sim', 'sc', 'weather'].includes(viewTab) && (
        <StatsBanner
          mode={mode}
          singleSummary={singleResults?.summary}
          compareData={compareResults}
        />
      )}

      {/* Global Error Banner */}
      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      {/* Track Selector */}
      {['sim', 'sc', 'weather'].includes(viewTab) && (
        <TrackSelector
          tracks={tracks}
          selectedTrackId={selectedTrackId}
          onSelectTrack={handleSelectTrack}
        />
      )}

      {/* Main Layout Grid */}
      <main className="dashboard-grid">
        {/* Left Sidebar */}
        <div className="sidebar">
          {viewTab === 'undercut' ? (
            <UndercutPanel
              undercutParams={undercutParams}
              onChange={setUndercutParams}
              onRunUndercut={handleRunUndercut}
              loading={loading}
            />
          ) : viewTab === 'racesim' ? (
            <Suspense fallback={<div className="card">Loading simulator...</div>}>
              <RaceSimulatorTab
                trackId={selectedTrackId}
                driverId={strategyA.driver_id}
                onDriverChange={(d) => setStrategyA((p) => ({ ...p, driver_id: d }))}
                drivers={drivers}
              />
            </Suspense>
          ) : (
            <>
              {mode === 'compare' && (
                <div className="strategy-tabs">
                  <button
                    className={`tab-btn ${activeSubTab === 'a' ? 'active-a' : ''}`}
                    onClick={() => setActiveSubTab('a')}
                  >
                    Strategy A ({strategyA.compounds?.length || 2}-Stop)
                  </button>
                  <button
                    className={`tab-btn ${activeSubTab === 'b' ? 'active-b' : ''}`}
                    onClick={() => setActiveSubTab('b')}
                  >
                    Strategy B ({strategyB.compounds?.length || 2}-Stop)
                  </button>
                </div>
              )}

              {viewTab === 'weather' ? (
                <StrategyForm
                  strategy={strategyA}
                  setStrategy={setStrategyA}
                  title="Weather Configuration"
                  showSafetyCarControls={false}
                  weatherEnabled={true}
                />
              ) : viewTab === 'optimize' ? (
                <OptimizerPanel
                  trackId={selectedTrackId}
                  onOptimize={handleOptimize}
                  loading={loading}
                />
              ) : mode === 'single' ? (
                <StrategyForm
                  strategy={strategyA}
                  setStrategy={setStrategyA}
                  title="Strategy Configuration"
                  showSafetyCarControls={viewTab === 'sc'}
                  weatherEnabled={false}
                />
              ) : activeSubTab === 'a' ? (
                <StrategyForm
                  strategy={strategyA}
                  setStrategy={setStrategyA}
                  title="Strategy A Setup"
                  accentColor="var(--strat-a)"
                  showSafetyCarControls={true}
                  weatherEnabled={false}
                />
              ) : (
                <StrategyForm
                  strategy={strategyB}
                  setStrategy={setStrategyB}
                  title="Strategy B Setup"
                  accentColor="var(--strat-b)"
                  showSafetyCarControls={true}
                  weatherEnabled={false}
                />
              )}

              {['sim', 'sc', 'weather'].includes(viewTab) && (
                <DriverSelector
                  drivers={drivers}
                  selectedDriver={
                    mode === 'single' || activeSubTab === 'a'
                      ? strategyA.driver_id
                      : strategyB.driver_id
                  }
                  onSelectDriver={(d) => {
                    if (mode === 'single' || activeSubTab === 'a') {
                      setStrategyA((p) => ({ ...p, driver_id: d }));
                    } else {
                      setStrategyB((p) => ({ ...p, driver_id: d }));
                    }
                  }}
                />
              )}

              {viewTab !== 'optimize' && viewTab !== 'racesim' && (
                <button className="btn-primary" onClick={handleSimulate} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Simulating Laps...
                    </>
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" />
                      Run Monte Carlo (10k)
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>

        {/* Right Output Panel */}
        <div className="chart-panel">
          <Suspense fallback={<div className="card">Loading telemetry view...</div>}>
            {viewTab === 'grid' ? (
              <VirtualGridPanel trackId={selectedTrackId} strategy={strategyA} />
            ) : viewTab === 'replay' ? (
              <ReplayTab />
            ) : viewTab === 'undercut' ? (
              <UndercutChart curveData={undercutResults?.curve_data} />
            ) : viewTab === 'weather' ? (
              <>
                <WeatherVarianceChart dryData={weatherDryData} weatherData={weatherMixedData} />
                <WeatherCrossoverChart baseLapTime={tracks[selectedTrackId]?.base_lap_time || 94.0} />
              </>
            ) : viewTab === 'optimize' ? (
              <>
                {optimizeResults && (
                  <>
                    <StintTimeline
                      stints={optimizeResults.optimal_strategy}
                      expectedTime={optimizeResults.expected_time}
                      numLaps={tracks[selectedTrackId]?.num_laps || 57}
                    />
                    <AlternativesTable
                      alternatives={optimizeResults.top_5_alternatives}
                      optimalTime={optimizeResults.expected_time}
                    />
                    <ResultsChart
                      mode="single"
                      data={optimizeResults.monte_carlo_distribution?.summary?.histogram}
                      singleSummary={optimizeResults.monte_carlo_distribution?.summary}
                    />
                  </>
                )}
              </>
            ) : viewTab === 'racesim' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#9ca3af',
                }}
              >
                MCTS Re-Optimization Panel Active (Left Sidebar)
              </div>
            ) : (
              <>
                {mode === 'compare' && compareResults && (
                  <DriverImpactChart compareData={compareResults} drivers={drivers} />
                )}
                <ResultsChart
                  mode={mode}
                  data={
                    mode === 'single'
                      ? singleResults?.summary?.histogram
                      : compareResults?.combined_histogram
                  }
                  singleSummary={singleResults?.summary}
                />
              </>
            )}
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StrategyProvider>
        <ErrorBoundary>
          <DashboardLayout />
        </ErrorBoundary>
      </StrategyProvider>
    </ErrorBoundary>
  );
}
