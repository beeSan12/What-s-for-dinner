import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Search from './components/pages/Search'
import CreateShoppingList from './components/pages/CreateShoppingList'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import PublicRoute from './components/context/PublicRoute'
import Register from './components/pages/Register'
import Navbar from './components/types/Navbar'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/create-shopping-list" element={<CreateShoppingList />} />
      </Routes>
    </Router>
  )
}

export default App
