export type LanguageCode = "en" | "te" | "hi";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  native: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", native: "English" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
];

export const LEVEL_LABEL: Record<LanguageCode, Record<string, string>> = {
  en: { LOW: "Low Risk", MODERATE: "Moderate Risk", HIGH: "High Risk", CRITICAL: "Critical Risk" },
  te: { LOW: "తక్కువ ప్రమాదం", MODERATE: "మధ్యస్థ ప్రమాదం", HIGH: "అధిక ప్రమాదం", CRITICAL: "అత్యంత ప్రమాదకరం" },
  hi: { LOW: "कम जोखिम", MODERATE: "मध्यम जोखिम", HIGH: "उच्च जोखिम", CRITICAL: "गंभीर जोखिम" },
};

export const SIREN_ACTIONS: Record<LanguageCode, string[]> = {
  en: [
    "Move immediately to higher ground if in a low-lying or flood-prone area.",
    "Disconnect electrical appliances and avoid downed power lines.",
    "Keep emergency kit, water, and documents ready; follow local disaster authorities.",
  ],
  te: [
    "పల్లపు ప్రాంతాల నుండి వెంటనే సురక్షితమైన ఎత్తైన ప్రాంతాలకు వెళ్లండి.",
    "విద్యుత్ పరికరాలను నిలిపివేయండి మరియు తెగిన విద్యుత్ తీగలకు దూరంగా ఉండండి.",
    "అత్యవసర కిట్, తాగునీరు మరియు పత్రాలను సిద్ధంగా ఉంచుకోండి; అధికారుల సూచనలను పాటించండి.",
  ],
  hi: [
    "यदि आप निचले इलाके में हैं तो तुरंत ऊंचे स्थान पर जाएं।",
    "बिजली के उपकरणों को बंद करें और गिरे हुए बिजली के तारों से दूर रहें।",
    "आपातकालीन किट, पानी और दस्तावेज तैयार रखें; स्थानीय आपदा प्राधिकरण के निर्देशों का पालन करें।",
  ],
};

export const SIREN_MESSAGE: Record<LanguageCode, string> = {
  en: "CRITICAL ALERT: Severe weather conditions and flash flood risks detected in your area.",
  te: "అత్యవసర హెచ్చరిక: మీ ప్రాంతంలో తీవ్రమైన వాతావరణం మరియు ఆకస్మిక వరద ముప్పు గుర్తించబడింది.",
  hi: "गंभीर चेतावनी: आपके क्षेत्र में गंभीर मौसम और अचानक बाढ़ का खतरा detected किया गया है।",
};

export const SUGGESTIONS: Record<LanguageCode, string[]> = {
  en: [
    "Is it safe to travel to the airport today?",
    "What are the main flood hazards right now?",
    "Show me emergency shelter and helpline details.",
    "Summarize official warning updates.",
  ],
  te: [
    "ఈ రోజు ప్రయాణించడం సురక్షితమేనా?",
    "ప్రస్తుతం ప్రధాన వరద ముప్పులు ఏమిటి?",
    "అత్యవసర ఆశ్రయాలు మరియు హెల్ప్‌లైన్ వివరాలు చూపండి.",
    "అధికారిక హెచ్చరిక నవీకరణలను సంగ్రహించండి.",
  ],
  hi: [
    "क्या आज यात्रा करना सुरक्षित है?",
    "अभी मुख्य बाढ़ के खतरे क्या हैं?",
    "मुझे आपातकालीन आश्रय और हेल्पलाइन विवरण दिखाएं।",
    "आधिकारिक चेतावनी अपडेट का सारांश दें।",
  ],
};

const STRINGS: Record<LanguageCode, Record<string, string>> = {
  en: {
    home: "Home",
    chat: "WeatherGPT",
    climate: "Climate Lens",
    settings: "Settings",
    history: "Risk History",
    map: "Risk Map",
    notifications: "Alerts",
    askGpt: "Ask WeatherGPT",
    demoMode: "Demo Mode",
    currentRisk: "Current Risk Level",
    riskReasons: "Key Factors & Reasons",
    recommended: "Recommended Action",
    rainfall: "Rainfall",
    rainChance: "Rain %",
    wind: "Wind Speed",
    humidity: "Humidity",
    forecast: "Hourly Forecast",
    score: "Risk Score",
    suggested: "Suggested questions",
    placeholder: "Ask about weather, travel safety, or precautions...",
    listening: "Listening... Speak now",
    disclaimer: "Simulated advisory for disaster management demo. Always verify with IMD / local authorities.",
    grounded: "Grounded by Rules Engine",
    siren: "Smart Siren",
    sirenTitle: "CRITICAL DISASTER EMERGENCY ALERT",
    immediate: "Immediate Action Required",
    understand: "I Understand",
    guidance: "View Safety Guidance",
    thinking: "Analyzing weather & safety rules...",
    intro: "Multilingual conversational disaster safety assistant powered by deterministic rules.",
    climateTitle: "Decadal Climate Lens (2015–2024)",
    climateSubtitle: "Long-term rainfall accumulation & extreme weather frequency trends",
    historyTitle: "30-Day Simulated Risk History",
    historySubtitle: "Frequency and progression of weather risk levels over the past month",
    mapTitle: "Hyderabad Cluster Risk Map",
    mapSubtitle: "Real-time simulated multi-zone risk visualization",
    settingsTitle: "Engine & App Preferences",
    settingsSubtitle: "Configure simulation scenarios, language, and inspect deterministic weights",
  },
  te: {
    home: "హోమ్",
    chat: "వెదర్ GPT",
    climate: "వాతావరణ లెన్స్",
    settings: "సెట్టింగ్‌లు",
    history: "ప్రమాద చరిత్ర",
    map: "ప్రమాద మ్యాప్",
    notifications: "హెచ్చరికలు",
    askGpt: "వెదర్ GPTని అడగండి",
    demoMode: "డెమో మోడ్",
    currentRisk: "ప్రస్తుత ప్రమాద స్థాయి",
    riskReasons: "ప్రధాన కారణాలు",
    recommended: "సిఫార్సు చేయబడిన చర్య",
    rainfall: "వర్షపాతం",
    rainChance: "వర్షపు సంభావ్యత",
    wind: "గాలి వేగం",
    humidity: "తేమ",
    forecast: "గంటవారీ అంచనా",
    score: "ప్రమాద స్కోర్",
    suggested: "సూచించిన ప్రశ్నలు",
    placeholder: "వాతావరణం, ప్రయాణ భద్రత లేదా జాగ్రత్తల గురించి అడగండి...",
    listening: "వింటున్నాను... మాట్లాడండి",
    disclaimer: "విపత్తు నిర్వహణ డెమో కోసం అనుకరించబడిన సలహా. ఎల్లప్పుడూ అధికారులను సంప్రదించండి.",
    grounded: "నియమాల ఇంజిన్ ద్వారా గ్రౌండ్ చేయబడింది",
    siren: "స్మార్ట్ సైరన్",
    sirenTitle: "అత్యవసర విపత్తు హెచ్చరిక",
    immediate: "తక్షణ చర్య అవసరం",
    understand: "నాకు అర్థమైంది",
    guidance: "భద్రతా మార్గదర్శకాలను చూడండి",
    thinking: "వాతావరణ భద్రతా నియమాలను విశ్లేషిస్తోంది...",
    intro: "నిర్ణయాత్మక నియమాల ద్వారా నడిచే బహుభాషా విపత్తు భద్రతా సహాయకుడు.",
    climateTitle: "దశాబ్దపు వాతావరణ లెన్స్ (2015–2024)",
    climateSubtitle: "దీర్ఘకాలిక వర్షపాత ధోరణులు",
    historyTitle: "30 రోజుల ప్రమాద చరిత్ర",
    historySubtitle: "గత నెలలో ప్రమాద స్థాయిల పురోగతి",
    mapTitle: "హైదరాబాద్ క్లస్టర్ ప్రమాద మ్యాప్",
    mapSubtitle: "బహుళ-జోన్ ప్రమాద దృశ్యరూపం",
    settingsTitle: "సెట్టింగ్‌లు & నియమాల భారం",
    settingsSubtitle: "భాష, డెమో దృశ్యాలు మరియు ఇంజిన్ బరువులను తనిఖీ చేయండి",
  },
  hi: {
    home: "होम",
    chat: "वेदर जीपीटी",
    climate: "जलवायु लेंस",
    settings: "सेटिंग्स",
    history: "जोखिम इतिहास",
    map: "जोखिम मानचित्र",
    notifications: "चेतावनी",
    askGpt: "वेदर जीपीटी से पूछें",
    demoMode: "डेमो मोड",
    currentRisk: "वर्तमान जोखिम स्तर",
    riskReasons: "मुख्य कारण और कारक",
    recommended: "अनुशंसित कार्रवाई",
    rainfall: "वर्षा",
    rainChance: "वर्षा संभावना",
    wind: "हवा की गति",
    humidity: "नमी",
    forecast: "प्रति घंटा पूर्वानुमान",
    score: "जोखिम स्कोर",
    suggested: "सुझाए गए प्रश्न",
    placeholder: "मौसम, यात्रा सुरक्षा या सावधानियों के बारे में पूछें...",
    listening: "सुन रहे हैं... बोलें",
    disclaimer: "आपदा प्रबंधन डेमो के लिए सिमुलेटेड सलाह। हमेशा स्थानीय अधिकारियों से पुष्टि करें।",
    grounded: "डर्मिनिस्ति नियमों द्वारा संचालित",
    siren: "स्मार्ट सायरन",
    sirenTitle: "गंभीर आपदा आपातकालीन चेतावनी",
    immediate: "तत्काल कार्रवाई आवश्यक",
    understand: "मुझे समझ आ गया",
    guidance: "सुरक्षा दिशानिर्देश देखें",
    thinking: "मौसम और सुरक्षा नियमों का विश्लेषण कर रहा है...",
    intro: "deterministic नियमों द्वारा संचालित बहुभाषी आपदा सुरक्षा सहायक।",
    climateTitle: "दशक का जलवायु लेंस (2015–2024)",
    climateSubtitle: "दीर्घकालिक वर्षा संचय और अत्यधिक मौसम प्रवृत्तियां",
    historyTitle: "30-दिवसीय सिम्युलेटेड जोखिम इतिहास",
    historySubtitle: "पिछले महीने में मौसम जोखिम स्तरों की आवृत्ति",
    mapTitle: "हैदराबाद क्लस्टर जोखिम मानचित्र",
    mapSubtitle: "वास्तविक समय सिमुलेटेड बहु-क्षेत्र जोखिम दृश्य",
    settingsTitle: "इंजन और ऐप प्राथमिकताएं",
    settingsSubtitle: "सिमुलेशन परिदृश्य, भाषा और नियम वजन कॉन्फ़िगर करें",
  },
};

export function t(lang: LanguageCode, key: string): string {
  const dict = STRINGS[lang] || STRINGS.en;
  return dict[key] || STRINGS.en[key] || key;
}
