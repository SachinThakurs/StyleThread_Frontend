import "./App.css";
import About from "./Pages/About/About";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthForm from "./Pages/Login/Auth";
import ProtectedRoute from "./ProtectedRoute";
import NoContentFound from "./NoContentFound";
import ProductList from "./Components/ProductList/ProductList";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Home from "./Pages/Home/Home";
import Navbar from "./Shared/Navbar";
import AddProduct from "./Pages/AddProduct/AddProduct";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Cart from "./Pages/Cart/Cart";
import FilterBar from "./Components/FiilterBar/FilterBar";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={ <Home />} />
          <Route path="home" element={<Home />} />
          <Route path="auth" element={<AuthForm />} />
          <Route path="productList" element={ <ProtectedRoute element={ProductList} allowedRoles={["Administrator"]} /> } />
          {" "}
          <Route path="addProduct" element={ <ProtectedRoute element={AddProduct} allowedRoles={["Administrator"]} /> } />
          <Route 
            path="editProduct/:id" 
            element={ 
              <ProtectedRoute 
                element={(props) => <AddProduct {...props} />} 
                allowedRoles={["Administrator"]} 
              /> 
            } 
          />
          <Route path="/product/:id" element={ <div className="product-form"> <ProductDetail /> </div> } />
          <Route path="about" element={<About />} />
          <Route path="NoContentFound" element={<NoContentFound />} />{" "}
          <Route path="*" element={<NoContentFound />} />
          <Route path="/cart" element={<div className="product-form"><ProtectedRoute element={Cart} allowedRoles={["Administrator"]} /></div>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
