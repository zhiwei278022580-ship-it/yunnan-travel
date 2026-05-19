import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Destination from "./pages/Destination";
import AttractionDetail from "./pages/Attraction";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/destination/:id" element={<Destination />} />
          <Route path="/attraction/:id" element={<AttractionDetail />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
