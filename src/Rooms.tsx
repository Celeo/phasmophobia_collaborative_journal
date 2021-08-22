import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ROOM_CODE_MIN = 100_000;
const ROOM_CODE_MAX = 999_999;

export function Rooms() {
  const history = useHistory();
  const [roomCode, setRoomCode] = useState(0);
  const [validRoom, setValidRoom] = useState(false);

  const doSetRoomCode = (s: string) => {
    if (s) {
      setRoomCode(parseInt(s));
    }
  };

  useEffect(() => {
    let valid = true;
    if (roomCode < ROOM_CODE_MIN) {
      valid = false;
    }
    if (roomCode > ROOM_CODE_MAX) {
      valid = false;
    }
    setValidRoom(valid);
  }, [roomCode]);

  const submit = () => {
    history.push(`/room/${roomCode}`);
  };

  return (
    <div className="content">
      <h2>Enter the invite code</h2>
      <div className="columns">
        <div className="column is-4">
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="number"
                placeholder="Room code"
                min={ROOM_CODE_MIN}
                max={ROOM_CODE_MAX}
                value={roomCode}
                onChange={(e) => doSetRoomCode(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link is-primary"
                onClick={submit}
                disabled={!validRoom}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
