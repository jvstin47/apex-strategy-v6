import { describe, it, expect } from 'vitest';
import {
  ALL_COMPOUNDS,
  DRY_COMPOUNDS,
  MCTS_PIT_COMPOUNDS,
  SEARCH_MODES,
  VIEW_TABS,
} from './constants';

describe('frontend config constants', () => {
  it('defines all five F1 tire compounds and dry subset', () => {
    expect(ALL_COMPOUNDS.map((c) => c.id)).toEqual([
      'soft',
      'medium',
      'hard',
      'intermediate',
      'wet',
    ]);
    expect(DRY_COMPOUNDS).toEqual(['soft', 'medium', 'hard']);
    expect(MCTS_PIT_COMPOUNDS).toContain('intermediate');
  });

  it('orders MCTS search budgets monotonically', () => {
    expect(SEARCH_MODES.fast.search_budget).toBeLessThan(
      SEARCH_MODES.balanced.search_budget
    );
    expect(SEARCH_MODES.balanced.search_budget).toBeLessThan(
      SEARCH_MODES.accurate.search_budget
    );
  });

  it('exposes unique tab ids', () => {
    const ids = VIEW_TABS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('racesim');
  });
});
