/**
 * ErrorBoundary Component
 * Catches unexpected React render or chart exceptions and offers a recovery reset.
 */

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected UI error occurred.',
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset() {
    this.setState({ hasError: false, errorMessage: '' });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="card"
          role="alert"
          style={{
            margin: '2rem auto',
            maxWidth: '560px',
            borderColor: 'rgba(239, 68, 68, 0.45)',
            textAlign: 'center',
          }}
        >
          <div className="card-title" style={{ justifyContent: 'center', color: '#ef4444' }}>
            <AlertTriangle size={20} />
            Something went wrong rendering this view
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {this.state.errorMessage}
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={this.handleReset}
            style={{ margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={15} />
            Recover View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
