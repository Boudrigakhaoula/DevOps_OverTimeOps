import { useState, useEffect } from 'react'
import { Grid, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { employeService, heuresSupService, tarifService } from '../services/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployes: 0,
    totalHeuresSup: 0,
    montantTotal: 0,
    calculsParEmploye: [],
    heuresParType: [],
    distributionHeures: []
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [employes, heuresSup, tarifs] = await Promise.all([
          employeService.getAll(),
          heuresSupService.getAll(),
          tarifService.getAll()
        ])

        console.log('Données reçues:', { employes: employes.data, heuresSup: heuresSup.data, tarifs: tarifs.data })

        // Créer un objet pour accéder facilement aux tarifs
        const tarifsMap = tarifs.data.reduce((acc, tarif) => {
          acc[tarif.type_jour] = tarif.tarif
          return acc
        }, {})

        // Calcul du total des heures supplémentaires
        const totalHeures = heuresSup.data.reduce((acc, curr) => acc + curr.nb_heures, 0)

        // Calculs par employé
        const calculsParEmploye = employes.data.map(employe => {
          const heuresEmploye = heuresSup.data.filter(h => h.employe_id === employe.id)
          console.log(`Heures pour ${employe.nom}:`, heuresEmploye)

          // Grouper les heures par date
          const heuresParDate = heuresEmploye.reduce((acc, hs) => {
            const date = format(new Date(hs.date), 'yyyy-MM-dd')
            const typeJour = new Date(hs.date).getDay() === 0 || new Date(hs.date).getDay() === 6 ? 'weekend' : 'jour ordinaire'
            const tarif = tarifsMap[typeJour] || 0

            if (!acc[date]) {
              acc[date] = {
                date: new Date(hs.date),
                heures: 0,
                montant: 0,
                typeJour
              }
            }
            acc[date].heures += hs.nb_heures
            acc[date].montant += hs.nb_heures * tarif
            return acc
          }, {})

          const totalHeures = Object.values(heuresParDate).reduce((sum, day) => sum + day.heures, 0)
          const montantTotal = Object.values(heuresParDate).reduce((sum, day) => sum + day.montant, 0)

          return {
            nom: employe.nom,
            heures: totalHeures,
            montant: montantTotal
          }
        })

        console.log('Calculs par employé:', calculsParEmploye)

        // Heures par type de jour
        const heuresParType = [
          { 
            type: 'Weekend', 
            heures: heuresSup.data
              .filter(h => new Date(h.date).getDay() === 0 || new Date(h.date).getDay() === 6)
              .reduce((acc, curr) => acc + curr.nb_heures, 0)
          },
          { 
            type: 'Ordinaire', 
            heures: heuresSup.data
              .filter(h => new Date(h.date).getDay() !== 0 && new Date(h.date).getDay() !== 6)
              .reduce((acc, curr) => acc + curr.nb_heures, 0)
          }
        ]

        // Distribution des heures par employé
        const distributionHeures = employes.data.map(employe => {
          const heuresEmploye = heuresSup.data.filter(h => h.employe_id === employe.id)
          return {
            nom: employe.nom,
            heures: heuresEmploye.reduce((acc, curr) => acc + curr.nb_heures, 0)
          }
        })

        const montantTotal = calculsParEmploye.reduce((acc, curr) => acc + curr.montant, 0)
        console.log('Montant total:', montantTotal)

        setStats({
          totalEmployes: employes.data.length,
          totalHeuresSup: totalHeures,
          montantTotal,
          calculsParEmploye,
          heuresParType,
          distributionHeures
        })
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
      }
    }

    fetchStats()
  }, [])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Employés
            </Typography>
            <Typography variant="h4">{stats.totalEmployes}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Heures Sup
            </Typography>
            <Typography variant="h4">{stats.totalHeuresSup}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Montant Total
            </Typography>
            <Typography variant="h4">{stats.montantTotal.toFixed(2)} DT</Typography>
          </Paper>
        </Grid>

        {/* Graphique des heures par type de jour */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Heures par Type de Jour
            </Typography>
            <BarChart width={500} height={300} data={stats.heuresParType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="heures" fill="#8884d8" />
            </BarChart>
          </Paper>
        </Grid>

        {/* Graphique de distribution des heures */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribution des Heures par Employé
            </Typography>
            <PieChart width={500} height={300}>
              <Pie
                data={stats.distributionHeures}
                dataKey="heures"
                nameKey="nom"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stats.distributionHeures.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>

        {/* Tableau des calculs par employé */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Calculs par Employé
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employé</TableCell>
                    <TableCell align="right">Heures</TableCell>
                    <TableCell align="right">Montant (DT)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.calculsParEmploye.map((employe) => (
                    <TableRow key={employe.nom}>
                      <TableCell>{employe.nom}</TableCell>
                      <TableCell align="right">{employe.heures.toFixed(1)}</TableCell>
                      <TableCell align="right">{employe.montant.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard 