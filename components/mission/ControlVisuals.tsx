import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MissionEvent } from '@/context/MissionContext';

export function MissionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

export function GlassPanel({ children }: PropsWithChildren) {
  return <View style={styles.panel}>{children}</View>;
}

export function BigMetric({
  label,
  value,
  detail,
  tone = 'cyan',
}: {
  label: string;
  value: string;
  detail: string;
  tone?: 'cyan' | 'green' | 'amber' | 'red' | 'fiap';
}) {
  return (
    <View style={styles.metric}>
      <View style={[styles.metricRail, { backgroundColor: toneColor(tone) }]} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </View>
  );
}

export function CommandButton({
  label,
  onPress,
  event,
}: {
  label: string;
  onPress: () => void;
  event?: MissionEvent;
}) {
  const danger = event && event !== 'clear';
  return (
    <Pressable style={({ pressed }) => [styles.button, danger && styles.buttonDanger, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function OrbitMap({ stability, drift }: { stability: number; drift: number }) {
  const dotLeft = 16 + (Math.max(0.1, drift) / 0.82) * 68;
  const dotTop = 50 - Math.sin(dotLeft / 13) * 24;

  return (
    <GlassPanel>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Mapa orbital</Text>
        <Text style={styles.panelTag}>posicao simulada</Text>
      </View>
      <View style={styles.orbitMap}>
        <View style={styles.earth} />
        <View style={styles.orbitRing} />
        <View style={[styles.orbiter, { left: `${dotLeft}%`, top: `${dotTop}%`, backgroundColor: stability < 82 ? '#ed145b' : '#74f28b' }]} />
        <Text style={[styles.mapTag, styles.ground]}>GS</Text>
        <Text style={[styles.mapTag, styles.saa]}>SAA</Text>
      </View>
      <Text style={styles.caption}>Deriva {drift.toFixed(2)} graus/ciclo | estabilidade {stability}%</Text>
    </GlassPanel>
  );
}

export function SpacecraftPanel({ phase, altitude, velocity }: { phase: string; altitude: string; velocity: string }) {
  const critical = phase === 'Contingencia';
  const warning = phase === 'Atencao';

  return (
    <GlassPanel>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Visor da nave</Text>
        <Text style={styles.panelTag}>estado visual</Text>
      </View>
      <View style={styles.viewport}>
        <View style={styles.hudRow}>
          <Hud label="ALT" value={altitude} />
          <Hud label="VEL" value={velocity} />
          <Hud label="MODE" value={phase.toUpperCase()} />
        </View>
        <View style={[styles.ship, critical && styles.shipCritical, warning && styles.shipWarning]}>
          <View style={styles.solarLeft} />
          <View style={styles.shipBody} />
          <View style={styles.capsule} />
          <View style={styles.window} />
          <View style={styles.flame} />
          <View style={styles.solarRight} />
        </View>
        <Text style={[styles.overlay, critical && styles.overlayCritical, warning && styles.overlayWarning]}>
          {phase.toUpperCase()}
        </Text>
      </View>
    </GlassPanel>
  );
}

function Hud({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.hud}>
      <Text style={styles.hudLabel}>{label}</Text>
      <Text style={styles.hudValue}>{value}</Text>
    </View>
  );
}

function toneColor(tone: 'cyan' | 'green' | 'amber' | 'red' | 'fiap') {
  return {
    cyan: '#4fd6ff',
    green: '#74f28b',
    amber: '#ffd166',
    red: '#ff4f5e',
    fiap: '#ed145b',
  }[tone];
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    paddingTop: 8,
  },
  eyebrow: {
    color: '#ed145b',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f7f7f2',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 39,
    textTransform: 'uppercase',
  },
  body: {
    color: '#c9cbd3',
    fontSize: 14,
    lineHeight: 21,
  },
  panel: {
    backgroundColor: 'rgba(8, 10, 15, 0.92)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  panelHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  panelTitle: {
    color: '#f7f7f2',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  panelTag: {
    color: '#a2a5ad',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metric: {
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    minWidth: 0,
    padding: 15,
  },
  metricRail: {
    height: 5,
    marginBottom: 16,
    width: 40,
  },
  metricLabel: {
    color: '#a2a5ad',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#f7f7f2',
    fontSize: 31,
    fontWeight: '900',
    marginTop: 10,
  },
  metricDetail: {
    color: '#cfd2dc',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 6,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  buttonDanger: {
    borderColor: 'rgba(237,20,91,0.55)',
    backgroundColor: 'rgba(237,20,91,0.14)',
  },
  pressed: {
    opacity: 0.72,
  },
  buttonText: {
    color: '#f7f7f2',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  orbitMap: {
    backgroundColor: '#03050a',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    height: 260,
    overflow: 'hidden',
  },
  earth: {
    backgroundColor: '#0b3d91',
    borderRadius: 60,
    height: 120,
    left: '50%',
    marginLeft: -60,
    marginTop: -60,
    position: 'absolute',
    top: '50%',
    width: 120,
  },
  orbitRing: {
    borderColor: 'rgba(255,255,255,0.32)',
    borderRadius: 160,
    borderWidth: 1,
    bottom: 62,
    left: 28,
    position: 'absolute',
    right: 28,
    top: 62,
  },
  orbiter: {
    borderRadius: 11,
    height: 22,
    marginLeft: -11,
    marginTop: -11,
    position: 'absolute',
    width: 22,
  },
  mapTag: {
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    color: '#a2a5ad',
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 5,
    position: 'absolute',
  },
  ground: {
    bottom: 42,
    right: 54,
  },
  saa: {
    color: '#ed145b',
    left: 48,
    top: 52,
  },
  caption: {
    color: '#a2a5ad',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 12,
  },
  viewport: {
    backgroundColor: '#03050a',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    minHeight: 300,
    overflow: 'hidden',
    padding: 12,
  },
  hudRow: {
    flexDirection: 'row',
    gap: 8,
  },
  hud: {
    backgroundColor: 'rgba(2,2,4,0.7)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    flex: 1,
    padding: 9,
  },
  hudLabel: {
    color: '#a2a5ad',
    fontSize: 10,
    fontWeight: '900',
  },
  hudValue: {
    color: '#4fd6ff',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },
  ship: {
    alignSelf: 'center',
    height: 150,
    marginTop: 44,
    position: 'relative',
    transform: [{ rotate: '-10deg' }],
    width: 260,
  },
  shipWarning: {
    opacity: 0.9,
  },
  shipCritical: {
    opacity: 0.82,
  },
  shipBody: {
    backgroundColor: '#c8ced8',
    height: 50,
    left: 104,
    position: 'absolute',
    top: 52,
    width: 112,
  },
  capsule: {
    backgroundColor: '#f4f7fb',
    borderRadius: 8,
    height: 62,
    left: 204,
    position: 'absolute',
    top: 46,
    width: 64,
  },
  window: {
    backgroundColor: '#4fd6ff',
    borderRadius: 12,
    height: 24,
    left: 228,
    position: 'absolute',
    top: 64,
    width: 24,
  },
  solarLeft: {
    backgroundColor: '#0b3d91',
    borderColor: '#4fd6ff',
    borderWidth: 1,
    height: 34,
    left: 8,
    position: 'absolute',
    top: 60,
    width: 90,
  },
  solarRight: {
    backgroundColor: '#0b3d91',
    borderColor: '#4fd6ff',
    borderWidth: 1,
    height: 34,
    left: 198,
    position: 'absolute',
    top: 60,
    width: 72,
  },
  flame: {
    backgroundColor: '#fc3d21',
    height: 22,
    left: 70,
    position: 'absolute',
    top: 66,
    width: 38,
  },
  overlay: {
    borderColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    bottom: 16,
    color: '#74f28b',
    fontSize: 12,
    fontWeight: '900',
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: 'absolute',
  },
  overlayWarning: {
    color: '#ffd166',
  },
  overlayCritical: {
    color: '#ff4f5e',
  },
});
