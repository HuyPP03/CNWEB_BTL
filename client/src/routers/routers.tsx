import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ShoppingCart from "../pages/ShoppingCart";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
