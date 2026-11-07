import { useReducer } from 'react'
import { KnowledgeContext } from './KnowledgeContext'
import { knowledgeReducer } from './knowledgeReducer'
import { sampleConcepts, sampleConnections } from '../data/sampleData'

const initialState = {
  concepts: sampleConcepts,
  connections: sampleConnections,
}

export function KnowledgeProvider({ children }) {
  const [state, dispatch] = useReducer(knowledgeReducer, initialState)

  return (
    <KnowledgeContext.Provider value={{ ...state, dispatch }}>
      {children}
    </KnowledgeContext.Provider>
  )
}