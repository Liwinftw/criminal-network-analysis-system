import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import NetworkAnalysis from './pages/NetworkAnalysis'
import PersonAnalysis from './pages/PersonAnalysis'
import SystemStatus from './pages/SystemStatus'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-bg-primary text-gray-100 font-mono overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/network" element={<NetworkAnalysis />} />
              <Route path="/analysis" element={<PersonAnalysis />} />
              <Route path="/analysis/:personId" element={<PersonAnalysis />} />
              <Route path="/status" element={<SystemStatus />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
