import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/auth/*' Component={Auth}></Route>
        <Route path='*' Component={NotFound}></Route>
      </Routes>
    </Router>
  )
}

export default App
