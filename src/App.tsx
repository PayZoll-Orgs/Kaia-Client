import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PayZollLanding from './components/landing'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PayZollLanding />} />
      </Routes>
    </Router>
  )
}

export default App
