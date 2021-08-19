import React from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "./db";

export const Navbar = (): React.ReactElement => {
  const current = useLocation().pathname;
  const currentSession = supabase().auth.session();

  const linkClassName = (path: string): string => {
    if (current === path) {
      return "navbar-item is-active";
    }
    return "navbar-item";
  };

  const authButtons =
    currentSession === null ? (
      <Link to="/auth/sign-in" className={linkClassName("/auth/sign-in")}>
        Sign in
      </Link>
    ) : (
      <Link to="/auth/sign-out" className={linkClassName("/auth/sign-out")}>
        Sign out
      </Link>
    );

  return (
    <nav
      className="navbar is-success"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          Phasmophobia Collaborative Journal
        </a>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link to="/" className={linkClassName("/")}>
            Home
          </Link>
          {currentSession !== null && (
            <Link to="/rooms" className={linkClassName("/rooms")}>
              Create/join room
            </Link>
          )}
          {currentSession === null && (
            <Link to="/rooms" className={linkClassName("/rooms")}>
              View room
            </Link>
          )}
        </div>
        <div className="navbar-end">{authButtons}</div>
      </div>
    </nav>
  );
};
