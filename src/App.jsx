import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
const Layout = React.lazy(() => import('../Layout'));
const Dashboard = React.lazy(() => import('../Pages/Dashboard'));
const Trades = React.lazy(() => import('../Pages/Trades'));
const Positions = React.lazy(() => import('../Pages/Positions'));
const Channels = React.lazy(() => import('../Pages/Channels'));
const Analytics = React.lazy(() => import('../Pages/Analytics'));
const News = React.lazy(() => import('../Pages/News'));
const Market = React.lazy(() => import('../Pages/Market'));
const Settings = React.lazy(() => import('../Pages/Settings'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="w-full h-screen flex items-center justify-center text-white">Loading...</div>}>
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
      </Suspense>
    </Router>
  )
}

export default App