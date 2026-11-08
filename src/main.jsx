import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css'
import './styles/layout.css'
import './styles/forms.css'
import App from './App.jsx'
import { KnowledgeProvider } from './store/KnowledgeProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <KnowledgeProvider>
        <App />
      </KnowledgeProvider>
    </BrowserRouter>
  </StrictMode>,
)