import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { toast } from "bulma-toast";
import { AppStore } from "./store";

export function AuthSignIn() {
  const [email, setEmail] = React.useState("");
  const [inputErrors, setInputErrors] = React.useState<Array<string>>([]);
  const [supabaseError, setSupabaseError] = React.useState<string | null>(null);
  const history = useHistory();
  const supabase = AppStore.useState((s) => s.supabase);

  const doSetEmail = (value: string) => {
    setEmail(value);
    setSupabaseError(null);
  };

  const signIn = async () => {
    const result = await supabase.auth.signIn({ email });
    if (result.error) {
      const { error } = result;
      console.error(`Sign in error: ${error.message}`);
      setSupabaseError(error.message);
    } else {
      toast({
        message: "Email sent",
        type: "is-info",
        position: "center",
        duration: 5000,
      });
      setSupabaseError(null);
      history.push("/");
    }
  };

  React.useEffect(() => {
    const errors = [];
    if (email.trim().length === 0) {
      errors.push("Email cannot be empty");
    }
    const emailFieldRefRaw = document.getElementById("auth-email");
    if (emailFieldRefRaw !== null) {
      const emailFieldRef = emailFieldRefRaw as HTMLInputElement;
      if (!emailFieldRef.validity.valid) {
        errors.push("Invalid email format");
      }
    }
    setInputErrors(errors);
  }, [email]);

  return (
    <div>
      <div className="content">
        <h2>Sign in or register</h2>
        <p className="has-text-white">
          This site uses a passwordless login system. <br />
          Simply enter your email below, click the button, and then click the
          link you receive in your inbox. <br />
          <br />
          Your email will not be used for anything else.
        </p>
      </div>
      <div className="columns">
        <div className="column is-4">
          <div className="field">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              id="auth-email"
              onChange={(e) => doSetEmail(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button
            className="button is-link is-primary"
            onClick={signIn}
            disabled={inputErrors.length !== 0}
          >
            Send email
          </button>
        </div>
      </div>
      <div id="form-errors">
        {email &&
          inputErrors.map((error, index) => (
            <p key={`error-${index}`} className="has-text-danger">
              {error}
            </p>
          ))}
      </div>
      <div id="auth-errors">
        <p className="has-text-danger">{supabaseError}</p>
      </div>
    </div>
  );
}

export function AuthSignOut() {
  const supabase = AppStore.useState((s) => s.supabase);

  React.useEffect(() => {
    (async function () {
      await supabase.auth.signOut();
      localStorage.clear();
    })();
  });

  return <Redirect to="/" />;
}
