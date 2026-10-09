import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { CLASSES_CLOSED, CLASSES_ENABLED } from '../features.ts'

/** A link into classes: an ordinary link once they are open, disabled text until then (src/features.ts). */
function ClassesLink({ to = '/classes', children }: { to?: string; children: ReactNode }) {
  if (CLASSES_ENABLED) return <Link to={to}>{children}</Link>
  return (
    <span className="link-disabled" aria-disabled="true" title={CLASSES_CLOSED}>
      {children}
    </span>
  )
}

export default ClassesLink
