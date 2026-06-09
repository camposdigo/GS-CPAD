import { StyleSheet, Text, View } from 'react-native';

import { BigMetric, GlassPanel, MissionHeader } from '@/components/mission/ControlVisuals';
import { MiniBarChart } from '@/components/mission/MiniBarChart';
import { ProgressBar } from '@/components/mission/ProgressBar';
import { Screen } from '@/components/mission/Screen';
import { useMission } from '@/context/MissionContext';

export default function DashboardsScreen() {
  const { current, phase, telemetry } = useMission();

  return (
    <Screen>
      <MissionHeader
        eyebrow="Telemetria ao vivo"
        title="Vetor de estado"
        body="Leitura simulada dos subsistemas de sensores, energia, comunicacao e estabilidade orbital."
      />

      <View style={styles.grid}>
        <BigMetric label="Fase" value={phase} detail="estado operacional" tone={phase === 'Nominal' ? 'green' : phase === 'Atencao' ? 'amber' : 'red'} />
        <BigMetric label="Temp" value={`${current.temperature} C`} detail="avionica" tone="amber" />
      </View>

      <GlassPanel>
        <MiniBarChart
          title="Sensores: temperatura"
          values={telemetry.map((point) => point.temperature)}
          max={90}
          color="#ff8fab"
        />
        <Text style={styles.caption}>Radiacao atual: {current.radiation} uSv/h</Text>
      </GlassPanel>

      <GlassPanel>
        <MiniBarChart
          title="Energia: bateria"
          values={telemetry.map((point) => point.battery)}
          max={100}
          color="#55d6be"
        />
        <View style={styles.stack}>
          <ProgressBar label="Bateria" value={current.battery} color="#55d6be" />
          <ProgressBar label="Entrada solar" value={current.solarInput} color="#ffd166" />
        </View>
      </GlassPanel>

      <GlassPanel>
        <MiniBarChart
          title="Comunicacao: sinal"
          values={telemetry.map((point) => point.signal)}
          max={100}
          color="#73d4ff"
        />
        <View style={styles.row}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{current.signal}%</Text>
            <Text style={styles.statLabel}>Qualidade</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{current.latency} ms</Text>
            <Text style={styles.statLabel}>Latencia</Text>
          </View>
        </View>
      </GlassPanel>

      <GlassPanel>
        <Text style={styles.cardTitle}>Estabilidade orbital</Text>
        <ProgressBar label="Modelo preditivo" value={current.stability} color="#b892ff" />
        <Text style={styles.caption}>Deriva calculada: {current.orbitDrift.toFixed(2)} graus por ciclo.</Text>
      </GlassPanel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  caption: {
    color: '#9fb0c3',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 14,
  },
  stack: {
    gap: 14,
    marginTop: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  stat: {
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderRadius: 8,
    flex: 1,
    padding: 14,
  },
  statValue: {
    color: '#f7fbff',
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: '#9fb0c3',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  cardTitle: {
    color: '#eef6ff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
});
