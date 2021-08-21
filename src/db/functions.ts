import { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "bulma-toast";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

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
