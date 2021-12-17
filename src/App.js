import "./App.css";

import SideMenu, { menuItems } from "./components/Menu/SideMenu";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useState } from "react";
import MarketPlace from "./components/MarketPlace/MarketPlace";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  const [inactive, setInactive] = useState(false);

  return (
    <div className="App">
      <Router>
        <SideMenu
          onCollapse={(inactive) => {
            console.log(inactive);
            setInactive(inactive);
          }}
        />
        <Routes>
          <Route path="/marketplace" element={<MarketPlace />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
        {/* <div className={`container ${inactive ? "inactive" : ""}`}>
          <Switch>
            <Route path="/Marketplace">
              <MarketPlace></MarketPlace>
            </Route>
            <Route path="/Dashboard">
              <Dashboard></Dashboard>
            </Route>
          </Switch>
        </div> */}
      </Router>
    </div>
  );
}

export default App;
