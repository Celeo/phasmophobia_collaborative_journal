import { ALL_EVIDENCE } from "./gameData.mjs";

function colorMapping(kind) {
  if (kind === "found") {
    return "success";
  }
  if (kind === "unknown") {
    return "info";
  }
  return "danger";
}

document.addEventListener("DOMContentLoaded", () => {
  Vue.createApp({
    data() {
      return {
        evidence: ALL_EVIDENCE.map((e) => {
          return { ...e, value: "unknown" };
        }),
        socketConnection: null,
      };
    },
    async mounted() {
      const socket = new WebSocket(`ws://${window.location.host}/ws`);
      this.socketConnection = socket;
      socket.onmessage = (event) => {
        console.log("Received data from websocket:", event.data);
        // TODO
      };
      // TODO get initial state from server
    },
    methods: {
      classFor(ev, kind) {
        const color = "is-" + colorMapping(kind);
        const matchingEvidence = this.evidence.find(
          (e) => e.short === ev.short
        );
        const on = matchingEvidence.value === kind;
        return {
          "is-selected": on,
          [color]: on,
        };
      },
      updateEvidence(ev, newValue) {
        const i = this.evidence.findIndex((e) => e.short === ev.short);
        const newEvidence = [...this.evidence];
        newEvidence[i].value = newValue;
        this.evidence = newEvidence;
        this.socketConnection.send(
          JSON.stringify({
            room: Number(window.location.pathname.split("/")[2]),
            by: localStorage.getItem("name"),
            evidence: ev.short,
            newValue,
          })
        );
      },
    },
  }).mount("#room-controls");
});
