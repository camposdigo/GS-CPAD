import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export function Screen({ children }: PropsWithChildren) {
  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#020204',
  },
  content: {
    alignSelf: 'center',
    flexGrow: 1,
    gap: 18,
    maxWidth: 640,
    padding: 18,
    paddingBottom: 32,
    width: '100%',
  },
});
