import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { tarifService } from '../services/api'
import testConnection from '../services/testConnection'

function Tarifs() {
  const [tarifs, setTarifs] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedTarif, setSelectedTarif] = useState(null)
  const [formData, setFormData] = useState({
    type_jour: '',
    tarif: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendConnected, setBackendConnected] = useState(false)

  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    const isConnected = await testConnection()
    setBackendConnected(isConnected)
    if (isConnected) {
      fetchTarifs()
    } else {
      setError('Impossible de se connecter au serveur backend. Veuillez vérifier que le serveur est en cours d\'exécution.')
      setLoading(false)
    }
  }

  const fetchTarifs = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Chargement des tarifs...')
      const response = await tarifService.getAll()
      console.log('Tarifs chargés:', response.data)
      // Conversion des tarifs en nombres
      const tarifsFormatted = response.data.map(tarif => ({
        ...tarif,
        tarif: Number(tarif.tarif)
      }))
      setTarifs(tarifsFormatted)
    } catch (error) {
      console.error('Erreur lors du chargement des tarifs:', error)
      setError('Erreur lors du chargement des tarifs. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = (tarif = null) => {
    if (tarif) {
      setSelectedTarif(tarif)
      setFormData({
        ...tarif,
        tarif: Number(tarif.tarif)
      })
    } else {
      setSelectedTarif(null)
      setFormData({
        type_jour: '',
        tarif: ''
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedTarif(null)
    setFormData({
      type_jour: '',
      tarif: ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dataToSubmit = {
        ...formData,
        tarif: Number(formData.tarif)
      }
      if (selectedTarif) {
        await tarifService.update(selectedTarif.id, dataToSubmit)
      } else {
        await tarifService.create(dataToSubmit)
      }
      fetchTarifs()
      handleClose()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setError('Erreur lors de la sauvegarde. Veuillez réessayer.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) {
      try {
        await tarifService.delete(id)
        fetchTarifs()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        setError('Erreur lors de la suppression. Veuillez réessayer.')
      }
    }
  }

  const getTypeJourLabel = (type) => {
    switch (type) {
      case 'weekend':
        return 'Weekend'
      case 'jour ordinaire':
        return 'Jour ordinaire'
      default:
        return type
    }
  }

  const formatTarif = (tarif) => {
    const numTarif = Number(tarif)
    return !isNaN(numTarif) ? numTarif.toFixed(2) : '0.00'
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Tarifs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={!backendConnected}
        >
          Nouveau Tarif
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!backendConnected && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Le serveur backend n'est pas accessible. Veuillez vérifier que le serveur est en cours d'exécution sur le port 3000.
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type de jour</TableCell>
                <TableCell>Tarif (DT/heure)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tarifs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Aucun tarif disponible
                  </TableCell>
                </TableRow>
              ) : (
                tarifs.map((tarif) => (
                  <TableRow key={tarif.id}>
                    <TableCell>{getTypeJourLabel(tarif.type_jour)}</TableCell>
                    <TableCell>{formatTarif(tarif.tarif)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(tarif)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(tarif.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedTarif ? 'Modifier Tarif' : 'Nouveau Tarif'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              select
              autoFocus
              margin="dense"
              label="Type de jour"
              fullWidth
              value={formData.type_jour}
              onChange={(e) => setFormData({ ...formData, type_jour: e.target.value })}
              required
            >
              <MenuItem value="weekend">Weekend</MenuItem>
              <MenuItem value="jour ordinaire">Jour ordinaire</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Tarif (DT/heure)"
              type="number"
              fullWidth
              value={formData.tarif}
              onChange={(e) => setFormData({ ...formData, tarif: e.target.value })}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="contained">
              {selectedTarif ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default Tarifs 