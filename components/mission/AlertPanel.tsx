import { StyleSheet, Text, View } from 'react-native';

import { MissionAlert } from '@/types/mission';

const palette = {
  critical: '#ff6b6b',
  warning: '#ffd166',
  info: '#55d6be',
};

export function AlertPanel({ alert }: { alert: MissionAlert }) {
  const color = palette[alert.severity];

  return (
    <View style={[styles.panel, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Text style={[styles.severity, { color }]}>{alert.severity.toUpperCase()}</Text>
        <Text style={styles.metric}>{alert.metric}</Text>
      </View>
      <Text style={styles.title}>{alert.title}</Text>
      <Text style={styles.detail}>{alert.detail}</Text>
      <Text style={styles.value}>
        Atual: {Math.round(alert.value)} | Limite: {Math.round(alert.limit)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#101c2d',
    borderColor: '#243850',
    borderLeftWidth: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: 7,
    padding: 14,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severity: {
    fontSize: 11,
    fontWeight: '900',
  },
  metric: {
    color: '#8fa4ba',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: '#f7fbff',
    fontSize: 17,
    fontWeight: '800',
  },
  detail: {
    color: '#aebccd',
    fontSize: 13,
    lineHeight: 19,
  },
  value: {
    color: '#d7e5f2',
    fontSize: 12,
    fontWeight: '700',
  },
});
