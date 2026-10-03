import { useEffect, useState } from 'react'

function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = setTimeout(() => setStatus('idle'), 2000)
    return () => clearTimeout(timer)
  }, [status])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus('failed') // no clipboard access, e.g. outside a secure context
    }
  }

  return (
    <button type="button" className="button" onClick={copy}>
      <span aria-live="polite">
        {status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy'}
      </span>
    </button>
  )
}

export default CopyButton
