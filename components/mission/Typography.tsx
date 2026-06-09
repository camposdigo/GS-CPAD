import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

export function Eyebrow({ children }: PropsWithChildren) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Title({ children }: PropsWithChildren) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Body({ children, style }: PropsWithChildren<TextProps>) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  eyebrow: {
    color: '#ed145b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f6fbff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 36,
  },
  body: {
    color: '#c8cbd3',
    fontSize: 14,
    lineHeight: 21,
  },
});
