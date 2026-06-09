import { StyleSheet, Text, View } from 'react-native';

type ProgressBarProps = {
  label: string;
  value: number;
  color?: string;
  suffix?: string;
};

export function ProgressBar({ label, value, color = '#55d6be', suffix = '%' }: ProgressBarProps) {
  return (
    <View style={styles.group}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {Math.round(value)}
          {suffix}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(3, Math.min(100, value))}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#c5d2df',
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    color: '#f7fbff',
    fontSize: 13,
    fontWeight: '800',
  },
  track: {
    backgroundColor: '#24344b',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
    height: 10,
  },
});
