import { SupabaseRealtimePayload } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import {
  RoomModel,
  EvidenceModel,
  getRoomEvidence,
  TABLE_NAME_EVIDENCE,
} from "./db";
import { ALL_EVIDENCE } from "./gameData";
import { AppStore } from "./store";

export interface EvidenceControlsProps {
  roomInfo: RoomModel;
}

/*
 * FIXME something in this processing is causing me to get logged out.
 */

export function EvidenceControls(props: EvidenceControlsProps) {
  const supabase = AppStore.useState((s) => s.supabase);
  const [evidenceData, setEvidenceData] = useState<Array<EvidenceModel>>([]);

  const tableCallback = (payload: SupabaseRealtimePayload<EvidenceModel>) => {
    if (payload.new.roomId !== props.roomInfo.id) {
      return;
    }
    switch (payload.eventType) {
      case "UPDATE": {
        const index = evidenceData.findIndex(
          (e) => e.name === payload.new.name
        );
        const copy = [...evidenceData];
        copy[index] = payload.new;
        setEvidenceData(copy);
        break;
      }
      case "INSERT": {
        setEvidenceData([...evidenceData, payload.new]);
        break;
      }
      default: {
        console.error(`Unknown event type ${payload.eventType}`);
        break;
      }
    }
  };

  useEffect(() => {
    (async function () {
      console.log("Loading evidence from db");
      const rows = await getRoomEvidence(supabase, props.roomInfo.id);
      setEvidenceData(rows);
    })();
  }, [props.roomInfo.id, supabase]);

  useEffect(() => {
    const sub = supabase
      .from(TABLE_NAME_EVIDENCE)
      .on("*", (payload) => tableCallback(payload))
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  });

  const lookupEvidence = (name: string): string => {
    const match = evidenceData.find((e) => e.name === name);
    if (match) {
      return match.state;
    }
    return "Not set";
  };

  return (
    <>
      <h4>Evidence Controls, room #{props.roomInfo.id}</h4>
      <hr />
      <table className="has-text-primary">
        <thead></thead>
        <tbody>
          {ALL_EVIDENCE.map((evidence) => (
            <tr key={evidence.short}>
              <td>{evidence.long}</td>
              <td>{lookupEvidence(evidence.short)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
