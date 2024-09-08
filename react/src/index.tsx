import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import Stats from './Stats'
import { ConfigureBrowserIfNotInsideGame } from './electron'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import EquipmentPage from './Equipment'
import HeroPage from './Hero'
import Creator from './Creator'
import Login from './Login'
import { WebBrowserWrapper } from './components/WebBrowserWrapper'

const isWebBrowser = ConfigureBrowserIfNotInsideGame()
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <WebBrowserWrapper active={isWebBrowser}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/hero" element={<HeroPage />} />
        <Route path="/eq" element={<EquipmentPage />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/creator" element={<Creator />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </WebBrowserWrapper>,
)
