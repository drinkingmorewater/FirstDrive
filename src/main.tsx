import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/600.css'
import '@fontsource/noto-sans-sc/700.css'
import App from './App'
import { AppStateProvider } from './state/AppState'
import './styles/tokens.css'
import './styles/global.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/motion.css'
import './styles/pages/home.css'
import './styles/pages/buy.css'
import './styles/pages/trip.css'
import './styles/pages/drive.css'
import './styles/pages/help.css'
import './styles/pages/profile.css'
import './styles/pages/v5.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppStateProvider><App /></AppStateProvider>
    </BrowserRouter>
  </StrictMode>,
)
