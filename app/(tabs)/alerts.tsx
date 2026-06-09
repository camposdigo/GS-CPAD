import { StyleSheet, Text, View } from 'react-native';

import { AlertPanel } from '@/components/mission/AlertPanel';
import { CommandButton, GlassPanel, MissionHeader } from '@/components/mission/ControlVisuals';
import { Screen } from '@/components/mission/Screen';
import { useMission } from '@/context/MissionContext';

export default function AlertsScreen() {
  const { alerts, current, injectEvent, phase, recommendedAction, resetMission, scenario, thresholds } = useMission();
  const activeAlerts = alerts.filter((alert) => alert.severity !== 'info');

  return (
    <Screen>
      <MissionHeader
        eyebrow="Resposta critica"
        title={activeAlerts.length ? `${activeAlerts.length} incidente(s)` : 'Missao estavel'}
        body="Alertas automaticos por limiar critico, linha do tempo operacional e simulador de contingencias."
      />

      <GlassPanel>
        <Text style={styles.cardTitle}>Resumo de decisao</Text>
        <Text style={styles.body}>
          Temperatura {current.temperature} C, bateria {current.battery}%, sinal {current.signal}% e
          latencia {current.latency} ms. Fase: {phase}. Cenario: {scenario}.
        </Text>
        <Text style={styles.recommendation}>{recommendedAction}</Text>
      </GlassPanel>

      <View style={styles.commandGrid}>
        <CommandButton label="Falha comm" event="comm_loss" onPress={() => injectEvent('comm_loss')} />
        <CommandButton label="Energia" event="power_sag" onPress={() => injectEvent('power_sag')} />
        <CommandButton label="Termico" event="thermal_spike" onPress={() => injectEvent('thermal_spike')} />
        <CommandButton label="Deriva" event="attitude_drift" onPress={() => injectEvent('attitude_drift')} />
        <CommandButton label="Reset" event="clear" onPress={resetMission} />
      </View>

      <View style={styles.list}>
        {alerts.map((alert) => (
          <AlertPanel key={alert.id} alert={alert} />
        ))}
      </View>

      <GlassPanel>
        <Text style={styles.cardTitle}>Linha do tempo</Text>
        <TimelineItem time="T+00:01" text={`Cenario carregado: ${scenario}.`} />
        <TimelineItem time="T+00:02" text={`Fase operacional: ${phase}.`} />
        <TimelineItem time="T+00:03" text={recommendedAction} />
      </GlassPanel>

      <GlassPanel>
        <Text style={styles.cardTitle}>Limiar atual</Text>
        <Text style={styles.limit}>Temp max: {thresholds.maxTemperature} C</Text>
        <Text style={styles.limit}>Bateria min: {thresholds.minBattery}%</Text>
        <Text style={styles.limit}>Sinal min: {thresholds.minSignal}%</Text>
        <Text style={styles.limit}>Latencia max: {thresholds.maxLatency} ms</Text>
        <Text style={styles.limit}>Estabilidade min: {thresholds.minStability}%</Text>
      </GlassPanel>
    </Screen>
  );
}

function TimelineItem({ time, text }: { time: string; text: string }) {
  return (
    <View style={styles.timelineItem}>
      <Text style={styles.timelineTime}>{time}</Text>
      <Text style={styles.timelineText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    color: '#f7f7f2',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  body: {
    color: '#cfd2dc',
    fontSize: 14,
    lineHeight: 21,
  },
  recommendation: {
    color: '#ed145b',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 20,
    marginTop: 12,
  },
  list: {
    gap: 12,
  },
  commandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timelineItem: {
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    padding: 12,
  },
  timelineTime: {
    color: '#4fd6ff',
    fontSize: 12,
    fontWeight: '900',
    width: 64,
  },
  timelineText: {
    color: '#cfd2dc',
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  limit: {
    color: '#c5d2df',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 22,
  },
});
