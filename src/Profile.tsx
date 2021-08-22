import React, { useEffect, useState } from "react";
import { loadUserName, TABLE_NAME_USERNAME, updateUsername } from "./db";
import { toast } from "bulma-toast";
import { AppStore } from "./store";

const MINIMUM_NAME_LENGTH = 3;
const MAXIMUM_NAME_LENGTH = 20;

function ChangeUsername() {
  const [newName, setNewName] = useState("");
  const [inputErrors, setInputErrors] = useState<Array<string>>([]);
  const supabase = AppStore.useState((s) => s.supabase);

  useEffect(() => {
    const errors = [];
    if (newName.length < MINIMUM_NAME_LENGTH) {
      errors.push(
        `Name has to be at least ${MINIMUM_NAME_LENGTH} characters long`
      );
    }
    if (newName.length > MAXIMUM_NAME_LENGTH) {
      errors.push(
        `Name has to be ${MAXIMUM_NAME_LENGTH} characters or less in length`
      );
    }
    // if I want to care about name overlap, that'll need to be done here
    setInputErrors(errors);
  }, [newName]);

  const change = async () => {
    const uuid = supabase.auth.user()?.id;
    if (uuid == null) {
      console.error("Attempting to update username for a missing user ID");
      return;
    }
    await updateUsername(supabase, uuid, newName);
    AppStore.update((store) => {
      store.username = newName;
    });
    setNewName("");
    toast({
      message: "Username updated",
      type: "is-info",
      position: "top-right",
      duration: 2500,
    });
  };

  return (
    <div className="spacing-top">
      <hr />
      <h3>Change username</h3>
      <div className="columns">
        <div className="column is-4">
          <div className="field">
            <div className="control">
              <input
                type="text"
                className="input"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link is-info"
                onClick={change}
                disabled={inputErrors.length !== 0}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="form-errors">
        {newName &&
          inputErrors.map((error, index) => (
            <p key={`error-${index}`} className="has-text-danger">
              {error}
            </p>
          ))}
      </div>
    </div>
  );
}

export function Profile() {
  const [currentUsername, setCurrentUsername] = useState("");
  const supabase = AppStore.useState((s) => s.supabase);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userUUID, setUserUUID] = useState(supabase.auth.user()?.id);

  React.useEffect(() => {
    (async function () {
      const uuid = supabase.auth.user()?.id;
      if (uuid == null) {
        console.error(
          "Attempting to load username on profile page for user who apparently isn't signed in"
        );
        return "";
      }
      const username = await loadUserName(supabase, uuid);
      setCurrentUsername(username);
    })();

    const sub = supabase
      .from(TABLE_NAME_USERNAME)
      .on("UPDATE", (payload) => {
        if (payload.new.userId === userUUID) {
          setCurrentUsername(payload.new.username);
        }
      })
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  });

  return (
    <div className="content">
      <p className="m-text">
        Your current username is <strong>{currentUsername}</strong>
      </p>
      <ChangeUsername />
    </div>
  );
}
