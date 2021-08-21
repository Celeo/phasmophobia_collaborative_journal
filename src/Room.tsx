import { toast } from "bulma-toast";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getRoomInfo, RoomModel } from "./db";
import { AppStore } from "./store";

/*
 * If the user is not signed in, then they can only view the
 * status and history of this room's journal.
 *
 * If they are signed in, then they can participate by setting the
 * objectives, ghost name, evidence, etc.
 *
 *
 * When this page loads, it looks for an existing room. If found, then
 * the user is "put" into that room. If the room isn't found, then a
 * new one is created. If the user is not signed in, then if no room
 * is found, then they're told "no room found".
 */

interface RoomRouteParams {
  roomId: string;
}

export function Room() {
  const { roomId } = useParams<RoomRouteParams>();
  const [roomInfo, setRoomInfo] = useState<RoomModel | null>(null);
  const supabase = AppStore.useState((s) => s.supabase);
  const history = useHistory();

  useEffect(() => {
    (async function () {
      if (!roomId) {
        toast({
          message: "No room id specified",
          type: "is-warning",
          position: "top-right",
          duration: 2500,
        });
        history.push("/rooms");
        return;
      }

      const db = supabase;
      console.log(`Attempting to load room info for ${roomId}`);
      const data = await getRoomInfo(db, parseInt(roomId));
      console.log("Loaded data", data);
      setRoomInfo(data);
    })();
  }, [history, roomId, supabase]);

  useEffect(() => {
    const sub = supabase
      .from("rooms")
      .on("UPDATE", (payload) => {
        if (payload.new.inviteCode === parseInt(roomId)) {
          // TODO
        }
      })
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  });

  return (
    <div>
      <p className="m-text">
        Room "<span>{roomId}</span>"
        {roomInfo && (
          <div>
            <br />
            <p>{roomInfo?.id}</p>
          </div>
        )}
      </p>
    </div>
  );
}
