package com.weathergpt.engine

import com.weathergpt.data.RiskBreakdownItem
import com.weathergpt.data.RiskLevel
import com.weathergpt.data.RiskResult
import com.weathergpt.data.WeatherData
import kotlin.math.roundToInt

/**
 * Ultra-fast deterministic Risk Assessment Engine compiled directly to JVM/ART bytecode.
 * Zero external network overhead or garbage collector churn.
 */
object RiskEngine {
    private const val WEIGHT_RAINFALL = 25
    private const val WEIGHT_PROBABILITY = 15
    private const val WEIGHT_WIND = 15
    private const val WEIGHT_WARNING = 25
    private const val WEIGHT_FLOOD = 10
    private const val WEIGHT_LANDSLIDE = 10

    private fun clamp(value: Float, min: Float = 0f, max: Float = 1f): Float =
        value.coerceIn(min, max)

    fun analyzeRisk(weather: WeatherData): RiskResult {
        val rf = clamp(weather.rainfallIntensity / 30f)
        val pf = clamp(weather.rainProbability / 100f)
        val wf = clamp(weather.windSpeed / 50f)
        val ow = if (weather.officialWarning) 1f else 0f
        val fi = clamp(weather.floodIndicator)
        val li = clamp(weather.landslideIndicator)

        val rawScore = (rf * WEIGHT_RAINFALL) +
                (pf * WEIGHT_PROBABILITY) +
                (wf * WEIGHT_WIND) +
                (ow * WEIGHT_WARNING) +
                (fi * WEIGHT_FLOOD) +
                (li * WEIGHT_LANDSLIDE)

        val score = clamp(rawScore, 0f, 100f).roundToInt()

        val level = when {
            score >= 75 -> RiskLevel.CRITICAL
            score >= 50 -> RiskLevel.HIGH
            score >= 25 -> RiskLevel.MODERATE
            else -> RiskLevel.LOW
        }

        val reasons = mutableListOf<String>().apply {
            if (weather.rainfallIntensity >= 20f) add("Heavy rainfall")
            else if (weather.rainfallIntensity >= 7f) add("Moderate rainfall")

            if (weather.rainProbability >= 80) add("High rain probability")
            else if (weather.rainProbability >= 50) add("Elevated rain probability")

            if (weather.windSpeed >= 40f) add("Strong wind")
            else if (weather.windSpeed >= 25f) add("Gusty wind")

            if (weather.officialWarning) add("Official warning signal")
            if (weather.floodIndicator >= 0.4f) add("Local flooding indicator")
            if (weather.landslideIndicator >= 0.4f) add("Landslide-prone conditions")
            if (weather.temperature >= 40f) add("Extreme heat")

            if (isEmpty()) add("No significant weather hazard detected")
        }

        val action = when (level) {
            RiskLevel.LOW -> "Conditions are calm. Normal travel is safe."
            RiskLevel.MODERATE -> "Carry rain gear, allow extra travel time and avoid waterlogged areas."
            RiskLevel.HIGH -> "Postpone non-essential travel and stay away from low-lying areas."
            RiskLevel.CRITICAL -> "EMERGENCY: Avoid unnecessary travel; shelter in place and heed sirens."
        }

        val breakdown = listOf(
            RiskBreakdownItem("rainfall", "Rainfall Intensity", (rf * WEIGHT_RAINFALL).roundToInt(), WEIGHT_RAINFALL),
            RiskBreakdownItem("probability", "Rain Probability", (pf * WEIGHT_PROBABILITY).roundToInt(), WEIGHT_PROBABILITY),
            RiskBreakdownItem("wind", "Wind Speed", (wf * WEIGHT_WIND).roundToInt(), WEIGHT_WIND),
            RiskBreakdownItem("warning", "Official Warning", (ow * WEIGHT_WARNING).roundToInt(), WEIGHT_WARNING),
            RiskBreakdownItem("flood", "Flood Indicator", (fi * WEIGHT_FLOOD).roundToInt(), WEIGHT_FLOOD),
            RiskBreakdownItem("landslide", "Landslide Indicator", (li * WEIGHT_LANDSLIDE).roundToInt(), WEIGHT_LANDSLIDE),
        )

        return RiskResult(score, level, reasons, action, breakdown)
    }
}
