import { useContext } from 'react'
import { KnowledgeContext } from './KnowledgeContext'

export function useKnowledge() {
  const value = useContext(KnowledgeContext)
  if (value === null) {
    throw new Error('useKnowledge must be used inside <KnowledgeProvider>')
  }
  return value
}