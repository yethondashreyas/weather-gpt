import { RiskResult, RiskLevel } from "./riskEngine";
import { WeatherData } from "./weatherData";
import { LanguageCode } from "./i18n";

const REASON_MAP: Record<string, Record<LanguageCode, string>> = {
  "Heavy rainfall": {
    en: "Heavy rainfall",
    te: "భారీ వర్షపాతం",
    hi: "भारी वर्षा",
  },
  "Moderate rainfall": {
    en: "Moderate rainfall",
    te: "మోస్తరు వర్షపాతం",
    hi: "मध्यम वर्षा",
  },
  "High rain probability": {
    en: "High rain probability",
    te: "అధిక వర్షపు సంభావ్యత",
    hi: "उच्च वर्षा संभावना",
  },
  "Elevated rain probability": {
    en: "Elevated rain probability",
    te: "పెరిగిన వర్షపు సంభావ్యత",
    hi: "बढ़ी हुई वर्षा संभावना",
  },
  "Strong wind": {
    en: "Strong wind",
    te: "ఈదురు గాలులు",
    hi: "तेज हवाएं",
  },
  "Gusty wind": {
    en: "Gusty wind",
    te: "వేగవంతమైన గాలి",
    hi: "झोंकेदार हवा",
  },
  "Official warning signal": {
    en: "Official warning signal",
    te: "అధికారిక హెచ్చరిక సంకేతం",
    hi: "आधिकारिक चेतावनी संकेत",
  },
  "Local flooding indicator": {
    en: "Local flooding indicator",
    te: "స్థానిక వరద సూచిక",
    hi: "स्थानीय बाढ़ संकेतक",
  },
  "Landslide-prone conditions": {
    en: "Landslide-prone conditions",
    te: "కొండచరియలు విరిగిపడే ప్రమాదం",
    hi: "भूस्खलन की संभावना",
  },
  "Extreme heat": {
    en: "Extreme heat",
    te: "అధిక ఉష్ణోగ్రత / ఎండ",
    hi: "अत्यधिक गर्मी",
  },
  "No significant weather hazard detected": {
    en: "No significant weather hazard detected",
    te: "ప్రమాదకర వాతావరణ హెచ్చరికలు లేవు",
    hi: "कोई महत्वपूर्ण मौसम खतरा नहीं पाया गया",
  },
};

export function localizeReason(reason: string, lang: LanguageCode): string {
  if (REASON_MAP[reason] && REASON_MAP[reason][lang]) {
    return REASON_MAP[reason][lang];
  }
  return reason;
}

export function localizedAction(level: RiskLevel, lang: LanguageCode): string {
  if (lang === "te") {
    switch (level) {
      case "LOW":
        return "వాతావరణం ప్రశాంతంగా ఉంది. సాధారణ ప్రయాణాలు పర్వాలేదు — దీర్ఘ ప్రయాణాలకు ముందు నవీకరణలను గమనించండి.";
      case "MODERATE":
        return "వర్షపు రక్షణను తీసుకోండి, అదనపు ప్రయాణ సమయాన్ని కేటాయించండి మరియు నీరు నిల్వ ఉండే ప్రాంతాలకు దూరంగా ఉండండి.";
      case "HIGH":
        return "అత్యవసర కాని ప్రయాణాలను వాయిదా వేయండి, పల్లపు ప్రాంతాలకు దూరంగా ఉండండి మరియు అధికారుల హెచ్చరికలను గమనించండి.";
      case "CRITICAL":
        return "అనవసరమైన ప్రయాణాలు మరియు పల్లపు ప్రాంతాలకు దూరంగా ఉండండి; అధికారిక హెచ్చరికలను ఖచ్చితంగా పాటించండి.";
    }
  } else if (lang === "hi") {
    switch (level) {
      case "LOW":
        return "मौसम शांत है। सामान्य यात्रा ठीक है — लंबी यात्राओं से पहले अपडेट देखें।";
      case "MODERATE":
        return "बरसात से बचाव साथ रखें, अतिरिक्त यात्रा समय दें और जलभराव वाले रास्तों से बचें।";
      case "HIGH":
        return "गैर-जरूरी यात्रा स्थगित करें, निचले इलाकों से दूर रहें और आधिकारिक चेतावनियों पर नज़र रखें।";
      case "CRITICAL":
        return "अनावश्यक यात्रा और निचले इलाकों से बचें; आधिकारिक चेतावनियों का कड़ाई से पालन करें।";
    }
  }
  
  // English default
  switch (level) {
    case "LOW":
      return "Conditions are calm. Normal travel is fine — keep an eye on updates before long trips.";
    case "MODERATE":
      return "Carry rain protection, allow extra travel time and avoid waterlogged stretches.";
    case "HIGH":
      return "Postpone non-essential travel, stay away from low-lying areas and monitor official warnings.";
    case "CRITICAL":
      return "Avoid unnecessary travel and low-lying areas; follow official warnings.";
  }
}

export function templateReply({
  message,
  lang,
  weather,
  risk,
}: {
  message: string;
  lang: LanguageCode;
  weather: WeatherData;
  risk: RiskResult;
}): string {
  const loc = weather.locationName;
  const levelText = risk.level;
  const score = risk.score;
  const reasonsList = risk.reasons.map((r) => localizeReason(r, lang)).join(", ");
  const action = localizedAction(risk.level, lang);

  if (lang === "te") {
    return `ప్రస్తుతం ${loc} లో వాతావరణ పరిస్థితి: ${weather.condition}, ఉష్ణోగ్రత ${weather.temperature}°C (అనుభూతి ${weather.feels_like}°C). వర్షపాతం ${weather.rainfall_intensity} mm/h, గాలి వేగం ${weather.wind_speed} km/h.\n\nడిటర్మినిస్టిక్ నియమాల ఇంజిన్ ప్రకారం ప్రస్తుత ప్రమాద స్థాయి: ${levelText} (స్కోర్: ${score}/100). గుర్తించబడిన ప్రధాన కారణాలు: ${reasonsList}.\n\nసిఫార్సు చేయబడిన చర్య: ${action}`;
  } else if (lang === "hi") {
    return `वर्तमान में ${loc} में मौसम की स्थिति: ${weather.condition}, तापमान ${weather.temperature}°C (महसूस होता है ${weather.feels_like}°C)। वर्षा तीव्रता ${weather.rainfall_intensity} mm/h, हवा की गति ${weather.wind_speed} km/h।\n\nनियम इंजन के अनुसार वर्तमान जोखिम स्तर: ${levelText} (स्कोर: ${score}/100)। मुख्य कारण: ${reasonsList}।\n\nअनुशंसित कार्रवाई: ${action}`;
  }

  return `Current conditions in ${loc}: ${weather.condition}, ${weather.temperature}°C (feels like ${weather.feels_like}°C), rainfall intensity ${weather.rainfall_intensity} mm/h, wind speed ${weather.wind_speed} km/h.\n\nDeterministic risk engine assessment: ${levelText} risk (Score: ${score}/100). Primary factors: ${reasonsList}.\n\nRecommended safety guidance: ${action}`;
}
