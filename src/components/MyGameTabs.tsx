import { NavLink, useLocation } from 'react-router'
import './MyGameTabs.css'

const TABS = [
  ['/stats', 'Overview'],
  ['/preflop', 'Starting hands'],
  ['/reports', 'Situations'],
  ['/sizing', 'Bet sizing'],
  ['/leaks', 'Leaks'],
] as const

/** Links between My game's pages, each keeping the hands the page is narrowed to. */
function MyGameTabs() {
  const { search } = useLocation()
  // The hands' filters carry over; a page's own parameters (its tab, its mode) don't.
  const params = new URLSearchParams(search)
  const kept = new URLSearchParams()
  for (const name of ['tag', 'since', 'until', 'spot', 'spec']) {
    const value = params.get(name)
    if (value) kept.set(name, value)
  }
  const query = kept.toString() ? `?${kept}` : ''
  return (
    <nav className="my-game-tabs" aria-label="My game">
      {TABS.map(([path, label]) => (
        <NavLink key={path} to={`${path}${query}`} end>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default MyGameTabs
