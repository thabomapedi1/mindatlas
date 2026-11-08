import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import PlaceholderPage from './components/PlaceholderPage'
import Overview from './pages/Overview'
import GraphPage from './pages/GraphPage'
import { navItems } from './data/navItems'

// Pages that are built so far. Anything not listed shows the placeholder.
const pages = {
  '/': <Overview />,
  '/graph': <GraphPage />,
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {navItems.map(({ path, label, description }) => (
          <Route
            key={path}
            path={path}
            element={
              pages[path] ?? <PlaceholderPage title={label} description={description} />
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App