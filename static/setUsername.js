const fromStorage = localStorage.getItem("name");
if (fromStorage === null || fromStorage.length === 0) {
  localStorage.setItem("pickedRandom", true);
  localStorage.setItem("name", window.chance.first());
}
