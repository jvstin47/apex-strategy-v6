/**
 * HeaderNav Component (v6)
 * Top navigation header displaying circuit context, mode tabs, share link button, and demo trigger.
 */

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { VIEW_TABS } from '../../config/constants';

export default function HeaderNav({
  activeTrack,
  selectedTrackId,
  viewTab,
  onSelectTab,
  onRunDemo,
  loading,
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', viewTab);
    if (selectedTrackId) url.searchParams.set('track', selectedTrackId);
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.history.replaceState({}, '', url.toString());
    }
  };

  const renderTabButton = (tab) => (
    <button
      key={tab.id}
      type="button"
      className={`mode-btn ${viewTab === tab.id ? 'active' : ''}`}
      onClick={() => onSelectTab(tab)}
    >
      {tab.label}
    </button>
  );

  return (
    <header className="app-header">
      <div className="brand">
        <div className="logo-badge">F1</div>
        <div className="brand-text">
          <h1>Apex Strategy v6</h1>
          <p>
            v6 • Virtual Grid • VSC/Red Flag • OpenF1 Replay{' '}
            {activeTrack ? `• ${activeTrack.name}` : ''}
          </p>
        </div>
      </div>

      <div className="mode-toggle">
        {VIEW_TABS.slice(0, 3).map(renderTabButton)}
        <button
          type="button"
          className="demo-btn"
          onClick={onRunDemo}
          disabled={loading}
        >
          ▶ Run Demo Scenario
        </button>
        {VIEW_TABS.slice(3).map(renderTabButton)}
        <button
          type="button"
          className="mode-btn"
          onClick={handleShare}
          title="Copy shareable scenario link"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
        >
          <Share2 size={13} />
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>
    </header>
  );
}
