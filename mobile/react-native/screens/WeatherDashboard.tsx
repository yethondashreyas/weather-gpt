import React, { useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { WeatherData, RiskLevel } from '../types/weather';
import { analyzeRisk } from '../lib/riskEngine';

const INITIAL_WEATHER: WeatherData = {
  city: 'Hyderabad',
  state: 'Telangana',
  temperature: 31,
  feels_like: 36,
  condition: 'Thunderstorms & Heavy Rain',
  humidity: 88,
  rainfall_intensity: 28,
  rain_probability: 90,
  wind_speed: 44,
  official_warning: true,
  flood_indicator: 0.75,
  landslide_indicator: 0.1,
};

const COLOR_MAP: Record<RiskLevel, { bg: string; text: string; badge: string }> = {
  LOW: { bg: '#ecfdf5', text: '#065f46', badge: '#10b981' },
  MODERATE: { bg: '#fffbeb', text: '#92400e', badge: '#f59e0b' },
  HIGH: { bg: '#fff7ed', text: '#9a3412', badge: '#f97316' },
  CRITICAL: { bg: '#fef2f2', text: '#991b1b', badge: '#ef4444' },
};

export const WeatherDashboard: React.FC = () => {
  // Memoized so zero redundant computations occur during renders
  const risk = useMemo(() => analyzeRisk(INITIAL_WEATHER), []);
  const theme = COLOR_MAP[risk.level];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.cityName}>{INITIAL_WEATHER.city}</Text>
          <Text style={styles.stateName}>{INITIAL_WEATHER.state}</Text>
          <Text style={styles.temperature}>{INITIAL_WEATHER.temperature}°C</Text>
          <Text style={styles.condition}>{INITIAL_WEATHER.condition}</Text>
        </View>

        {/* Risk Card */}
        <View style={[styles.card, { backgroundColor: theme.bg, borderColor: theme.badge }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.riskTitle, { color: theme.text }]}>DISASTER RISK INDEX</Text>
            <View style={[styles.badge, { backgroundColor: theme.badge }]}>
              <Text style={styles.badgeText}>{risk.level}</Text>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <Text style={[styles.scoreNumber, { color: theme.text }]}>{risk.score}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>

          {/* Action guidance */}
          <Text style={styles.actionText}>{risk.recommended_action}</Text>

          {/* Breakdown bars */}
          <View style={styles.breakdownContainer}>
            {risk.breakdown.map((item) => {
              const pct = (item.points / item.max) * 100;
              return (
                <View key={item.key} style={styles.breakdownRow}>
                  <View style={styles.breakdownLabels}>
                    <Text style={styles.breakdownLabel}>{item.label}</Text>
                    <Text style={styles.breakdownPoints}>{item.points}/{item.max}</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${pct}%`, backgroundColor: theme.badge }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 20 },
  cityName: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  stateName: { fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 },
  temperature: { fontSize: 54, fontWeight: '300', color: '#0f172a', marginVertical: 4 },
  condition: { fontSize: 15, fontWeight: '600', color: '#334155' },
  card: { borderRadius: 20, borderWidth: 1.5, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  riskTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 8 },
  scoreNumber: { fontSize: 44, fontWeight: '900' },
  scoreMax: { fontSize: 16, color: '#64748b', marginLeft: 4 },
  actionText: { fontSize: 13, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  breakdownContainer: { marginTop: 8 },
  breakdownRow: { marginBottom: 8 },
  breakdownLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  breakdownLabel: { fontSize: 11, color: '#475569', fontWeight: '500' },
  breakdownPoints: { fontSize: 11, color: '#0f172a', fontWeight: '700' },
  progressBarBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
});
