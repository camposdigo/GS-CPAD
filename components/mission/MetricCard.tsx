import { StyleSheet, Text, View } from 'react-native';

import { Card } from './Card';

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  accent?: string;
};

export function MetricCard({ label, value, detail, accent = '#73d4ff' }: MetricCardProps) {
  return (
    <Card style={styles.card}>
      <View style={[styles.beacon, { backgroundColor: accent }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 148,
  },
  beacon: {
    borderRadius: 4,
    height: 8,
    marginBottom: 12,
    width: 34,
  },
  label: {
    color: '#91a7bd',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    color: '#f7fbff',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
  },
  detail: {
    color: '#aab8c8',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
});
