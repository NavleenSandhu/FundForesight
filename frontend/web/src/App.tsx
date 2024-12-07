import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import Auth from './features/Auth/pages/Auth'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

function App() {
	const location = useLocation();

	const navigate = useNavigate();
	useEffect(() => {
		if (location.pathname === "/") {
			navigate("/dashboard/home");
		}
	}, []);


	return (

		<Routes>
			<Route path='/auth/*' Component={Auth}></Route>
			<Route path='/dashboard/*' Component={Dashboard}></Route>
			<Route path='*' Component={NotFound}></Route>
		</Routes>

	)
}

export default App
