import { Routes, Route } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import Navbar from './components/layout/Navbar'
import Dashboard from './views/Dashboard'
import Employes from './views/Employes'
import HeuresSup from './views/HeuresSup'
import Tarifs from './views/Tarifs'
import CalculsHeuresSup from './views/CalculsHeuresSup'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employes" element={<Employes />} />
          <Route path="/heures-sup" element={<HeuresSup />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/calculs" element={<CalculsHeuresSup />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App 