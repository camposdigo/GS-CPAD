import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '@/components/mission/Card';
import { Screen } from '@/components/mission/Screen';
import { Body, Eyebrow, Title } from '@/components/mission/Typography';
import { useMission } from '@/context/MissionContext';
import { Thresholds } from '@/types/mission';

type FormState = {
  name: string;
  commander: string;
  orbit: string;
  maxTemperature: string;
  minBattery: string;
  minSignal: string;
  maxLatency: string;
  minStability: string;
};

export default function SettingsScreen() {
  const { profile, thresholds, updateProfile, updateThresholds } = useMission();
  const [form, setForm] = useState<FormState>(() => toForm(profile, thresholds));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(toForm(profile, thresholds));
  }, [profile, thresholds]);

  function change(field: keyof FormState, value: string) {
    setSaved(false);
    setError('');
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit() {
    const parsed = parseForm(form);
    if ('error' in parsed) {
      setError(parsed.error);
      setSaved(false);
      return;
    }

    updateProfile({
      name: form.name.trim(),
      commander: form.commander.trim(),
      orbit: form.orbit.trim(),
    });
    updateThresholds(parsed.thresholds);
    setSaved(true);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Eyebrow>Formulario com validacao</Eyebrow>
        <Title>Configuracoes da missao</Title>
        <Body>Os dados sao persistidos com AsyncStorage e consumidos nas demais telas.</Body>
      </View>

      <Card>
        <Field label="Nome da missao" value={form.name} onChangeText={(value) => change('name', value)} />
        <Field label="Comandante" value={form.commander} onChangeText={(value) => change('commander', value)} />
        <Field label="Orbita" value={form.orbit} onChangeText={(value) => change('orbit', value)} />
      </Card>

      <Card>
        <Field
          label="Temperatura maxima (C)"
          keyboardType="numeric"
          value={form.maxTemperature}
          onChangeText={(value) => change('maxTemperature', value)}
        />
        <Field
          label="Bateria minima (%)"
          keyboardType="numeric"
          value={form.minBattery}
          onChangeText={(value) => change('minBattery', value)}
        />
        <Field
          label="Sinal minimo (%)"
          keyboardType="numeric"
          value={form.minSignal}
          onChangeText={(value) => change('minSignal', value)}
        />
        <Field
          label="Latencia maxima (ms)"
          keyboardType="numeric"
          value={form.maxLatency}
          onChangeText={(value) => change('maxLatency', value)}
        />
        <Field
          label="Estabilidade minima (%)"
          keyboardType="numeric"
          value={form.minStability}
          onChangeText={(value) => change('minStability', value)}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {saved ? <Text style={styles.saved}>Configuracoes salvas no dispositivo.</Text> : null}

        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={submit}>
          <Text style={styles.buttonText}>Salvar limiares</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholderTextColor="#667b91"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

function toForm(profile: { name: string; commander: string; orbit: string }, thresholds: Thresholds): FormState {
  return {
    name: profile.name,
    commander: profile.commander,
    orbit: profile.orbit,
    maxTemperature: String(thresholds.maxTemperature),
    minBattery: String(thresholds.minBattery),
    minSignal: String(thresholds.minSignal),
    maxLatency: String(thresholds.maxLatency),
    minStability: String(thresholds.minStability),
  };
}

function parseForm(form: FormState): { thresholds: Thresholds } | { error: string } {
  if (!form.name.trim() || !form.commander.trim() || !form.orbit.trim()) {
    return { error: 'Preencha nome da missao, comandante e orbita.' };
  }

  const thresholds = {
    maxTemperature: Number(form.maxTemperature),
    minBattery: Number(form.minBattery),
    minSignal: Number(form.minSignal),
    maxLatency: Number(form.maxLatency),
    minStability: Number(form.minStability),
  };

  if (Object.values(thresholds).some((value) => Number.isNaN(value))) {
    return { error: 'Todos os limiares precisam ser numericos.' };
  }

  if (
    thresholds.maxTemperature < 40 ||
    thresholds.minBattery < 5 ||
    thresholds.minSignal < 5 ||
    thresholds.maxLatency < 100 ||
    thresholds.minStability < 10
  ) {
    return { error: 'Revise os limites: ha valores abaixo da faixa operacional.' };
  }

  return { thresholds };
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    paddingTop: 8,
  },
  field: {
    gap: 7,
    marginBottom: 14,
  },
  label: {
    color: '#c5d2df',
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#17263a',
    borderColor: '#2b4561',
    borderRadius: 8,
    borderWidth: 1,
    color: '#f7fbff',
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  error: {
    color: '#ff8fab',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
  },
  saved: {
    color: '#55d6be',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#73d4ff',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonPressed: {
    opacity: 0.78,
  },
  buttonText: {
    color: '#05101f',
    fontSize: 15,
    fontWeight: '900',
  },
});
