import type { useReplayPlayer } from '../useReplayPlayer.ts'

const SPEEDS = [0.5, 1, 2, 4]

// 16×16 icons, filled with the text color.
const ICONS = {
  play: 'M4 2.5v11L13 8z',
  pause: 'M4 2.5h3v11H4zM9 2.5h3v11H9z',
  first: 'M2 2.5h2v11H2zM9 2.5v11L4.5 8zM14 2.5v11L9.5 8z',
  previous: 'M3 2.5h2v11H3zM13 2.5v11L5.5 8z',
  next: 'M3 2.5v11L10.5 8zM11 2.5h2v11h-2z',
  last: 'M2 2.5v11L6.5 8zM7 2.5v11L11.5 8zM12 2.5h2v11h-2z',
}

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  )
}

/** Play/pause, the speed, and buttons to the first, previous, next and last step. */
function ReplayControls({ player }: { player: ReturnType<typeof useReplayPlayer> }) {
  const { index, last, playing, speed, setSpeed, seek, togglePlay } = player
  return (
    <div className="replay-controls">
      <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
        <Icon name={playing ? 'pause' : 'play'} />
      </button>
      <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))} aria-label="Speed">
        {SPEEDS.map((value) => (
          <option key={value} value={value}>
            {value}x
          </option>
        ))}
      </select>
      <button type="button" onClick={() => seek(0)} disabled={index === 0} aria-label="First step">
        <Icon name="first" />
      </button>
      <button type="button" onClick={() => seek(index - 1)} disabled={index === 0} aria-label="Previous step">
        <Icon name="previous" />
      </button>
      <button type="button" onClick={() => seek(index + 1)} disabled={index === last} aria-label="Next step">
        <Icon name="next" />
      </button>
      <button type="button" onClick={() => seek(last)} disabled={index === last} aria-label="Last step">
        <Icon name="last" />
      </button>
    </div>
  )
}

export default ReplayControls
