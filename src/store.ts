import { Store } from "pullstate";
import { SupabaseClient } from "@supabase/supabase-js";
import { connectToSupabase } from "./db";

interface IAppStore {
  supabase: SupabaseClient;
  loggedIn: boolean;
  username: string | null;
}

export const AppStore = new Store<IAppStore>({
  supabase: connectToSupabase(),
  loggedIn: false,
  username: null,
});
