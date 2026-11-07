import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import PlaceholderPage from './components/PlaceholderPage'
import { navItems } from './data/navItems'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {navItems.map(({ path, label, description }) => (
          <Route
            key={path}
            path={path}
            element={<PlaceholderPage title={label} description={description} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App