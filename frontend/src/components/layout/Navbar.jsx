import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import DashboardIcon from '@mui/icons-material/Dashboard'

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TimeOverOps
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<DashboardIcon />}
          >
            Tableau de bord
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/employes"
            startIcon={<PeopleIcon />}
          >
            Employés
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/heures-sup"
            startIcon={<AccessTimeIcon />}
          >
            Heures Sup
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/tarifs"
            startIcon={<AttachMoneyIcon />}
          >
            Tarifs
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/calculs"
          >
            Calculs
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar 