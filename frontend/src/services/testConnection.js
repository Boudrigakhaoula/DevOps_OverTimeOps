import axios from 'axios'

const testConnection = async () => {
  try {
    console.log('Test de connexion au backend...')
    const response = await axios.get('http://localhost:3000/api/tarifs')
    console.log('Connexion réussie!', response.data)
    return true
  } catch (error) {
    console.error('Erreur de connexion au backend:', error.message)
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    }
    return false
  }
}

export default testConnection 