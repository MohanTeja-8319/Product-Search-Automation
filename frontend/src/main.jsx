import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { getInitialTheme, applyTheme } from './utils/themeHelper'
import { registerPwaServiceWorker } from './utils/pwaHelper'

applyTheme(getInitialTheme());
registerPwaServiceWorker();

createRoot(document.getElementById('root')).render(
 <StrictMode>
 <App />
 </StrictMode>,
)
