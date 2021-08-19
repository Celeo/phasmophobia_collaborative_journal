import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navbar } from "./Navbar";
import { AuthSignIn, AuthSignOut } from "./Auth";
import { Home } from "./Home";
import { Rooms } from "./Rooms";
import { Room } from "./Room";

export function App() {
  return (
    <div id="main">
      <Router>
        <Navbar />
        <section className="section">
          <div className="container">
            <Switch>
              <Route path="/auth/sign-in">
                <AuthSignIn />
              </Route>
              <Route path="/auth/sign-out">
                <AuthSignOut />
              </Route>
              <Route path="/rooms">
                <Rooms />
              </Route>
              <Route path="/room/:roomId">
                <Room />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </section>
      </Router>
    </div>
  );
}
