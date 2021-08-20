import { Store } from "pullstate";

interface IAppStore {
  loggedIn: boolean;
  username: string | null;
}

export const AppStore = new Store<IAppStore>({
  loggedIn: false,
  username: null,
});
