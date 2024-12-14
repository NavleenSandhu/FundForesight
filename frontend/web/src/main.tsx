import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App.tsx'
import './index.css'
import { persistor, store } from './store/store.ts'

const currentHour = new Date().getHours();
if (currentHour >= 18 || currentHour < 6) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById('root')!).render( 
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>

        <App />
      </Router>
      </PersistGate>
    </Provider>
)
