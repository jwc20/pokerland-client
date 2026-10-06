import { useState } from 'react'
import { MAC_INSTALL_COMMANDS, TRACKERS_REPO_URL, WINDOWS_SETUP_URL } from '../trackers.ts'
import CopyButton from './CopyButton.tsx'

type Platform = 'windows' | 'mac'

function detectPlatform(): Platform {
  return /Mac|iPhone|iPad/.test(navigator.userAgent) ? 'mac' : 'windows'
}

/** Install instructions for the desktop tracker, defaulting to the visitor's OS. */
function TrackerDownloads() {
  const [platform, setPlatform] = useState<Platform>(detectPlatform)

  return (
    <div className="tracker-downloads">
      <div className="segmented" role="tablist" aria-label="Operating system">
        <button
          type="button"
          role="tab"
          aria-selected={platform === 'windows'}
          onClick={() => setPlatform('windows')}
        >
          Windows
        </button>
        <button type="button" role="tab" aria-selected={platform === 'mac'} onClick={() => setPlatform('mac')}>
          macOS
        </button>
      </div>

      {platform === 'windows' ? (
        <ol className="steps">
          <li>
            <a className="button" href={WINDOWS_SETUP_URL}>
              Download PokerlandTracker-win-Setup.exe
            </a>
          </li>
          <li>Run it. It installs for your user only and opens its settings window.</li>
          <li>Paste your client token from above and click Connect.</li>
          <li>Done: it sits in the system tray, starts with Windows and updates itself.</li>
        </ol>
      ) : (
        <ol className="steps">
          <li>
            Install with Homebrew, then save your token and start the service:
            <ul className="commands">
              {MAC_INSTALL_COMMANDS.map((command) => (
                <li key={command}>
                  <code>{command}</code>
                  <CopyButton text={command} />
                </li>
              ))}
            </ul>
          </li>
          <li>
            <code>pokerland-tracker login</code> asks for the client token from above.
          </li>
          <li>
            It runs in the background from now on. <code>pokerland-tracker status</code> shows what it is
            doing.
          </li>
        </ol>
      )}
      <p className="card-hint">
        The tracker only reads your PokerStars <code>HandHistory</code> folder and uploads new hands as they
        are written. Source code and release notes: <a href={TRACKERS_REPO_URL}>GitHub</a>.
      </p>
    </div>
  )
}

export default TrackerDownloads
