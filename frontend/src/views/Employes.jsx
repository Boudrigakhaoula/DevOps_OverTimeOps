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
  TableRow
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { employeService } from '../services/api'

function Employes() {
  const [employes, setEmployes] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedEmploye, setSelectedEmploye] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    poste: ''
  })

  useEffect(() => {
    fetchEmployes()
  }, [])

  const fetchEmployes = async () => {
    try {
      const response = await employeService.getAll()
      setEmployes(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error)
    }
  }

  const handleOpen = (employe = null) => {
    if (employe) {
      setSelectedEmploye(employe)
      setFormData(employe)
    } else {
      setSelectedEmploye(null)
      setFormData({ nom: '', prenom: '', poste: '' })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedEmploye(null)
    setFormData({ nom: '', prenom: '', poste: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedEmploye) {
        await employeService.update(selectedEmploye.id, formData)
      } else {
        await employeService.create(formData)
      }
      fetchEmployes()
      handleClose()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await employeService.delete(id)
        fetchEmployes()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Employés</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Nouvel Employé
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Poste</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employes.map((employe) => (
              <TableRow key={employe.id}>
                <TableCell>{employe.nom}</TableCell>
                <TableCell>{employe.prenom}</TableCell>
                <TableCell>{employe.poste}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(employe)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(employe.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedEmploye ? 'Modifier Employé' : 'Nouvel Employé'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom"
              fullWidth
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Prénom"
              fullWidth
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Poste"
              fullWidth
              value={formData.poste}
              onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="contained">
              {selectedEmploye ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default Employes 