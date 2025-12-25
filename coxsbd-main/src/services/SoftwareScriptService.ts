import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const BASE = `${API}/software-scripts`

export const getScripts = async (filters: Record<string, any> = {}) => {
  const { data } = await axios.get(BASE, { params: filters })
  return data
}

export const getScriptById = async (id: string) => {
  const { data } = await axios.get(`${BASE}/${id}`)
  return data
}

export const downloadScript = async (id: string) => {
  // Returns blob
  const res = await axios.get(`${BASE}/${id}/download`, { responseType: 'blob' })
  return res.data
}