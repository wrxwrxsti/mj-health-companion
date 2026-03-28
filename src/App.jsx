import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Medications from './pages/Medications'
import Documents from './pages/Documents'
import Timeline from './pages/Timeline'
import Appointments from './pages/Appointments'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="medications" element={<Medications />} />
          <Route path="documents" element={<Documents />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
