import { StyleSheet, Text, View } from 'react-native';

type MiniBarChartProps = {
  title: string;
  values: number[];
  max?: number;
  color?: string;
};

export function MiniBarChart({ title, values, max = 100, color = '#73d4ff' }: MiniBarChartProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chart}>
        {values.map((value, index) => (
          <View key={`${title}-${index}`} style={styles.barSlot}>
            <View style={[styles.bar, { height: `${Math.max(8, (value / max) * 100)}%`, backgroundColor: color }]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
  },
  title: {
    color: '#eef6ff',
    fontSize: 16,
    fontWeight: '800',
  },
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    height: 120,
  },
  barSlot: {
    backgroundColor: '#1b2a41',
    borderRadius: 6,
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    borderRadius: 6,
    minHeight: 8,
  },
});
