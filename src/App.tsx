import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { FirstRunGate } from './components/FirstRunGate'
import { GlobalFrame } from './components/GlobalFrame'
import { Buy } from './pages/Buy'
import { Checklist } from './pages/Checklist'
import { Complete } from './pages/Complete'
import { Drive } from './pages/Drive'
import { Emergency } from './pages/Emergency'
import { Familiarity } from './pages/Familiarity'
import { Garage } from './pages/Garage'
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
import { Welcome } from './pages/Welcome'
import { MeAnalysis } from './pages/MeAnalysis'
import { VehicleFirstDrive } from './pages/VehicleFirstDrive'
import { VehicleManual } from './pages/VehicleManual'
import { RentalSessionPage } from './pages/RentalSession'

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
        <Route element={<GlobalFrame />}>
          <Route path="/" element={<FirstRunGate />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/me" element={<Me />} />
          <Route path="/me/intake" element={<Navigate to="/welcome" replace />} />
          <Route path="/me/analysis" element={<MeAnalysis />} />
          <Route path="/me/passport" element={<Me />} />
          <Route path="/familiarity" element={<Familiarity />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/buy/deal" element={<Navigate to="/buy?tab=deal" replace />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/firsts" element={<Firsts />} />
          <Route path="/vehicle/first-drive" element={<VehicleFirstDrive />} />
          <Route path="/vehicle/manual" element={<VehicleManual />} />
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
          <Route path="/rental/session" element={<RentalSessionPage />} />
          <Route path="/rental/return" element={<RentalSessionPage returnMode />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
