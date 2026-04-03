import React, { useMemo } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import '../styles/layout.scss'

const AppLayout = () => {
  const { user, handleLogout, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const pageLabel = useMemo(() => {
    if (location.pathname.startsWith('/app/interview')) return 'Interview Report'
    if (location.pathname === '/' || location.pathname.startsWith('/home')) return 'Home'
    return 'Dashboard'
  }, [location.pathname])

  const displayName = user?.username || user?.email || 'Account'

  const onLogout = async () => {
    try {
      await handleLogout()
      navigate('/', { replace: true })
    } catch (err) {
      // Swallow to keep UI responsive; logout already logs errors internally.
    }
  }

  return (
    <div className='app-shell'>
      <header className='app-header'>
        <div className='app-brand'>
          <Link to='/' className='brand-link'>Gen AI Resume Builder</Link>
          <span className='page-label'>{pageLabel}</span>
        </div>
        <nav className='app-nav'>
          <Link to='/' className={location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}>Home</Link>
          <Link to='/app/interview' className={location.pathname.startsWith('/app/interview') ? 'active' : ''}>Interview</Link>
        </nav>
        <div className='app-actions'>
          <div className='user-chip'>
            <span className='user-avatar'>{displayName[0]?.toUpperCase() || 'U'}</span>
            <span className='user-name'>{displayName}</span>
          </div>
          <button type='button' className='logout-btn' onClick={onLogout} disabled={loading}>
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </header>
      <main className='app-content'>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
