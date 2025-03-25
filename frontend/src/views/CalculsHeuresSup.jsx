import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material'
import { employeService, heuresSupService } from '../services/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

function CalculsHeuresSup() {
  const [employes, setEmployes] = useState([])
  const [calculs, setCalculs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [employesResponse, heuresSupResponse] = await Promise.all([
        employeService.getAll(),
        heuresSupService.getAll()
      ])

      setEmployes(employesResponse.data)
      
      // Calculer les montants pour chaque employé
      const calculsEmployes = employesResponse.data.map(employe => {
        const heuresSupEmploye = heuresSupResponse.data.filter(
          hs => hs.employe_id === employe.id
        )

        // Grouper les heures par date
        const heuresParDate = heuresSupEmploye.reduce((acc, hs) => {
          const date = format(new Date(hs.date), 'yyyy-MM-dd')
          if (!acc[date]) {
            acc[date] = {
              date: new Date(hs.date),
              heures: 0,
              montant: 0,
              typeJour: new Date(hs.date).getDay() === 0 || new Date(hs.date).getDay() === 6 ? 'weekend' : 'jour ordinaire'
            }
          }
          acc[date].heures += hs.nb_heures
          acc[date].montant += hs.nb_heures * (acc[date].typeJour === 'weekend' ? 35 : 25)
          return acc
        }, {})

        const totalMontant = Object.values(heuresParDate).reduce((sum, day) => sum + day.montant, 0)

        return {
          employe,
          details: Object.values(heuresParDate).sort((a, b) => a.date - b.date),
          totalMontant
        }
      })

      setCalculs(calculsEmployes)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      setError('Erreur lors du chargement des données. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Calculs des Heures Supplémentaires
      </Typography>

      <Grid container spacing={3}>
        {calculs.map((calcul) => (
          <Grid item xs={12} key={calcul.employe.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {calcul.employe.nom} {calcul.employe.prenom}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  Total: {calcul.totalMontant.toFixed(2)} DT
                </Typography>

                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type de jour</TableCell>
                        <TableCell align="right">Heures</TableCell>
                        <TableCell align="right">Tarif horaire</TableCell>
                        <TableCell align="right">Montant</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calcul.details.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {format(detail.date, 'dd MMMM yyyy', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            {detail.typeJour === 'weekend' ? 'Weekend' : 'Jour ordinaire'}
                          </TableCell>
                          <TableCell align="right">{detail.heures.toFixed(1)}</TableCell>
                          <TableCell align="right">
                            {detail.typeJour === 'weekend' ? '35.00' : '25.00'} DT
                          </TableCell>
                          <TableCell align="right">{detail.montant.toFixed(2)} DT</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default CalculsHeuresSup