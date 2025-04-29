import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Search from './components/pages/Search'
import CreateShoppingList from './components/pages/CreateShoppingList'
import FindRecipes from './components/pages/FindRecepies'
import SearchQuery from './components/types/SearchQuery'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import PublicRoute from './components/context/PublicRoute'
import PrivateRoute from './components/context/PrivateRoute'
import Register from './components/pages/Register'
import Navbar from './components/types/Navbar'
import { AuthProvider } from './components/context/AuthContext'

function App() {
  const isLoggedIn = localStorage.getItem('authToken') !== null

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
         <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
            }
          />
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
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="/create-shopping-list"
              element={<CreateShoppingList />}
            />
            <Route path="/find-recipe" element={<FindRecipes />} />
            <Route path="/search-query" element={<SearchQuery />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
