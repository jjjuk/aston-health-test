import { createContext } from 'react'

export const initialContactInfo = {
  open: false,
  patientId: null,
  contactInfo: undefined,
}

export const EditContactInfoContext = createContext({
  editContactInfo: initialContactInfo,
  setEditContactInfo: () => {},
})

export const initialAddAnalysis = {
  open: false,
  patientId: null,
}

export const AddAnalysisContext = createContext({
  addAnalysis: initialAddAnalysis,
  setAddAnalysis: () => {},
})

export const initialAddDisease = {
  open: false,
  patientId: null,
}

export const AddDiseaseContext = createContext({
  addDisease: initialAddDisease,
  setAddDisease: () => {},
})
