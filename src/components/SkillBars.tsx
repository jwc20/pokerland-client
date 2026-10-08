import type { SkillScore } from '../api/generated/data-contracts.ts'
import { formatPct } from '../playerStats.ts'
import { SKILL_HINTS } from '../practice.ts'
import { ShareBar } from './StatTile.tsx'
import './SkillBars.css'

/** Below this many graded answers (a rule of thumb counting half) a skill's range says little, so it isn't drawn. */
const SKILL_MIN = 3

/**
 * Accuracy by skill, each with its 95% range on a 0–100% track, as My game draws its shares: bars rather than a
 * radar chart, so they compare on one scale. A rule of thumb counts half and a reflection not at all.
 */
function SkillBars({ skills }: { skills: SkillScore[] }) {
  return (
    <div className="skill-bars">
      {skills.map((skill) => {
        const shown =
          skill.could >= SKILL_MIN && skill.pct !== null && skill.ci_low !== null && skill.ci_high !== null
            ? { did: skill.did, could: skill.could, pct: skill.pct, ci_low: skill.ci_low, ci_high: skill.ci_high }
            : undefined
        return (
          <div key={skill.skill} className="skill-bars-row" title={SKILL_HINTS[skill.skill]}>
            <span className="skill-bars-label">{skill.label}</span>
            {shown ? <ShareBar stat={shown} /> : <span className="skill-bars-few">Too few answers yet</span>}
            <span className="skill-bars-value">{shown ? formatPct(shown.pct) : '—'}</span>
            <span className="skill-bars-sample">
              {shown && `${formatPct(shown.ci_low)}–${formatPct(shown.ci_high)} · `}
              {skill.attempts.toLocaleString()} {skill.attempts === 1 ? 'answer' : 'answers'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default SkillBars
