import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { CommandButton, GlassPanel, MissionHeader } from '@/components/mission/ControlVisuals';
import { Screen } from '@/components/mission/Screen';
import { useMission } from '@/context/MissionContext';

export default function AGCScreen() {
  const { agcAlarm, agcProgram, crewLog, missionScore, sendAgcCommand, sendCrewMessage } = useMission();
  const [command, setCommand] = useState('');
  const [message, setMessage] = useState('');

  function submitCommand() {
    if (!command.trim()) return;
    sendAgcCommand(command);
    setCommand('');
  }

  function submitMessage() {
    if (!message.trim()) return;
    sendCrewMessage(message);
    setMessage('');
  }

  return (
    <Screen>
      <MissionHeader
        eyebrow="Apollo Guidance Computer"
        title="Console AGC"
        body="Camada mobile inspirada no DSKY: programas, comandos, alarmes simulados e comunicacao com a tripulacao."
      />

      <GlassPanel>
        <View style={styles.dskyHeader}>
          <Text style={styles.dskyLabel}>DSKY</Text>
          <Text style={styles.program}>{agcProgram}</Text>
        </View>
        <View style={styles.registerGrid}>
          <Register label="VERB" value="16" />
          <Register label="NOUN" value="65" />
          <Register label="SCORE" value={`${missionScore}%`} />
        </View>
        <Text style={[styles.alarm, agcAlarm && styles.alarmActive]}>
          {agcAlarm ? `${agcAlarm} | sobrecarga executiva` : 'NO ALARM'}
        </Text>
      </GlassPanel>

      <View style={styles.commandGrid}>
        <CommandButton label="P52 IMU" onPress={() => sendAgcCommand('P52')} />
        <CommandButton label="P63 Frenagem" onPress={() => sendAgcCommand('P63')} />
        <CommandButton label="P66 Manual" onPress={() => sendAgcCommand('P66')} />
        <CommandButton label="Simular 1202" onPress={() => sendAgcCommand('SIM1202')} />
      </View>

      <GlassPanel>
        <Text style={styles.panelTitle}>Enviar comando</Text>
        <View style={styles.form}>
          <TextInput
            onChangeText={setCommand}
            placeholder="V37P63, RESET, SIM1201..."
            placeholderTextColor="#737680"
            style={styles.input}
            value={command}
          />
          <CommandButton label="Enviar" onPress={submitCommand} />
        </View>
      </GlassPanel>

      <GlassPanel>
        <Text style={styles.panelTitle}>Canal da tripulacao</Text>
        <View style={styles.form}>
          <TextInput
            onChangeText={setMessage}
            placeholder="Perguntar status, energia, comunicacao..."
            placeholderTextColor="#737680"
            style={styles.input}
            value={message}
          />
          <CommandButton label="Transmitir" onPress={submitMessage} />
        </View>
        <View style={styles.log}>
          {crewLog.map((item, index) => (
            <Text key={`${item}-${index}`} style={styles.logItem}>{item}</Text>
          ))}
        </View>
      </GlassPanel>
    </Screen>
  );
}

function Register({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.register}>
      <Text style={styles.registerLabel}>{label}</Text>
      <Text style={styles.registerValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dskyHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  dskyLabel: {
    color: '#a2a5ad',
    fontSize: 13,
    fontWeight: '900',
  },
  program: {
    color: '#9cff7a',
    flexShrink: 1,
    fontSize: 38,
    fontWeight: '900',
  },
  registerGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  register: {
    backgroundColor: '#030604',
    borderColor: 'rgba(116,242,139,0.28)',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 88,
    padding: 12,
  },
  registerLabel: {
    color: '#a2a5ad',
    fontSize: 11,
    fontWeight: '900',
  },
  registerValue: {
    color: '#9cff7a',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 12,
  },
  alarm: {
    borderColor: 'rgba(116,242,139,0.45)',
    borderRadius: 8,
    borderWidth: 1,
    color: '#74f28b',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 16,
    padding: 12,
    textTransform: 'uppercase',
  },
  alarmActive: {
    borderColor: '#ff4f5e',
    color: '#ff4f5e',
  },
  commandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  panelTitle: {
    color: '#f7f7f2',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  form: {
    gap: 10,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    borderWidth: 1,
    color: '#f7f7f2',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  log: {
    gap: 8,
    marginTop: 14,
  },
  logItem: {
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    color: '#cfd2dc',
    fontSize: 13,
    lineHeight: 19,
    padding: 12,
  },
});
