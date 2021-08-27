const fromStorage = localStorage.getItem("name");
if (fromStorage === null || fromStorage.length === 0) {
  const randomName = window.chance.first();
  localStorage.setItem("pickedRandom", true);
  localStorage.setItem("name", randomName);
}
