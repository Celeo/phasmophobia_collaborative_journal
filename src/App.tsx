import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { Navbar } from "./Navbar";
import { AuthSignIn, AuthSignOut } from "./Auth";
import { Profile } from "./Profile";
import { Home } from "./Home";
import { Rooms } from "./Rooms";
import { Room } from "./Room";
import { AppStore } from "./store";
import { supabase, loadUserName } from "./db";

export function App() {
  const history = useHistory();

  // effectively, connect Supabase auth to app data store
  useEffect(() => {
    const db = supabase();
    const { data: authListener } = db.auth.onAuthStateChange(
      async (_, session) => {
        const currentUser = session?.user;
        if (currentUser == null) {
          AppStore.update((store) => {
            store.loggedIn = false;
            store.username = null;
            history.push("/");
          });
        } else {
          const username = await loadUserName(db, currentUser?.id);
          AppStore.update((store) => {
            store.loggedIn = true;
            store.username = username;
          });
        }
      }
    );
    return () => {
      authListener?.unsubscribe();
    };
  });

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
              <Route path="/auth/profile">
                <Profile />
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
