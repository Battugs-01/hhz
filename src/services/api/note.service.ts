import type {
    JudgeLoanNoteListRequest,
    JudgeLoanNoteListResponse,
    LoanNoteListRequest,
    LoanNoteListResponse,
} from '../types/note.types'
import { apiClient } from './client'

export const noteService = {
  listLoanNotes: async (
    params: LoanNoteListRequest
  ): Promise<LoanNoteListResponse> => {
    const response = await apiClient.post<LoanNoteListResponse>(
      '/notes/loan-notes/list',
      params
    )
    return response.data
  },

  listJudgeLoanNotes: async (
    params: JudgeLoanNoteListRequest
  ): Promise<JudgeLoanNoteListResponse> => {
    const response = await apiClient.post<JudgeLoanNoteListResponse>(
      '/notes/judge-loan-notes/list',
      params
    )
    return response.data
  },
}
