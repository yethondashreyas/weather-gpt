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
  hi: "गंभीर चेतावनी: आपके क्षेत्र में गंभीर मौसम और अचानक बाढ़ का खतरा पाया गया है।",
};

export const SUGGESTIONS: Record<LanguageCode, string[]> = {
  en: [
    "Is it safe to travel to the airport today?",
    "Where is the nearest safe shelter?",
    "What precautions if water enters the home?",
    "Summarize current rain & wind warnings.",
  ],
  te: [
    "ఈ రోజు ప్రయాణించడం సురక్షితమేనా?",
    "సమీపంలోని సురక్షిత ఆశ్రయం ఎక్కడ ఉంది?",
    "ఇంట్లోకి నీరు చేరితే తీసుకోవాల్సిన జాగ్రత్తలు?",
    "ప్రస్తుత వర్షం & గాలి హెచ్చరికలను వివరించండి.",
  ],
  hi: [
    "क्या आज यात्रा करना सुरक्षित है?",
    "निकटतम सुरक्षित आश्रय कहाँ है?",
    "घर में पानी भरने पर क्या सावधानियां बरतें?",
    "वर्तमान वर्षा और हवा की चेतावनियों का सारांश दें।",
  ],
};

const CITY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "Hyderabad": { en: "Hyderabad", te: "హైదరాబాదు", hi: "हैदराबाद" },
  "Visakhapatnam": { en: "Visakhapatnam", te: "విశాఖపట్నం", hi: "विशाखापत्तनम" },
  "Chennai": { en: "Chennai", te: "చెన్నై", hi: "चेन्नई" },
  "Mumbai": { en: "Mumbai", te: "ముంబై", hi: "मुंबई" },
  "Delhi": { en: "Delhi", te: "ఢిల్లీ", hi: "दिल्ली" },
};

const CONDITION_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "Thunderstorms with Heavy Rain": {
    en: "Thunderstorms with Heavy Rain",
    te: "భారీ వర్షంతో కూడిన ఉరుములు",
    hi: "भारी वर्षा और गरज के साथ तूफान",
  },
  "Heavy Rain": {
    en: "Heavy Rain",
    te: "భారీ వర్షం",
    hi: "भारी वर्षा",
  },
  "Moderate Rain": {
    en: "Moderate Rain",
    te: "మోస్తరు వర్షం",
    hi: "मध्यम वर्षा",
  },
  "Scattered Showers": {
    en: "Scattered Showers",
    te: "చెదురుమదురు జల్లులు",
    hi: "छिटपुट बौछारें",
  },
  "Partly Cloudy": {
    en: "Partly Cloudy",
    te: "పాక్షికంగా మేఘావృతం",
    hi: "आंशिक रूप से बादल",
  },
  "Mostly Sunny": {
    en: "Mostly Sunny",
    te: "ఎక్కువగా ఎండ",
    hi: "मुख्यतः धूप",
  },
  "Clear Sky": {
    en: "Clear Sky",
    te: "నిర్మలమైన ఆకాశం",
    hi: "साफ आसमान",
  },
  "Overcast": {
    en: "Overcast",
    te: "పూర్తిగా మేఘావృతం",
    hi: "घने बादल",
  },
  "Heatwave": {
    en: "Heatwave",
    te: "తీవ్రమైన వడగాల్పులు",
    hi: "भीषण गर्मी / लू",
  },
  "Sunny": {
    en: "Sunny",
    te: "ఎండగా ఉంది",
    hi: "धूप",
  },
};

const DAY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "Today": { en: "Today", te: "ఈ రోజు", hi: "आज" },
  "Mon": { en: "Mon", te: "సోమ", hi: "सोम" },
  "Tue": { en: "Tue", te: "మంగళ", hi: "मंगल" },
  "Wed": { en: "Wed", te: "బుధ", hi: "बुध" },
  "Thu": { en: "Thu", te: "గురు", hi: "गुरु" },
  "Fri": { en: "Fri", te: "శుక్ర", hi: "शुक्र" },
  "Sat": { en: "Sat", te: "శని", hi: "शनि" },
  "Sun": { en: "Sun", te: "ఆది", hi: "रवि" },
};

const STRINGS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    home: "Home",
    map: "Risk Map",
    chat: "Chat AI",
    alerts: "Alerts",
    more: "More",

    // Secondary Drawer
    climateLens: "Climate Lens",
    climateDesc: "Monsoon & cyclone projections",
    riskTimeline: "Risk Timeline",
    riskTimelineDesc: "Past 7-day storm logs",
    nativeCode: "Native Mobile Code",
    nativeCodeDesc: "React Native & Kotlin Compose",
    settingsNav: "Settings",
    settingsNavDesc: "Location, sirens & engine weights",
    testSiren: "Test Emergency Siren",
    testSirenDesc: "Trigger high-urgency disaster alarm modal",
    displayMode: "Display & Contrast Mode",
    displayModeDesc: "Switch between Light, Dark, and high-visibility Disaster mode.",

    // Header & Subtitles
    appSubtitle: "Multilingual disaster safety & radar assistant",
    cityLabel: "City:",
    sosDial: "SOS Dial",
    shelters: "Shelters",
    bulletin: "Bulletin",
    weights: "Weights",
    trendsTitle: "24-Hour Trends & Doppler Probability",

    // Weather Hero & Telemetry
    feelsLike: "Feels like",
    justNow: "Just now",
    radarBadge: "IMD Radar",
    rainfall: "Rainfall",
    wind: "Wind Speed",
    humidity: "Humidity",
    uvIndex: "UV Index",
    cloudCover: "Cloud Cover",
    visibility: "Visibility",
    showTelemetry: "Show Full Doppler Telemetry",
    hideTelemetry: "Hide Telemetry",

    // Forecast Strip
    hourlyForecast: "24-Hour Forecast",
    weeklyForecast: "7-Day Regional Outlook",
    tab24Hours: "24 Hours",
    tab7Days: "7 Days",
    today: "Today",
    rainChance: "Rain %",
    rain: "rain",

    // Risk Card
    currentRisk: "Current Risk Level",
    score: "Risk Score",
    riskReasons: "Key Factors & Reasons",
    recommended: "Recommended Action",
    listen: "Listen",
    mute: "Mute",
    officialBulletin: "Official Bulletin",
    shareAdvisory: "Share Advisory",
    showBreakdown: "Show Point-by-Point Calculation",
    hideBreakdown: "Hide Calculation Breakdown",
    breakdownTitle: "Breakdown by Factor",
    max: "max",

    // Risk Map Page
    riskMapTitle: "Risk Map",
    zonesCount: "12 Zones",
    mapSubtitle: "Live Spatial GIS & Inundation Radar",
    searchZone: "Search zone (e.g., Charminar, Begumpet)...",
    allZones: "All Zones",
    criticalRisk: "Critical Risk",
    reliefShelters: "Relief Shelters",
    radarFront: "Radar Front",
    sweeping: "Sweeping...",
    detectedHazards: "Detected Zone Hazards",
    recommendedAction: "Recommended Safety Action",
    shareLocation: "Share Location",
    emergencyHelp: "Emergency Help",
    safeRoute: "Get Safe High-Ground Route",
    dialHelplines: "Dial Helplines",
    selectedZone: "Selected Zone Overview",

    // Chat AI Page
    chatAi: "WeatherGPT AI",
    groundedEngine: "Grounded by Deterministic Engine",
    liveVoice: "Live Voice",
    exportTranscript: "Export",
    clearChat: "Clear Chat",
    suggestedInquiries: "Suggested Inquiries:",
    chatPlaceholder: "Ask about rainfall, road flooding, evacuation precautions...",
    send: "Send",
    thinking: "Analyzing weather & safety rules...",

    // Settings Page
    settingsTitle: "Settings & Weights",
    settingsSubtitle: "Configure simulation & inspect deterministic engine",
    monitoringCity: "Active Location Monitoring",
    demoMode: "Demo Mode (Simulated Data)",
    demoModeDesc: "Toggle offline scenarios & crisis presets",
    autoSpeak: "Auto-Speak Critical Risk",
    autoSpeakDesc: "Read risk engine conclusion aloud automatically on CRITICAL alert",
    emergencySirenSound: "Emergency Siren Sound",
    emergencySirenDesc: "Play looping Web Audio alarm siren when risk level is CRITICAL",
    scenarioPresets: "Crisis Scenario Presets",
    interactiveWeights: "Interactive Engine Weights",
    standardImd: "Standard IMD",
    cyclonePriority: "Cyclone Priority",
    floodPriority: "Flash Flood Priority",
    resetWeights: "Reset Weights",
    exportJson: "Export Config JSON",
    levelThresholds: "Level Thresholds:",
    testSos: "Test Emergency SOS",
    incidentBulletin: "Incident Bulletin",

    // Notifications Page
    notificationsTitle: "Alerts & Incidents Log",
    notificationsSubtitle: "Real-time record of simulated and active weather events",
    clearAll: "Clear All",
    noAlerts: "No Active Disaster Alerts",
    noAlertsDesc: "All monitored zones are currently within safe thresholds.",

    // General & Modal
    close: "Close",
    emergencySosTitle: "Emergency SOS Speed Dial",
    emergencySosDesc: "Instant one-tap calling to state disaster response authorities.",
    locationSharedNotice: "Your coordinates & current disaster zone are ready to share with rescue teams.",
  },
  te: {
    // Navigation
    home: "హోమ్",
    map: "ప్రమాద మ్యాప్",
    chat: "చాట్ AI",
    alerts: "హెచ్చరికలు",
    more: "మరిన్ని",

    // Secondary Drawer
    climateLens: "వాతావరణ లెన్స్",
    climateDesc: "వర్షాకాలం & తుఫాను దీర్ఘకాలిక అంచనాలు",
    riskTimeline: "ప్రమాద కాలక్రమం",
    riskTimelineDesc: "గత 7 రోజుల తుఫాను లాగ్‌లు",
    nativeCode: "స్థానిక మొబైల్ కోడ్",
    nativeCodeDesc: "రియాక్ట్ నేటివ్ & కోట్లిన్ కంపోజ్",
    settingsNav: "సెట్టింగ్‌లు",
    settingsNavDesc: "ప్రాంతం, సైరన్ & ఇంజిన్ బరువులు",
    testSiren: "అత్యవసర సైరన్ పరీక్ష",
    testSirenDesc: "అత్యవసర విపత్తు అలారం మోడల్‌ను పరీక్షించండి",
    displayMode: "డిస్ప్లే & కాంట్రాస్ట్ మోడ్",
    displayModeDesc: "లైట్, డార్క్ మరియు హై-విజిబిలిటీ డిజాస్టర్ మోడ్ మధ్య మారండి.",

    // Header & Subtitles
    appSubtitle: "బహుభాషా విపత్తు భద్రత & రాడార్ సహాయకుడు",
    cityLabel: "నగరం:",
    sosDial: "SOS డయల్",
    shelters: "ఆశ్రయాలు",
    bulletin: "బులిటెన్",
    weights: "ఇంజిన్ బరువులు",
    trendsTitle: "24 గంటల పోకడలు & డాప్లర్ సంభావ్యత",

    // Weather Hero & Telemetry
    feelsLike: "అనుభూతి",
    justNow: "ఇప్పుడే",
    radarBadge: "IMD రాడార్",
    rainfall: "వర్షపాతం",
    wind: "గాలి వేగం",
    humidity: "తేమ",
    uvIndex: "UV సూచిక",
    cloudCover: "మేఘావృతం",
    visibility: "దృశ్యమానత",
    showTelemetry: "పూర్తి డాప్లర్ టెలిమెట్రీని చూపించు",
    hideTelemetry: "టెలిమెట్రీని దాచు",

    // Forecast Strip
    hourlyForecast: "24 గంటల అంచనా",
    weeklyForecast: "7 రోజుల ప్రాంతీయ అంచనా",
    tab24Hours: "24 గంటలు",
    tab7Days: "7 రోజులు",
    today: "ఈ రోజు",
    rainChance: "వర్షపు సంభావ్యత",
    rain: "వర్షం",

    // Risk Card
    currentRisk: "ప్రస్తుత ప్రమాద స్థాయి",
    score: "ప్రమాద స్కోర్",
    riskReasons: "ప్రధాన కారణాలు & కారకాలు",
    recommended: "సిఫార్సు చేయబడిన చర్య",
    listen: "వినండి",
    mute: "మ్యూట్",
    officialBulletin: "అధికారిక బులిటెన్",
    shareAdvisory: "సలహాను పంచుకోండి",
    showBreakdown: "పాయింట్ వారీ లెక్కింపు చూపించు",
    hideBreakdown: "లెక్కింపు విభజన దాచు",
    breakdownTitle: "కారకాల వారీగా విభజన",
    max: "గరిష్టం",

    // Risk Map Page
    riskMapTitle: "ప్రమాద మ్యాప్",
    zonesCount: "12 జోన్లు",
    mapSubtitle: "ప్రత్యక్ష ప్రాదేశిక GIS & ముంపు రాడార్",
    searchZone: "జోన్ శోధించండి (ఉదా. చార్మినార్, బేగంపేట)...",
    allZones: "అన్ని జోన్లు",
    criticalRisk: "అత్యంత ప్రమాదకరం",
    reliefShelters: "పునరావాస కేంద్రాలు",
    radarFront: "రాడార్ ఫ్రంట్",
    sweeping: "స్కాన్ చేస్తోంది...",
    detectedHazards: "గుర్తించిన ప్రమాదాలు",
    recommendedAction: "సిఫార్సు చేయబడిన భద్రతా చర్య",
    shareLocation: "స్థానాన్ని పంచుకోండి",
    emergencyHelp: "అత్యవసర సహాయం",
    safeRoute: "సురక్షిత ఎత్తైన మార్గాన్ని పొందండి",
    dialHelplines: "హెల్ప్‌లైన్‌లకు కాల్ చేయండి",
    selectedZone: "ఎంచుకున్న జోన్ వివరాలు",

    // Chat AI Page
    chatAi: "వెదర్ GPT AI",
    groundedEngine: "నిర్ణయాత్మక ఇంజిన్ ఆధారితం",
    liveVoice: "లైవ్ వాయిస్",
    exportTranscript: "ఎగుమతి",
    clearChat: "చాట్ క్లియర్ చేయండి",
    suggestedInquiries: "సూచించిన ప్రశ్నలు:",
    chatPlaceholder: "వర్షం, రోడ్డు ముంపు, జాగ్రత్తల గురించి అడగండి...",
    send: "పంపు",
    thinking: "వాతావరణ & భద్రతా నియమాలను విశ్లేషిస్తోంది...",

    // Settings Page
    settingsTitle: "సెట్టింగ్‌లు & బరువులు",
    settingsSubtitle: "సిమ్యులేషన్‌ను కాన్ఫిగర్ చేయండి & ఇంజిన్‌ను తనిఖీ చేయండి",
    monitoringCity: "యాక్టివ్ లొకేషన్ పర్యవేక్షణ",
    demoMode: "డెమో మోడ్ (సిమ్యులేటెడ్ డేటా)",
    demoModeDesc: "ఆఫ్‌లైన్ పరిస్థితులు & సంక్షోభ ప్రీసెట్‌లు",
    autoSpeak: "తీవ్రమైన ప్రమాదాన్ని ఆటో-స్పీక్ చేయండి",
    autoSpeakDesc: "అత్యవసర హెచ్చరిక వచ్చినప్పుడు బిగ్గరగా చదవండి",
    emergencySirenSound: "అత్యవసర సైరన్ శబ్దం",
    emergencySirenDesc: "ప్రమాదం అత్యంత తీవ్రంగా ఉన్నప్పుడు వెబ్ ఆడియో అలారం మోగించండి",
    scenarioPresets: "సంక్షోభ దృశ్యాల ప్రీసెట్‌లు",
    interactiveWeights: "ఇంటరాక్టివ్ ఇంజిన్ బరువులు",
    standardImd: "ప్రామాణిక IMD",
    cyclonePriority: "తుఫాను ప్రాధాన్యత",
    floodPriority: "ఆకస్మిక వరద ప్రాధాన్యత",
    resetWeights: "బరువులను రీసెట్ చేయండి",
    exportJson: "కాన్ఫిగరేషన్ ఎగుమతి",
    levelThresholds: "స్థాయి పరిమితులు:",
    testSos: "అత్యవసర SOS పరీక్ష",
    incidentBulletin: "సంఘటన బులిటెన్",

    // Notifications Page
    notificationsTitle: "హెచ్చరికలు & సంఘటనల లాగ్",
    notificationsSubtitle: "వాతావరణ సంఘటనల ప్రత్యక్ష రికార్డు",
    clearAll: "అన్నీ క్లియర్ చేయండి",
    noAlerts: "క్రియాశీల హెచ్చరికలు లేవు",
    noAlertsDesc: "పర్యవేక్షించబడుతున్న అన్ని ప్రాంతాలు ప్రస్తుతం సురక్షిత పరిమితుల్లో ఉన్నాయి.",

    // General & Modal
    close: "మూసివేయి",
    emergencySosTitle: "అత్యవసర SOS స్పీడ్ డయల్",
    emergencySosDesc: "రాష్ట్ర విపత్తు నిర్వహణ అధికారులకు ఒకే ట్యాప్‌తో కాల్ చేయండి.",
    locationSharedNotice: "మీ ప్రాంత వివరాలు రెస్క్యూ టీమ్‌లకు పంపడానికి సిద్ధంగా ఉన్నాయి.",
  },
  hi: {
    // Navigation
    home: "होम",
    map: "जोखिम मानचित्र",
    chat: "चैट AI",
    alerts: "अलर्ट्स",
    more: "अधिक",

    // Secondary Drawer
    climateLens: "जलवायु लेंस",
    climateDesc: "मानसून और चक्रवात अनुमान",
    riskTimeline: "जोखिम टाइमलाइन",
    riskTimelineDesc: "पिछले 7 दिनों के तूफान रिकॉर्ड",
    nativeCode: "नेटिव मोबाइल कोड",
    nativeCodeDesc: "रिएक्ट नेटिव और कोटलिन कंपोज़",
    settingsNav: "सेटिंग्स",
    settingsNavDesc: "स्थान, सायरन और नियम वजन",
    testSiren: "आपातकालीन सायरन परीक्षण",
    testSirenDesc: "उच्च प्राथमिकता आपदा अलार्म का परीक्षण करें",
    displayMode: "डिस्प्ले और कंट्रास्ट मोड",
    displayModeDesc: "लाइट, डार्क और हाई-विजिबिलिटी डिजास्टर मोड में बदलें।",

    // Header & Subtitles
    appSubtitle: "बहुभाषी आपदा सुरक्षा और रडार सहायक",
    cityLabel: "शहर:",
    sosDial: "SOS डायल",
    shelters: "आश्रय",
    bulletin: "बुलेटिन",
    weights: "नियम वेट्स",
    trendsTitle: "24-घंटे के रुझान और डॉपलर संभावना",

    // Weather Hero & Telemetry
    feelsLike: "महसूस होता है",
    justNow: "अभी-अभी",
    radarBadge: "आईएमडी रडार",
    rainfall: "वर्षा",
    wind: "हवा की गति",
    humidity: "नमी",
    uvIndex: "यूवी इंडेक्स",
    cloudCover: "बादल छाए रहना",
    visibility: "दृश्यता",
    showTelemetry: "पूर्ण डॉपलर टेलीमेट्री देखें",
    hideTelemetry: "टेलीमेट्री छुपाएं",

    // Forecast Strip
    hourlyForecast: "24-घंटे का पूर्वानुमान",
    weeklyForecast: "7-दिवसीय क्षेत्रीय दृष्टिकोण",
    tab24Hours: "24 घंटे",
    tab7Days: "7 दिन",
    today: "आज",
    rainChance: "वर्षा संभावना",
    rain: "बारिश",

    // Risk Card
    currentRisk: "वर्तमान जोखिम स्तर",
    score: "जोखिम स्कोर",
    riskReasons: "मुख्य कारण और कारक",
    recommended: "अनुशंसित कार्रवाई",
    listen: "सुनें",
    mute: "म्यूट",
    officialBulletin: "आधिकारिक बुलेटिन",
    shareAdvisory: "सलाह साझा करें",
    showBreakdown: "अंकवार गणना दिखाएं",
    hideBreakdown: "गणना विवरण छुपाएं",
    breakdownTitle: "कारकों के आधार पर विवरण",
    max: "अधिकतम",

    // Risk Map Page
    riskMapTitle: "जोखिम मानचित्र",
    zonesCount: "12 क्षेत्र",
    mapSubtitle: "लाइव स्थानिक जीआईएस और जलभराव रडार",
    searchZone: "क्षेत्र खोजें (उदा. चारमीनार, बेगमपेट)...",
    allZones: "सभी क्षेत्र",
    criticalRisk: "गंभीर जोखिम",
    reliefShelters: "राहत आश्रय",
    radarFront: "रडार फ्रंट",
    sweeping: "स्कैनिंग...",
    detectedHazards: "पहचाने गए खतरे",
    recommendedAction: "अनुशंसित सुरक्षा कार्रवाई",
    shareLocation: "स्थान साझा करें",
    emergencyHelp: "आपातकालीन सहायता",
    safeRoute: "सुरक्षित ऊंचे रास्ते प्राप्त करें",
    dialHelplines: "हेल्पलाइन डायल करें",
    selectedZone: "चयनित क्षेत्र विवरण",

    // Chat AI Page
    chatAi: "वेदर जीपीटी एआई",
    groundedEngine: "डिटर्मिनिस्टिक इंजन द्वारा संचालित",
    liveVoice: "लाइव वॉयस",
    exportTranscript: "निर्यात",
    clearChat: "चैट साफ़ करें",
    suggestedInquiries: "सुझाए गए प्रश्न:",
    chatPlaceholder: "वर्षा, सड़क जलभराव, बचाव के उपायों के बारे में पूछें...",
    send: "भेजें",
    thinking: "मौसम और सुरक्षा नियमों का विश्लेषण कर रहा है...",

    // Settings Page
    settingsTitle: "सेटिंग्स और नियम वजन",
    settingsSubtitle: "सिमुलेशन कॉन्फ़िगर करें और इंजन का निरीक्षण करें",
    monitoringCity: "सक्रिय स्थान निगरानी",
    demoMode: "डेमो मोड (सिम्युलेटेड डेटा)",
    demoModeDesc: "ऑफ़लाइन परिदृश्य और संकट प्रीसेट टॉगल करें",
    autoSpeak: "गंभीर जोखिम स्वतः बोलें",
    autoSpeakDesc: "गंभीर अलर्ट पर निष्कर्ष स्वचालित रूप से जोर से पढ़ें",
    emergencySirenSound: "आपातकालीन सायरन ध्वनि",
    emergencySirenDesc: "जोखिम स्तर गंभीर होने पर अलार्म सायरन बजाएं",
    scenarioPresets: "संकट परिदृश्य प्रीसेट",
    interactiveWeights: "इंटरएक्टिव इंजन वेट्स",
    standardImd: "मानक आईएमडी",
    cyclonePriority: "चक्रवात प्राथमिकता",
    floodPriority: "अचानक बाढ़ प्राथमिकता",
    resetWeights: "वेट्स रीसेट करें",
    exportJson: "कॉन्फ़िगरेशन निर्यात",
    levelThresholds: "स्तर सीमाएँ:",
    testSos: "आपातकालीन SOS परीक्षण",
    incidentBulletin: "घटना बुलेटिन",

    // Notifications Page
    notificationsTitle: "अलर्ट और घटना लॉग",
    notificationsSubtitle: "मौसम की घटनाओं का वास्तविक समय रिकॉर्ड",
    clearAll: "सभी साफ़ करें",
    noAlerts: "कोई सक्रिय आपदा चेतावनी नहीं",
    noAlertsDesc: "सभी निगरानी क्षेत्र वर्तमान में सुरक्षित सीमाओं के भीतर हैं।",

    // General & Modal
    close: "बंद करें",
    emergencySosTitle: "आपातकालीन SOS स्पीड डायल",
    emergencySosDesc: "राज्य आपदा प्रबंधन अधिकारियों को तुरंत एक-टैप कॉल करें।",
    locationSharedNotice: "आपके निर्देशांक और वर्तमान क्षेत्र बचाव दलों के लिए तैयार हैं।",
  },
};

export function t(lang: LanguageCode, key: string): string {
  const dict = STRINGS[lang] || STRINGS.en;
  return dict[key] || STRINGS.en[key] || key;
}

export function translateCondition(condition: string, lang: LanguageCode): string {
  if (CONDITION_TRANSLATIONS[condition] && CONDITION_TRANSLATIONS[condition][lang]) {
    return CONDITION_TRANSLATIONS[condition][lang];
  }
  return condition;
}

export function translateCity(cityName: string, lang: LanguageCode): string {
  if (CITY_TRANSLATIONS[cityName] && CITY_TRANSLATIONS[cityName][lang]) {
    return CITY_TRANSLATIONS[cityName][lang];
  }
  return cityName;
}

export function translateDay(dayName: string, lang: LanguageCode): string {
  if (DAY_TRANSLATIONS[dayName] && DAY_TRANSLATIONS[dayName][lang]) {
    return DAY_TRANSLATIONS[dayName][lang];
  }
  return dayName;
}
