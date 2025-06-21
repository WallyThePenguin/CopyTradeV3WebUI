import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout'
import Dashboard from './Pages/Dashboard'
import Trades from './Pages/Trades'
import Positions from './Pages/Positions'
import Channels from './Pages/Channels'
import Analytics from './Pages/Analytics'
import News from './Pages/News'
import Market from './Pages/Market'
import Settings from './Pages/Settings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <Layout currentPageName="Dashboard">
            <Dashboard />
          </Layout>
        } />
        <Route path="/trades" element={
          <Layout currentPageName="Trades">
            <Trades />
          </Layout>
        } />
        <Route path="/positions" element={
          <Layout currentPageName="Positions">
            <Positions />
          </Layout>
        } />
        <Route path="/channels" element={
          <Layout currentPageName="Channels">
            <Channels />
          </Layout>
        } />
        <Route path="/analytics" element={
          <Layout currentPageName="Analytics">
            <Analytics />
          </Layout>
        } />
        <Route path="/news" element={
          <Layout currentPageName="News">
            <News />
          </Layout>
        } />
        <Route path="/market" element={
          <Layout currentPageName="Market">
            <Market />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout currentPageName="Settings">
            <Settings />
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App