import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import Auth from './features/Auth/pages/Auth'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;
	useEffect(() => {
		if (location.pathname === "/") {
			(async () => {
				const res = await fetch(`${GATEWAY_URL}/validateUser`, {
					method: "GET",
					credentials: "include",
				})
				if(res.status === 401){
					navigate('/auth/login')
				}else{
					navigate('/dashboard/home')
				}
			})()
		}
	}, []);


	return (

		<Routes>
			<Route path='/auth/*' Component={Auth}></Route>
			<Route path='/dashboard/*' Component={Dashboard}></Route>
			<Route path='/'></Route>
			<Route path='*' Component={NotFound}></Route>
		</Routes>

	)
}

export default App
