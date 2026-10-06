// Where users get the desktop trackers (github.com/jwc20/pokerland-trackers).
export const TRACKERS_REPO_URL = 'https://github.com/jwc20/pokerland-trackers'

// Velopack names the installer <packId>-win-Setup.exe; GitHub serves the latest release's asset here.
export const WINDOWS_SETUP_URL = `${TRACKERS_REPO_URL}/releases/latest/download/PokerlandTracker-win-Setup.exe`

export const MAC_INSTALL_COMMANDS = [
  'brew install jwc20/tap/pokerland-tracker',
  'pokerland-tracker login',
  'brew services start pokerland-tracker',
]
