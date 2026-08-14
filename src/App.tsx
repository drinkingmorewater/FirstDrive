import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Buy } from './pages/Buy'
import { Checklist } from './pages/Checklist'
import { Complete } from './pages/Complete'
import { Drive } from './pages/Drive'
import { Emergency } from './pages/Emergency'
import { Familiarity } from './pages/Familiarity'
import { Garage } from './pages/Garage'
import { Home } from './pages/Home'
import { Help } from './pages/Help'
import { Memory } from './pages/Memory'
import { Me } from './pages/Me'
import { NotFound } from './pages/NotFound'
import { Onboarding } from './pages/Onboarding'
import { Rehearsal } from './pages/Rehearsal'
import { RouteCompare } from './pages/RouteCompare'
import { Practice } from './pages/Practice'
import { Firsts } from './pages/Firsts'
import { RoadTrip } from './pages/RoadTrip'
import { TripNew } from './pages/TripNew'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/me" element={<Me />} />
        <Route path="/familiarity" element={<Familiarity />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/buy/deal" element={<Navigate to="/buy?tab=deal" replace />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/firsts" element={<Firsts />} />
        <Route path="/trip/new" element={<TripNew />} />
        <Route path="/trip/compare" element={<RouteCompare />} />
        <Route path="/trip/rehearsal" element={<Rehearsal />} />
        <Route path="/trip/checklist" element={<Checklist />} />
        <Route path="/trip/drive" element={<Drive />} />
        <Route path="/trip/roadtrip" element={<RoadTrip />} />
        <Route path="/trip/complete" element={<Complete />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/help" element={<Help />} />
        <Route path="/help/:tool" element={<Help />} />
        <Route path="/garage" element={<Garage />} />
        <Route path="/memory" element={<Memory />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
