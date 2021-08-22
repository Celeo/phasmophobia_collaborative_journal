import { toast } from "bulma-toast";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { createRoom, getRoomInfo, RoomModel, TABLE_NAME_ROOM } from "./db";
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

      const roomIdNum = Number(roomId);
      if (isNaN(roomIdNum)) {
        toast({
          message: "Invalid room id specified",
          type: "is-danger",
          position: "top-right",
          duration: 2500,
        });
        history.push("/rooms");
        return;
      }

      const db = supabase;
      console.log(`Attempting to load room info for ${roomId}`);
      let data = await getRoomInfo(db, roomIdNum);
      if (!data) {
        await createRoom(db, roomIdNum);
        data = await getRoomInfo(db, roomIdNum);
      }
      setRoomInfo(data);
    })();
  }, [history, roomId, supabase]);

  useEffect(() => {
    const sub = supabase
      .from(TABLE_NAME_ROOM)
      .on("UPDATE", (payload) => {
        if (payload.new.inviteCode === parseInt(roomId)) {
          console.log("Got table update");
          setRoomInfo(payload.new);
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
        Room "<span>{roomId}</span>"
      </p>
      {roomInfo && (
        <div>
          <br />
          <p className="m-text">{roomInfo?.id}</p>
        </div>
      )}
    </div>
  );
}
