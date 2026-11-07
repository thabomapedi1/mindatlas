import { NavLink } from 'react-router-dom'
import { navItems } from '../data/navItems'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">MindAtlas</div>
      <nav aria-label="Main navigation">
        <ul className="nav-list">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar