import { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "bulma-toast";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { RoomModel } from "./models";

interface UsernameQuery {
  username: string;
}

export async function loadUserName(
  db: SupabaseClient,
  uuid: string
): Promise<string> {
  const { data, error } = await db
    .from("usernames")
    .select("username")
    .eq("userId", uuid);

  if (error) {
    console.error("Error loading username from DB:", error);
    toast({
      message: "Error loading username from database",
      type: "is-danger",
      position: "top-right",
      duration: 5000,
    });
    return "-- error --";
  }

  if (data == null || data.length === 0) {
    const newName = createRandomName();
    await insertNewUsername(db, uuid, newName);
    return newName;
  }
  return (data as Array<UsernameQuery>)[0].username;
}

async function insertNewUsername(
  db: SupabaseClient,
  uuid: string,
  name: string
): Promise<void> {
  const { error } = await db
    .from("usernames")
    .insert([{ userId: uuid, username: name }]);

  if (error) {
    toast({
      message: "Error saving generated name to the database",
      type: "is-danger",
      position: "top-right",
      duration: 5000,
    });
  }
}

export async function updateUsername(
  db: SupabaseClient,
  uuid: string,
  name: string
): Promise<void> {
  const { error } = await db
    .from("usernames")
    .update({ username: name })
    .eq("userId", uuid);

  if (error) {
    toast({
      message: "Error saving new name to the database",
      type: "is-danger",
      position: "top-right",
      duration: 5000,
    });
  }
}

function createRandomName(): string {
  return uniqueNamesGenerator({
    separator: "-",
    length: 2,
    dictionaries: [adjectives, colors, animals],
  });
}

export async function getRoomInfo(
  db: SupabaseClient,
  inviteCode: number
): Promise<RoomModel | null> {
  let { data, error } = await db
    .from("room")
    .select("*")
    .eq("inviteCode", inviteCode);

  if (error) {
    toast({
      message: "Error getting room data",
      type: "is-danger",
      position: "top-right",
      duration: 5000,
    });
    return null;
  }

  if (data == null || data.length === 0) {
    return null;
  }

  return data[0];
}

export async function createRoom(
  db: SupabaseClient,
  inviteCode: number
): Promise<void> {
  const { error } = await db.from("rooms").insert([{ inviteCode }]);

  if (error) {
    toast({
      message: "Error creating new room",
      type: "is-danger",
      position: "top-right",
      duration: 5000,
    });
  }
}

export async function updateRoom(
  db: SupabaseClient,
  id: number,
  updates: Record<string, any>
): Promise<void> {
  // TODO
}
