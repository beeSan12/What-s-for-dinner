import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchProducts from './components/pages/SearchProducts';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route element={<Layout />}>
        </Route> */}
        {/* <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
      </Routes>
      <Routes>
        {/* <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} /> */}
        <Route path="/search" element={<SearchProducts />} />
      </Routes>
    </Router>
  );
}

export default App;