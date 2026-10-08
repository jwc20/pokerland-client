import { useEffect, useEffectEvent, useState } from 'react'
import type { Unit } from './table.ts'

const KEY = 'practice-unit'

function stored(fallback: Unit): Unit {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'bb' || value === 'chips' ? value : fallback
  } catch {
    return fallback // storage blocked: the default
  }
}

/**
 * The practice table's unit, big blinds or the hand's own chips, remembered on this device. The B key flips it,
 * as the button beside the table does.
 */
export function useUnit(fallback: Unit = 'bb') {
  const [unit, setUnit] = useState<Unit>(() => stored(fallback))

  function toggle() {
    const next = unit === 'bb' ? 'chips' : 'bb'
    setUnit(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // not remembered: it still applies here
    }
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    if (event.key.toLowerCase() !== 'b' || event.altKey || event.ctrlKey || event.metaKey) return
    if (target.closest('input, select, textarea')) return
    event.preventDefault()
    toggle()
  })
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return { unit, toggle }
}

const DECK_KEY = 'practice-four-colour'

/** Whether the practice table deals a four-colour deck, remembered on this device. */
export function useFourColour() {
  const [fourColour, setFourColour] = useState(() => {
    try {
      return localStorage.getItem(DECK_KEY) === '1'
    } catch {
      return false
    }
  })

  function toggle() {
    setFourColour(!fourColour)
    try {
      localStorage.setItem(DECK_KEY, fourColour ? '0' : '1')
    } catch {
      // not remembered: it still applies here
    }
  }

  return { fourColour, toggle }
}
