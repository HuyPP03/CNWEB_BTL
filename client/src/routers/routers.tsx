import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ShoppingCart from "../pages/ShoppingCart";
import ProductDetailPage from "../pages/ProductDetailPage";
import CategoryPage from "../pages/CategoryPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="/:category" element={<CategoryPage />} />
      <Route path="/:category/:id" element={<ProductDetailPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
