package com.weathergpt.data

enum class RiskLevel {
    LOW, MODERATE, HIGH, CRITICAL
}

data class WeatherData(
    val city: String,
    val state: String,
    val temperature: Float,
    val feelsLike: Float,
    val condition: String,
    val humidity: Int,
    val rainfallIntensity: Float, // mm/h
    val rainProbability: Int,     // %
    val windSpeed: Float,         // km/h
    val officialWarning: Boolean,
    val floodIndicator: Float,     // 0..1
    val landslideIndicator: Float  // 0..1
)

data class RiskBreakdownItem(
    val key: String,
    val label: String,
    val points: Int,
    val max: Int
)

data class RiskResult(
    val score: Int,
    val level: RiskLevel,
    val reasons: List<String>,
    val recommendedAction: String,
    val breakdown: List<RiskBreakdownItem>
)
