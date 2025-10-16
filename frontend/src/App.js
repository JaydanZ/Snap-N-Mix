import "./App.css";
import React, { useState, useEffect } from "react";
import StartPageLayout from "./Components/UI/StartPageLayout";
import Login from "./Components/Login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, useHistory } from "react-router-dom";
import Home from "./Components/Home/Home";
import Scan from "./Components/Scan/Scan";
import Browse from "./Components/Browse/Browse";
import Community from "./Components/Community/Community";
import Account from "./Components/Account/Account";
import LaunchPage from "./Components/UI/LaunchPage";

function App() {
  let history = useHistory();

  const launchHandler = () => {
    setLaunchVisibility("");
    history.push("/login");
  };

  const [navigationBar2, setNavigationBar2] = useState("");
  const [launchVisibility, setLaunchVisibility] = useState(
    <LaunchPage visible="true" handler={launchHandler} />
  );

  const pathname = history.location.pathname;

  useEffect(() => {
    if (pathname !== "/") {
      setLaunchVisibility("");
    }
  }, [pathname]);

  return (
    <div>
      {pathname === "/browse" ||
      pathname === "/scan" ||
      pathname === "/community" ||
      pathname === "/account" ||
      pathname === "/scan/cocktail-result"
        ? navigationBar2
        : ""}
      {launchVisibility}
      <Route path="/login">
        <StartPageLayout>
          <Login navBar={setNavigationBar2} />
        </StartPageLayout>
      </Route>
      <Route path="/home">
        <Home navBar={setNavigationBar2} />
      </Route>
      <Route path="/scan">
        <Scan navBar={setNavigationBar2} />
      </Route>
      <Route exact path="/browse">
        <Browse navBar={setNavigationBar2} />
      </Route>
      <Route path="/Community">
        <Community navBar={setNavigationBar2} />
      </Route>
      <Route path="/account">
        <Account navBar={setNavigationBar2} />
      </Route>
    </div>
  );
}

export default App;
