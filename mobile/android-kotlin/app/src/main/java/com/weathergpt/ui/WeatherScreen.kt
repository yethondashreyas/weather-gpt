package com.weathergpt.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.weathergpt.data.RiskLevel
import com.weathergpt.data.RiskResult
import com.weathergpt.data.WeatherData
import com.weathergpt.engine.RiskEngine

@Composable
fun WeatherScreen(modifier: Modifier = Modifier) {
    val sampleWeather = remember {
        WeatherData(
            city = "Hyderabad",
            state = "Telangana",
            temperature = 31.5f,
            feelsLike = 36.0f,
            condition = "Heavy Monsoon Rain",
            humidity = 88,
            rainfallIntensity = 28.0f,
            rainProbability = 92,
            windSpeed = 42.0f,
            officialWarning = true,
            floodIndicator = 0.8f,
            landslideIndicator = 0.1f
        )
    }

    val risk = remember(sampleWeather) { RiskEngine.analyzeRisk(sampleWeather) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Location & Temp
        Text(text = sampleWeather.city, fontSize = 26.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
        Text(text = sampleWeather.state.uppercase(), fontSize = 12.sp, color = Color(0xFF64748B), letterSpacing = 1.sp)
        Text(text = "${sampleWeather.temperature.toInt()}°C", fontSize = 56.sp, fontWeight = FontWeight.Light, color = Color(0xFF0F172A))
        Text(text = sampleWeather.condition, fontSize = 16.sp, fontWeight = FontWeight.Medium, color = Color(0xFF334155))

        Spacer(modifier = Modifier.height(24.dp))

        // Risk Card
        RiskScoreCard(risk = risk)
    }
}

@Composable
fun RiskScoreCard(risk: RiskResult) {
    val (bgColor, badgeColor, textColor) = when (risk.level) {
        RiskLevel.LOW -> Triple(Color(0xFFECFDF5), Color(0xFF10B981), Color(0xFF065F46))
        RiskLevel.MODERATE -> Triple(Color(0xFFFFFBEB), Color(0xFFF59E0B), Color(0xFF92400E))
        RiskLevel.HIGH -> Triple(Color(0xFFFFF7ED), Color(0xFFF97316), Color(0xFF9A3412))
        RiskLevel.CRITICAL -> Triple(Color(0xFFFEF2F2), Color(0xFFEF4444), Color(0xFF991B1B))
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.5.dp, badgeColor, RoundedCornerShape(20.dp)),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = bgColor)
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "DISASTER RISK INDEX",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = textColor,
                    letterSpacing = 1.sp
                )
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = badgeColor
                ) {
                    Text(
                        text = risk.level.name,
                        color = Color.White,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(verticalAlignment = Alignment.Bottom) {
                Text(
                    text = "${risk.score}",
                    fontSize = 46.sp,
                    fontWeight = FontWeight.Black,
                    color = textColor
                )
                Text(
                    text = "/100",
                    fontSize = 18.sp,
                    color = Color(0xFF64748B),
                    modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                )
            }

            Text(
                text = risk.recommendedAction,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF1E293B),
                modifier = Modifier.padding(vertical = 8.dp)
            )

            HorizontalDivider(color = badgeColor.copy(alpha = 0.2f), thickness = 1.dp)

            Spacer(modifier = Modifier.height(10.dp))

            // Breakdown Indicators
            risk.breakdown.forEach { item ->
                Column(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = item.label, fontSize = 12.sp, color = Color(0xFF475569))
                        Text(text = "${item.points}/${item.max}", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    LinearProgressIndicator(
                        progress = { item.points.toFloat() / item.max.toFloat() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp),
                        color = badgeColor,
                        trackColor = Color(0xFFE2E8F0)
                    )
                }
            }
        }
    }
}
