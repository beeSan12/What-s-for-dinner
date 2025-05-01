import {  Routes, Route, Navigate  } from 'react-router-dom'
// import { useEffect} from 'react'
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
// import { AuthProvider, useAuth } from './components/context/AuthContext'

// function RedirectBasedOnAuth() {
//   const { isAuthenticated, loading } = useAuth()

//   if (loading) return <p>Loading...</p>
//   return isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
// }
export default function App() {
// function App() {
  // const {isAuthenticated, loading} = useAuth()
  // Navigate to the login screen if not authenticated, and wait for layout to be ready
  
  // useEffect(() => {
  //   if (
  //     !isAuthenticated &&
  //     !loading &&
  //     window.location.pathname !== '/login' &&
  //     window.location.pathname !== '/register'
  //   ) {
  //     <Navigate to="/login" replace /> // Safe navigation check to login
  //   }
  // }, [ isAuthenticated, loading])

  return (
    <>
    {/* <AuthProvider> */}
      <Navbar />
      <Routes>
        {/* Root path decides where to go */}
        {/* <Route path="/" element={<RedirectBasedOnAuth />} /> */}
        {/* <Route
          path="/"
          element={
            // <PublicRoute>
              <Navigate to="/login" replace />
            // </PublicRoute>
          }
        /> */}
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
        {/* Fallback: if no route matches */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

// export default App
