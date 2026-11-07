import { createContext } from 'react'

// The shared "channel". Components read it through the useKnowledge hook.
export const KnowledgeContext = createContext(null)