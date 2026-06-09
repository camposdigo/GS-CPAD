import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useReducer } from 'react';

import { defaultThresholds, initialTelemetry, nextSnapshot } from '@/data/mission';
import { MissionAlert, MissionProfile, MissionSnapshot, Thresholds } from '@/types/mission';

type MissionState = {
  telemetry: MissionSnapshot[];
  thresholds: Thresholds;
  profile: MissionProfile;
  loaded: boolean;
  scenario: string;
  agcProgram: string;
  agcAlarm: string | null;
  crewLog: string[];
};

type MissionContextValue = MissionState & {
  current: MissionSnapshot;
  alerts: MissionAlert[];
  health: number;
  failureProbability: number;
  missionScore: number;
  phase: 'Nominal' | 'Atencao' | 'Contingencia';
  recommendedAction: string;
  updateThresholds: (thresholds: Thresholds) => void;
  updateProfile: (profile: MissionProfile) => void;
  injectEvent: (event: MissionEvent) => void;
  sendAgcCommand: (command: string) => void;
  sendCrewMessage: (message: string) => void;
  resetMission: () => void;
};

type MissionAction =
  | { type: 'tick' }
  | { type: 'hydrate'; thresholds: Thresholds; profile: MissionProfile }
  | { type: 'thresholds'; thresholds: Thresholds }
  | { type: 'profile'; profile: MissionProfile }
  | { type: 'event'; event: MissionEvent }
  | { type: 'agc'; command: string }
  | { type: 'crew'; message: string }
  | { type: 'reset' };

export type MissionEvent = 'comm_loss' | 'power_sag' | 'thermal_spike' | 'attitude_drift' | 'clear';

const STORAGE_KEY = '@space_predictive_analytics/settings';

const defaultProfile: MissionProfile = {
  name: 'Aquila-7',
  commander: 'Rodrigo Campos Cordeiro',
  orbit: 'LEO 420 km',
};

const initialState: MissionState = {
  telemetry: initialTelemetry,
  thresholds: defaultThresholds,
  profile: defaultProfile,
  loaded: false,
  scenario: 'orbita nominal',
  agcProgram: 'P00',
  agcAlarm: null,
  crewLog: ['Tripulacao Aquila-7 em monitoramento nominal.'],
};

const MissionContext = createContext<MissionContextValue | null>(null);

function reducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {
    case 'tick': {
      const next = nextSnapshot(state.telemetry[state.telemetry.length - 1]);
      return { ...state, telemetry: [...state.telemetry.slice(-11), next] };
    }
    case 'hydrate':
      return { ...state, thresholds: action.thresholds, profile: action.profile, loaded: true };
    case 'thresholds':
      return { ...state, thresholds: action.thresholds };
    case 'profile':
      return { ...state, profile: action.profile };
    case 'event': {
      const snapshot = applyEvent(state.telemetry[state.telemetry.length - 1], action.event);
      return {
        ...state,
        telemetry: [...state.telemetry.slice(-11), snapshot],
        scenario: scenarioLabel(action.event),
        agcProgram: action.event === 'attitude_drift' ? 'P66' : action.event === 'power_sag' ? 'P00' : state.agcProgram,
        agcAlarm: action.event === 'clear' ? null : state.agcAlarm,
        crewLog:
          action.event === 'clear'
            ? ['Missao normalizada. Tripulacao confirma estabilidade dos subsistemas.']
            : [`Evento simulado: ${scenarioLabel(action.event)}. Controle recomenda resposta imediata.`, ...state.crewLog].slice(0, 5),
      };
    }
    case 'agc':
      return {
        ...state,
        agcProgram: normalizeAgcProgram(action.command, state.agcProgram),
        agcAlarm: action.command.toUpperCase().includes('120') ? action.command.toUpperCase() : null,
        crewLog: [`AGC recebeu comando ${action.command.toUpperCase()}.`, ...state.crewLog].slice(0, 5),
      };
    case 'crew':
      return {
        ...state,
        crewLog: [crewReply(action.message, state.telemetry[state.telemetry.length - 1]), ...state.crewLog].slice(0, 5),
      };
    case 'reset':
      return { ...initialState, loaded: true, thresholds: state.thresholds, profile: state.profile };
    default:
      return state;
  }
}

export function MissionProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        if (!active) return;

        dispatch({
          type: 'hydrate',
          thresholds: { ...defaultThresholds, ...parsed.thresholds },
          profile: { ...defaultProfile, ...parsed.profile },
        });
      } catch {
        dispatch({ type: 'hydrate', thresholds: defaultThresholds, profile: defaultProfile });
      }
    }

    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => dispatch({ type: 'tick' }), 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!state.loaded) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ thresholds: state.thresholds, profile: state.profile }),
    );
  }, [state.loaded, state.profile, state.thresholds]);

  const current = state.telemetry[state.telemetry.length - 1];
  const alerts = useMemo(() => buildAlerts(current, state.thresholds), [current, state.thresholds]);
  const health = useMemo(() => calculateHealth(current), [current]);
  const failureProbability = Math.max(4, Math.min(96, 100 - health + alerts.filter((alert) => alert.severity !== 'info').length * 7));
  const missionScore = Math.max(8, Math.min(100, Math.round((health + current.stability + current.battery + current.signal) / 4)));
  const phase: MissionContextValue['phase'] = alerts.some((alert) => alert.severity === 'critical')
    ? 'Contingencia'
    : alerts.some((alert) => alert.severity === 'warning')
      ? 'Atencao'
      : 'Nominal';
  const recommendedAction = recommendationFor(current, alerts);

  const value = useMemo(
    () => ({
      ...state,
      current,
      alerts,
      health,
      failureProbability,
      missionScore,
      phase,
      recommendedAction,
      updateThresholds: (thresholds: Thresholds) => dispatch({ type: 'thresholds', thresholds }),
      updateProfile: (profile: MissionProfile) => dispatch({ type: 'profile', profile }),
      injectEvent: (event: MissionEvent) => dispatch({ type: 'event', event }),
      sendAgcCommand: (command: string) => dispatch({ type: 'agc', command }),
      sendCrewMessage: (message: string) => dispatch({ type: 'crew', message }),
      resetMission: () => dispatch({ type: 'reset' }),
    }),
    [alerts, current, failureProbability, health, missionScore, phase, recommendedAction, state],
  );

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
}

function applyEvent(snapshot: MissionSnapshot, event: MissionEvent): MissionSnapshot {
  const next = { ...snapshot, timestamp: snapshot.timestamp + 1 };

  if (event === 'comm_loss') {
    return { ...next, signal: 31, latency: 930, stability: Math.max(72, snapshot.stability - 4) };
  }
  if (event === 'power_sag') {
    return { ...next, battery: 22, solarInput: 18, temperature: snapshot.temperature + 2 };
  }
  if (event === 'thermal_spike') {
    return { ...next, temperature: 84, radiation: 44, battery: Math.max(28, snapshot.battery - 8) };
  }
  if (event === 'attitude_drift') {
    return { ...next, stability: 70, orbitDrift: 0.82, signal: Math.max(42, snapshot.signal - 11) };
  }

  return {
    ...next,
    temperature: 62,
    radiation: 18,
    battery: 78,
    solarInput: 68,
    signal: 88,
    latency: 420,
    stability: 94,
    orbitDrift: 0.18,
  };
}

function scenarioLabel(event: MissionEvent) {
  const labels = {
    comm_loss: 'blackout de comunicacao',
    power_sag: 'emergencia de energia',
    thermal_spike: 'pico termico',
    attitude_drift: 'deriva orbital critica',
    clear: 'orbita nominal',
  };
  return labels[event];
}

function normalizeAgcProgram(command: string, fallback: string) {
  const normalized = command.toUpperCase().replace(/\s/g, '');
  if (normalized.includes('P52')) return 'P52';
  if (normalized.includes('P63')) return 'P63';
  if (normalized.includes('P64')) return 'P64';
  if (normalized.includes('P66')) return 'P66';
  if (normalized.includes('RESET')) return 'P00';
  return fallback;
}

function crewReply(message: string, snapshot: MissionSnapshot) {
  const lower = message.toLowerCase();
  if (lower.includes('energia')) {
    return `Controle: "${message}" | Aquila-7: bateria em ${snapshot.battery}%, priorizando cargas vitais.`;
  }
  if (lower.includes('comunic')) {
    return `Controle: "${message}" | Aquila-7: sinal em ${snapshot.signal}% e latencia em ${snapshot.latency} ms.`;
  }
  if (lower.includes('alarme')) {
    return `Controle: "${message}" | Aquila-7: alarme AGC indica sobrecarga executiva, manter tarefas prioritarias.`;
  }
  return `Controle: "${message}" | Aquila-7: tripulacao confirma leitura e aguarda proximo procedimento.`;
}

function calculateHealth(snapshot: MissionSnapshot) {
  const thermal = Math.max(0, 100 - Math.abs(snapshot.temperature - 62) * 2.4);
  const comm = (snapshot.signal + Math.max(0, 100 - snapshot.latency / 10)) / 2;
  return Math.round((thermal + comm + snapshot.battery + snapshot.stability) / 4);
}

function recommendationFor(snapshot: MissionSnapshot, alerts: MissionAlert[]) {
  if (alerts.some((alert) => alert.id === 'battery')) return 'Ativar modo de economia, reduzir carga nao essencial e reposicionar paineis solares.';
  if (alerts.some((alert) => alert.id === 'temp')) return 'Reorientar modulo termico, reduzir processamento e aguardar estabilizacao.';
  if (alerts.some((alert) => alert.id === 'signal')) return 'Priorizar pacotes de telemetria, ajustar antena e aguardar janela de solo.';
  if (alerts.some((alert) => alert.id === 'stability')) return 'Executar correcao de atitude com AGC P66 e monitorar deriva orbital.';
  if (snapshot.latency > 720) return 'Manter supervisao reforcada do link ate a proxima leitura.';
  return 'Manter operacao nominal e continuar coleta de telemetria.';
}

export function useMission() {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used inside MissionProvider');
  }
  return context;
}

function buildAlerts(snapshot: MissionSnapshot, thresholds: Thresholds): MissionAlert[] {
  const alerts: MissionAlert[] = [];

  if (snapshot.temperature >= thresholds.maxTemperature) {
    alerts.push({
      id: 'temp',
      title: 'Temperatura critica',
      detail: 'Modulo termico acima do limite operacional.',
      severity: 'critical',
      metric: 'Temperatura',
      value: snapshot.temperature,
      limit: thresholds.maxTemperature,
    });
  }

  if (snapshot.battery <= thresholds.minBattery) {
    alerts.push({
      id: 'battery',
      title: 'Energia baixa',
      detail: 'Carga projetada insuficiente para manobras longas.',
      severity: 'critical',
      metric: 'Bateria',
      value: snapshot.battery,
      limit: thresholds.minBattery,
    });
  }

  if (snapshot.signal <= thresholds.minSignal) {
    alerts.push({
      id: 'signal',
      title: 'Sinal degradado',
      detail: 'Link de telemetria com risco de perda temporaria.',
      severity: 'warning',
      metric: 'Sinal',
      value: snapshot.signal,
      limit: thresholds.minSignal,
    });
  }

  if (snapshot.latency >= thresholds.maxLatency) {
    alerts.push({
      id: 'latency',
      title: 'Latencia elevada',
      detail: 'Tempo de resposta fora da janela ideal de comando.',
      severity: 'warning',
      metric: 'Latencia',
      value: snapshot.latency,
      limit: thresholds.maxLatency,
    });
  }

  if (snapshot.stability <= thresholds.minStability) {
    alerts.push({
      id: 'stability',
      title: 'Estabilidade orbital reduzida',
      detail: 'Modelo preditivo recomenda correcao de atitude.',
      severity: 'warning',
      metric: 'Estabilidade',
      value: snapshot.stability,
      limit: thresholds.minStability,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'nominal',
      title: 'Operacao nominal',
      detail: 'Todos os limiares monitorados estao dentro do planejado.',
      severity: 'info',
      metric: 'Missao',
      value: 100,
      limit: 100,
    });
  }

  return alerts;
}
