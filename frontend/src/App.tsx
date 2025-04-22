import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchProducts from './components/pages/SearchProducts';
import CreateShoppingList from "./components/pages/CreateShoppingList";
import Home from './components/pages/Home';
import Login from './components/pages/Login';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
        {/* <Route element={<Layout />}>
        </Route> */}
        {/* <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
      </Routes>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} /> */}
        <Route path="/search" element={<SearchProducts />} />
        <Route path="/create-shopping-list" element={<CreateShoppingList />} />

      </Routes>
    </Router>
  );
}

export default App;