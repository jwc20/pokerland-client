<h1 align="center">Pokerland</h1>

<p align="center">
  <a href="#quick-start"><strong>Quick start</strong></a> •
  <a href="#scripts"><strong>Scripts</strong></a> •
  <a href="#development"><strong>Development</strong></a> •
  <a href="#deploying"><strong>Deploying</strong></a> •
  <a href="https://github.com/jwc20/pokerland-api"><strong>API</strong></a> •
  <a href="https://github.com/jwc20/pokerland-trackers"><strong>Trackers</strong></a>
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/react-19-149eca?logo=react&logoColor=white">
  <img alt="React Router 8" src="https://img.shields.io/badge/react%20router-8-ca4245?logo=reactrouter&logoColor=white">
  <img alt="TypeScript 6" src="https://img.shields.io/badge/typescript-6-3178c6?logo=typescript&logoColor=white">
  <img alt="Vite 8" src="https://img.shields.io/badge/vite-8-646cff?logo=vite&logoColor=white">
  <img alt="Hosted on Cloudflare Workers" src="https://img.shields.io/badge/hosted%20on-Cloudflare%20Workers-f38020?logo=cloudflare&logoColor=white">
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue"></a>
</p>

<table>
  <tr>
    <td width="50%">

<https://github.com/user-attachments/assets/a05150b2-123e-4615-873e-1be7c0e99c80>

  </td>
    <td width="50%">
<img alt="CleanShot 2026-10-06 at 16 13 43" src="https://github.com/user-attachments/assets/600145fd-bb17-4c61-ac32-fad80921b9ca" />
  </td>
  </tr>
</table>

## Quick start

You need Node.js 20.19+ or 22.12+, and [pokerland-api](https://github.com/jwc20/pokerland-api) running at
<http://localhost:8000> (see its quick start).

```bash
git clone https://github.com/jwc20/pokerland-client.git
cd pokerland-client
npm install
npm run dev    # http://localhost:5173
```

The committed `.env.development` already points the app at <http://localhost:8000>. Create an account at
<http://localhost:5173/register>, copy the client token from Settings, and sign a tracker in to your local API:

```bash
pokerland-tracker login --api http://localhost:8000
```

## Scripts

| Command                                               | What it does                                                                             |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `npm run dev`                                         | Starts Vite's dev server on port 5173, with hot reload                                   |
| `npm run build`                                       | Type-checks and builds to `dist/`, including the `version.json` the update banner checks |
| `npm run lint`                                        | Runs ESLint, with the React Hooks rules                                                  |
| `npm run preview`                                     | Serves the build locally                                                                 |
| `npm run generate:api`                                | Regenerates `src/api/generated/` from pokerland-api's OpenAPI schema                     |
| `npm run deploy:staging`, `npm run deploy:production` | Builds for that mode and deploys it to Cloudflare                                        |
| `npm run upload:production`                           | Builds and uploads a production version without deploying it                             |

## Development

```
src/
  pages/           Home, Game History, Replay and Settings
  components/      the home page's widgets, the hand table, playing cards, the replay's controls and decision panel, ...
  api/client.ts    sets up the generated API classes: the base URL, cookies and token refresh
  api/generated/   generated from pokerland-api's OpenAPI schema; don't edit
  auth/            who is signed in, the sign-in form and the route guards
  calendar.ts      days as "YYYY-MM-DD" keys and the calendar grids, in UTC so a clock change never skips a day
  decision.ts      the numbers behind each of the hero's decisions: pot odds, MDF, bet sizes, effective stack, SPR, M
  handFormat.ts    amounts, stakes, big blinds, cards, hand nicknames and tag labels
  replay.ts        turns a hand's events into the replay's steps
  index.css        light and dark colour tokens, and the styles the pages share
```

### Conventions

- **Plain CSS.** Each component has its own file, with class names prefixed by the component's name. Colours come
  from the tokens in `src/index.css`, which has light and dark values for each. The results calendar's colour scales
  are tokens too, picked so colour-blind readers can tell losses from wins.
- **Few dependencies.** There are no UI, chart, date or state libraries: React, React Router and the generated API
  client do the work.
- **Explicit imports.** Imports include their `.ts` or `.tsx` extension, and types come in with `import type`.

## Deploying

The app is static assets on Cloudflare Workers (`wrangler.json`). Unknown paths get `index.html`, so client-side
routes work on a reload.

| Environment  | Command                     | Served at                            |
| ------------ | --------------------------- | ------------------------------------ |
| `staging`    | `npm run deploy:staging`    | workers.dev, with preview URLs       |
| `production` | `npm run deploy:production` | The custom domain in `wrangler.json` |

- Each mode reads `.env.<mode>`, described in [`.env.example`](.env.example). `VITE_API_BASE_URL` is the API's base
  URL, and the API must list the app's origin in its `CORS_ALLOWED_ORIGINS`. Only `VITE_` variables reach the app,
  and they are public, so never put a secret in these files.
- Sign in to Cloudflare with `npx wrangler login` locally. In CI, set `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID`.
- Built assets are cached for a year (`public/_headers`). Each build writes `BUILD_ID` (the build time, unless you
  set it) to `version.json`, which open tabs check before offering a reload.

## Related projects

- [pokerland-api](https://github.com/jwc20/pokerland-api): the Django REST API that parses the hand histories and
  serves this app.
- [pokerland-trackers](https://github.com/jwc20/pokerland-trackers): the trackers for Windows and macOS that upload
  them.

## Support

Found a bug, or have an idea? [Open an issue](https://github.com/jwc20/pokerland-client/issues).

## License

[MIT](LICENSE)
