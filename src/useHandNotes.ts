import { useEffect, useState } from 'react'
import { errorMessage, hands, review } from './api/client.ts'
import type { HandNote, HandNoteWriteRequest } from './api/generated/data-contracts.ts'
import { withNote } from './notes.ts'

/**
 * What the user wrote on a hand, and saving or removing a note. `save` and
 * `remove` resolve to whether they worked; when one doesn't, `error` says why
 * until the next one does.
 */
export function useHandNotes(id: number) {
  const [notes, setNotes] = useState<HandNote[]>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    let active = true
    hands.handsNotesList({ id }).then(
      ({ data }) => {
        if (active) setNotes(data)
      },
      (err) => {
        if (active) setError(errorMessage(err))
      },
    )
    return () => {
      active = false
    }
  }, [id])

  async function save(write: HandNoteWriteRequest) {
    try {
      const { data } = await hands.handsNotesCreate({ id }, write)
      setNotes((current) => withNote(current ?? [], data))
      setError(undefined)
      return true
    } catch (err) {
      setError(errorMessage(err))
      return false
    }
  }

  async function remove(note: HandNote) {
    try {
      await hands.handsNotesDestroy({ id, noteId: note.id })
      setNotes((current) => (current ?? []).filter((other) => other.id !== note.id))
      setError(undefined)
      return true
    } catch (err) {
      setError(errorMessage(err))
      return false
    }
  }

  return { notes, error, save, remove }
}

/** Tags to offer: the user's own, the most used first, then the suggested ones they haven't used. */
export function useTagChoices() {
  const [choices, setChoices] = useState<string[]>([])
  useEffect(() => {
    let active = true
    review.reviewRetrieve().then(
      ({ data }) => {
        if (active) setChoices([...new Set([...data.tags.map((row) => row.tag), ...data.suggested_tags])])
      },
      () => {}, // a tag can still be typed
    )
    return () => {
      active = false
    }
  }, [])
  return choices
}
