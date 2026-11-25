import { describe, it, expect } from 'vitest';
import {
  formatRaceTime,
  formatShortRaceTime,
  formatFullRaceDuration,
  formatSeconds,
} from './formatters';

describe('formatters', () => {
  it('formats standard race times with zero-padded seconds', () => {
    expect(formatRaceTime(545.2)).toBe('9m 05.20s');
    expect(formatRaceTime(5300)).toBe('88m 20.00s');
    expect(formatRaceTime(null)).toBe('-');
  });

  it('formats compact axis labels', () => {
    expect(formatShortRaceTime(125.4)).toBe('2m 5s');
    expect(formatShortRaceTime(undefined)).toBe('-');
  });

  it('formats full race durations in hours, minutes, and seconds', () => {
    expect(formatFullRaceDuration(5635.8)).toBe('1h 33m 55.8s');
    expect(formatFullRaceDuration(Number.NaN)).toBe('-');
  });

  it('formats scalar seconds with configurable precision', () => {
    expect(formatSeconds(1.2345)).toBe('1.23s');
    expect(formatSeconds(1.2345, 1)).toBe('1.2s');
    expect(formatSeconds(null)).toBe('-');
  });
});
