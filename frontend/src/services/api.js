import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour logger les requêtes
api.interceptors.request.use(
  (config) => {
    console.log('Requête API:', config.method.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('Erreur de requête:', error)
    return Promise.reject(error)
  }
)

// Intercepteur pour logger les réponses
api.interceptors.response.use(
  (response) => {
    console.log('Réponse API:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('Erreur de réponse:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export const employeService = {
  getAll: () => api.get('/employes'),
  getById: (id) => api.get(`/employes/${id}`),
  create: (data) => api.post('/employes', data),
  update: (id, data) => api.put(`/employes/${id}`, data),
  delete: (id) => api.delete(`/employes/${id}`),
  getHeuresSup: (employeId, dateDebut, dateFin) => 
    api.get(`/employes/${employeId}/heures-sup/${dateDebut}/${dateFin}`)
}

export const heuresSupService = {
  getAll: () => api.get('/heures-sup'),
  create: (data) => api.post('/heures-sup', data),
  update: (id, data) => api.put(`/heures-sup/${id}`, data),
  delete: (id) => api.delete(`/heures-sup/${id}`),
  calculerMontant: (employeId, dateDebut, dateFin) =>
    api.get(`/heures-sup/calculer/${employeId}/${dateDebut}/${dateFin}`)
}

export const tarifService = {
  getAll: () => api.get('/tarifs'),
  create: (data) => api.post('/tarifs', data),
  update: (id, data) => api.put(`/tarifs/${id}`, data),
  delete: (id) => api.delete(`/tarifs/${id}`)
}

export default api 