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
        ghostName: "",
        objectives: [],
        evidence: ALL_EVIDENCE.map((e) => {
          return { ...e, value: "unknown" };
        }),
        roomId: Number(window.location.pathname.split("/")[2]),
        socketConnection: null,
        log: [],
      };
    },
    async mounted() {
      // setup websocket
      const socket = new WebSocket(`ws://${window.location.host}/ws`);
      this.socketConnection = socket;
      socket.onmessage = ({ data: dataRaw }) => {
        const data = JSON.parse(dataRaw);
        console.log(typeof data);
        if (data.room !== this.roomId) {
          return;
        }
        const i = this.evidence.findIndex((e) => e.short === data.evidence);
        const newEvidence = [...this.evidence];
        newEvidence[i].value = data.newValue;
        this.evidence = newEvidence;
        this.log.push(data);
      };

      // get current room state
      fetch(`/rooms/${this.roomId}/data`)
        .then((response) => {
          if (!response.ok) {
            throw `Error response code from server: ${response.status}`;
          }
          return response.json();
        })
        .then((data) => {
          this.ghostName = _.get(data, "ghostName", "");
          this.objectives = _.get(data, "objectives", []);
          this.evidence = _.get(data, "evidence", this.evidence);
        })
        .catch((exception) => {
          console.error("Error getting initial data:", exception);
        });
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
            room: this.roomId,
            by: localStorage.getItem("name"),
            action: "update-evidence",
            evidence: ev.short,
            newValue,
          })
        );
      },
    },
  }).mount("#room-controls");
});
