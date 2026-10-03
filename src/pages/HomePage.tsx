import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth.ts'

function HomePage() {
  const { user } = useAuth()

  return (
    <section className="welcome">
      <h1>Welcome, {user?.username}</h1>
      <p>
        To connect the tracker, copy your client token from <Link to="/settings">Settings</Link>.
      </p>
    </section>
  )
}

export default HomePage
