import "./App.css";
import About from "./Components/About/About";
import Navbar from "./Components/Header/Navbar";
import Home from "./Components/Home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductList from "./Components/ProductManagement/ProductList";
import AuthForm from "./Components/Login/Auth";
import NoContentFound from "./Components/NoContentFound";
import ProtectedRoute from "./Components/ProtectedRoute";
import ProductDetail from "./Components/Home/ProductDetail";
import AddProduct from "./Components/ProductManagement/AddProduct";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="product-form">
                <Home />
              </div>
            }
          />
          <Route
            path="home"
            element={
              <div className="product-form">
                <Home />
              </div>
            }
          />
          <Route path="auth" element={<AuthForm />} />
          <Route
            path="productList"
            element={
              <ProtectedRoute
                element={ProductList}
                allowedRoles={["Administrator"]} 
              />
            }
          /> <Route
          path="addProduct"
          element={
            <ProtectedRoute
              element={AddProduct}
              allowedRoles={["Administrator"]} 
            />
          }
        />
          <Route path="/product/:id" element={
            <div className="product-form">
              <ProductDetail /> 
              </div>}/>
          <Route path="about" element={<About />} />
          <Route path="NoContentFound" element={<NoContentFound />} />{" "}
          <Route path="*" element={<NoContentFound />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
