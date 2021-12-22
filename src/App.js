import "./App.css";

import SideMenu, { menuItems } from "./components/Menu/SideMenu";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useState } from "react";
import MarketPlace from "./components/MarketPlace/MarketPlace";
import Dashboard from "./components/Dashboard/Dashboard";
import Create from "./components/Dashboard/Create/Create";
import Collection from "./components/Dashboard/Collection/Collection";
import Sidebarmenu from "./components/Menu/Sidebarmenu";

function App() {
  const [inactive, setInactive] = useState(false);

  return (
    <div className="App">
      {/* <Sidebarmenu></Sidebarmenu> */}
      <Router>
        <Sidebarmenu></Sidebarmenu>
        {/* <Routes>
          <Route path="/marketplace" element={<MarketPlace />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/dashboard/collection" element={<Collection />}></Route>
          <Route path="/dashboard/create" element={<Create />}></Route>
        </Routes> */}
      </Router>
    </div>
  );
}

export default App;
