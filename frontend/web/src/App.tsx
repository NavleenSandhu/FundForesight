import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Auth from './features/Auth/pages/Auth'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/auth/*' Component={Auth}></Route>
        <Route path='/dashboard/*' Component={Dashboard}></Route>
        <Route path='*' Component={NotFound}></Route>
      </Routes>
    </Router>
  )
}

export default App
