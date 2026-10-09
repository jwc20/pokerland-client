import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { changes } from './api/changes.ts'
import { errorMessage, hands } from './api/client.ts'
import type { HandNote, HandNoteWriteRequest } from './api/generated/data-contracts.ts'
import { queries } from './api/queries.ts'
import { withNote } from './notes.ts'

/**
 * What the user wrote on a hand, and saving or removing a note. `save` and
 * `remove` resolve to whether they worked; when one doesn't, `error` says why
 * until the next one does. A save puts the note in the cache at once, and
 * refreshes what notes change elsewhere: the review queue, the purposes and the
 * lists filtered by them.
 */
export function useHandNotes(id: number) {
  const client = useQueryClient()
  const notesQuery = queries.hands.notes(id)
  const query = useQuery(notesQuery)
  const [error, setError] = useState<string>()

  async function save(write: HandNoteWriteRequest) {
    try {
      const { data } = await hands.handsNotesCreate({ id }, write)
      client.setQueryData(notesQuery.queryKey, (current) => withNote(current ?? [], data))
      void changes.note(client)
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
      client.setQueryData(notesQuery.queryKey, (current) => (current ?? []).filter((other) => other.id !== note.id))
      void changes.note(client)
      setError(undefined)
      return true
    } catch (err) {
      setError(errorMessage(err))
      return false
    }
  }

  return { notes: query.data, error: error ?? (query.error ? errorMessage(query.error) : undefined), save, remove }
}

/** Tags to offer: the user's own, the most used first, then the suggested ones they haven't used. None until they
 * load, or if they don't: a tag can still be typed. */
export function useTagChoices() {
  const { data } = useQuery(queries.review())
  return useMemo(
    () => (data ? [...new Set([...data.tags.map((row) => row.tag), ...data.suggested_tags])] : []),
    [data],
  )
}
