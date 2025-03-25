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
  MenuItem
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { employeService, heuresSupService } from '../services/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

function HeuresSup() {
  const [heuresSup, setHeuresSup] = useState([])
  const [employes, setEmployes] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedHeureSup, setSelectedHeureSup] = useState(null)
  const [formData, setFormData] = useState({
    employe_id: '',
    date: '',
    nb_heures: ''
  })

  useEffect(() => {
    fetchHeuresSup()
    fetchEmployes()
  }, [])

  const fetchHeuresSup = async () => {
    try {
      const response = await heuresSupService.getAll()
      setHeuresSup(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des heures supplémentaires:', error)
    }
  }

  const fetchEmployes = async () => {
    try {
      const response = await employeService.getAll()
      setEmployes(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error)
    }
  }

  const handleOpen = (heureSup = null) => {
    if (heureSup) {
      setSelectedHeureSup(heureSup)
      setFormData({
        ...heureSup,
        date: format(new Date(heureSup.date), 'yyyy-MM-dd')
      })
    } else {
      setSelectedHeureSup(null)
      setFormData({
        employe_id: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        nb_heures: ''
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedHeureSup(null)
    setFormData({
      employe_id: '',
      date: '',
      nb_heures: ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedHeureSup) {
        await heuresSupService.update(selectedHeureSup.id, formData)
      } else {
        await heuresSupService.create(formData)
      }
      fetchHeuresSup()
      handleClose()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette heure supplémentaire ?')) {
      try {
        await heuresSupService.delete(id)
        fetchHeuresSup()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  const getEmployeName = (employeId) => {
    const employe = employes.find(e => e.id === employeId)
    return employe ? `${employe.nom} ${employe.prenom}` : ''
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Heures Supplémentaires</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Nouvelle Heure Sup
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employé</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Nombre d'heures</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {heuresSup.map((heureSup) => (
              <TableRow key={heureSup.id}>
                <TableCell>{getEmployeName(heureSup.employe_id)}</TableCell>
                <TableCell>
                  {format(new Date(heureSup.date), 'dd MMMM yyyy', { locale: fr })}
                </TableCell>
                <TableCell>{heureSup.nb_heures}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(heureSup)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(heureSup.id)}>
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
          {selectedHeureSup ? 'Modifier Heure Sup' : 'Nouvelle Heure Sup'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              select
              autoFocus
              margin="dense"
              label="Employé"
              fullWidth
              value={formData.employe_id}
              onChange={(e) => setFormData({ ...formData, employe_id: e.target.value })}
              required
            >
              {employes.map((employe) => (
                <MenuItem key={employe.id} value={employe.id}>
                  {employe.nom} {employe.prenom}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Nombre d'heures"
              type="number"
              fullWidth
              value={formData.nb_heures}
              onChange={(e) => setFormData({ ...formData, nb_heures: e.target.value })}
              required
              inputProps={{ min: 0, step: 0.5 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="contained">
              {selectedHeureSup ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default HeuresSup 