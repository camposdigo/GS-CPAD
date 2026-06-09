import { MissionSnapshot, Thresholds } from '@/types/mission';

export const defaultThresholds: Thresholds = {
  maxTemperature: 74,
  minBattery: 34,
  minSignal: 58,
  maxLatency: 780,
  minStability: 82,
};

export const initialTelemetry: MissionSnapshot[] = [
  { timestamp: 1, temperature: 62, radiation: 18, battery: 82, solarInput: 68, signal: 91, latency: 380, stability: 95, orbitDrift: 0.18 },
  { timestamp: 2, temperature: 64, radiation: 22, battery: 78, solarInput: 62, signal: 88, latency: 420, stability: 94, orbitDrift: 0.21 },
  { timestamp: 3, temperature: 67, radiation: 25, battery: 72, solarInput: 58, signal: 80, latency: 510, stability: 90, orbitDrift: 0.26 },
  { timestamp: 4, temperature: 69, radiation: 29, battery: 63, solarInput: 53, signal: 74, latency: 620, stability: 88, orbitDrift: 0.31 },
  { timestamp: 5, temperature: 72, radiation: 31, battery: 52, solarInput: 49, signal: 66, latency: 700, stability: 84, orbitDrift: 0.38 },
  { timestamp: 6, temperature: 76, radiation: 36, battery: 41, solarInput: 42, signal: 59, latency: 790, stability: 81, orbitDrift: 0.44 },
];

export function nextSnapshot(previous: MissionSnapshot): MissionSnapshot {
  const wave = Math.sin(previous.timestamp / 1.7);
  const drift = Math.cos(previous.timestamp / 2.4);

  return {
    timestamp: previous.timestamp + 1,
    temperature: clamp(round(previous.temperature + wave * 3.2 - 0.6), 48, 84),
    radiation: clamp(round(previous.radiation + drift * 2.4 + 0.2), 10, 46),
    battery: clamp(round(previous.battery - 2.8 + drift * 2.1), 18, 96),
    solarInput: clamp(round(56 + wave * 14 + drift * 6), 18, 92),
    signal: clamp(round(previous.signal - 2.4 + drift * 4.4), 34, 98),
    latency: clamp(round(previous.latency + wave * 72 + 18), 260, 980),
    stability: clamp(round(previous.stability - 1.2 + drift * 2.7), 70, 99),
    orbitDrift: clamp(Number((previous.orbitDrift + 0.035 + wave * 0.018).toFixed(2)), 0.08, 0.82),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value);
}
