import React from "react";
import { useParams } from "react-router-dom";

/*
 * If the user is not signed in, then they can only view the
 * status and history of this room's journal.
 *
 * If they are signed in, then they can participate by setting the
 * objectives, ghost name, evidence, etc.
 */

export function Room() {
  const { roomId } = useParams<Record<string, string | undefined>>();

  return (
    <div>
      <p className="m-text">
        Room "<span>{roomId}</span>"
      </p>
    </div>
  );
}
