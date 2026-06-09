import { StyleSheet, Text, View } from 'react-native';

import { BigMetric, CommandButton, MissionHeader, OrbitMap, SpacecraftPanel } from '@/components/mission/ControlVisuals';
import { ProgressBar } from '@/components/mission/ProgressBar';
import { Screen } from '@/components/mission/Screen';
import { useMission } from '@/context/MissionContext';

export default function HomeScreen() {
  const {
    alerts,
    current,
    failureProbability,
    health,
    injectEvent,
    missionScore,
    phase,
    profile,
    recommendedAction,
  } = useMission();
  const criticalCount = alerts.filter((alert) => alert.severity === 'critical').length;

  return (
    <Screen>
      <MissionHeader
        eyebrow="Missao orbital experimental"
        title="Mission Control AI"
        body={`Centro inteligente para monitorar energia, comunicacao e status operacional da missao ${profile.name}.`}
      />

      <View style={styles.grid}>
        <BigMetric label="Saude da missao" value={`${health}%`} detail={phase} tone={phase === 'Contingencia' ? 'red' : phase === 'Atencao' ? 'amber' : 'green'} />
        <BigMetric label="Readiness score" value={`${missionScore}%`} detail="indice preditivo" tone="cyan" />
        <BigMetric label="Falha prevista" value={`${failureProbability}%`} detail="probabilidade" tone="fiap" />
        <BigMetric label="Alertas" value={`${alerts.length}`} detail={`${criticalCount} criticos`} tone="red" />
      </View>

      <View style={styles.recommendation}>
        <Text style={styles.recommendationLabel}>Acao recomendada</Text>
        <Text style={styles.recommendationText}>{recommendedAction}</Text>
      </View>

      <SpacecraftPanel phase={phase} altitude="420 km" velocity="7.66 km/s" />
      <OrbitMap stability={current.stability} drift={current.orbitDrift} />

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Vetor de estado</Text>
        <View style={styles.stack}>
          <ProgressBar label="Energia" value={current.battery} color="#74f28b" />
          <ProgressBar label="Comunicacao" value={current.signal} color="#4fd6ff" />
          <ProgressBar label="Estabilidade orbital" value={current.stability} color="#b892ff" />
          <ProgressBar label="Radiacao ambiente" value={current.radiation * 2} color="#ed145b" />
        </View>
      </View>

      <View style={styles.commandGrid}>
        <CommandButton label="Falha comunicacao" event="comm_loss" onPress={() => injectEvent('comm_loss')} />
        <CommandButton label="Queda energia" event="power_sag" onPress={() => injectEvent('power_sag')} />
        <CommandButton label="Pico termico" event="thermal_spike" onPress={() => injectEvent('thermal_spike')} />
        <CommandButton label="Normalizar" event="clear" onPress={() => injectEvent('clear')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  recommendation: {
    backgroundColor: 'rgba(237,20,91,0.14)',
    borderColor: 'rgba(237,20,91,0.38)',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  recommendationLabel: {
    color: '#ed145b',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  recommendationText: {
    color: '#f7f7f2',
    fontSize: 16,
    fontWeight: '800',
    flexShrink: 1,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: 'rgba(8, 10, 15, 0.92)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: '#f7f7f2',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  stack: {
    gap: 14,
  },
  commandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
