/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeatherGPTProvider } from "./lib/WeatherGPTContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Chat } from "./pages/Chat";
import { ClimateLens } from "./pages/ClimateLens";
import { Settings } from "./pages/Settings";
import { RiskHistory } from "./pages/RiskHistory";
import { RiskMap } from "./pages/RiskMap";
import { Notifications } from "./pages/Notifications";

export default function App() {
  return (
    <WeatherGPTProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/climate" element={<ClimateLens />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/risk-history" element={<RiskHistory />} />
            <Route path="/map" element={<RiskMap />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WeatherGPTProvider>
  );
}

