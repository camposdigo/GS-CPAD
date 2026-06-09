export type MissionSnapshot = {
  timestamp: number;
  temperature: number;
  radiation: number;
  battery: number;
  solarInput: number;
  signal: number;
  latency: number;
  stability: number;
  orbitDrift: number;
};

export type Thresholds = {
  maxTemperature: number;
  minBattery: number;
  minSignal: number;
  maxLatency: number;
  minStability: number;
};

export type MissionProfile = {
  name: string;
  commander: string;
  orbit: string;
};

export type MissionAlert = {
  id: string;
  title: string;
  detail: string;
  severity: 'critical' | 'warning' | 'info';
  metric: string;
  value: number;
  limit: number;
};
