import {
  ALL_EVIDENCE,
  SECONDARY_OBJECTIVES,
  matchingGhosts,
} from "./gameData.mjs";

function colorMapping(kind) {
  if (kind === "found") {
    return "success";
  }
  if (kind === "unknown") {
    return "info";
  }
  return "danger";
}

const UPDATE_BASIC = "update-basic";
const UPDATE_EVIDENCE = "update-evidence";
const CLEAR_ROOM = "clear-room";

document.addEventListener("DOMContentLoaded", () => {
  Vue.createApp({
    data() {
      return {
        ghostName: "",
        objective2: "",
        objective3: "",
        objective4: "",
        evidence: [...ALL_EVIDENCE],
        allObjectives: [...SECONDARY_OBJECTIVES],
        roomId: Number(window.location.pathname.split("/")[2]),
        socketConnection: null,
        log: [], // TODO use log
      };
    },
    mounted() {
      // setup websocket
      const socket = new WebSocket(`ws://${window.location.host}/ws`);
      this.socketConnection = socket;
      socket.onmessage = ({ data: dataRaw }) => {
        const data = JSON.parse(dataRaw);
        if (data.room !== this.roomId) {
          return;
        }
        if (data.action === UPDATE_EVIDENCE) {
          const i = this.evidence.findIndex((e) => e.short === data.evidence);
          const newEvidence = [...this.evidence];
          newEvidence[i].value = data.newValue;
          this.evidence = newEvidence;
        } else if (data.action === CLEAR_ROOM) {
          window.location.reload();
        } else if (data.action === UPDATE_BASIC) {
          if (data.what === "ghostName") {
            this.ghostName = data.newValue;
          } else if (data.what.startsWith("objective")) {
            const index = data.what[9];
            if (index === "0") {
              this.objective2 = data.newValue;
            } else if (index === "1") {
              this.objective3 = data.newValue;
            } else if (index === "2") {
              this.objective4 = data.newValue;
            }
          }
        }
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
          this.objective2 = _.get(data, "objectives[0]", "");
          this.objective3 = _.get(data, "objectives[1]", "");
          this.objective4 = _.get(data, "objectives[2]", "");
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
          "is-outlined": !on,
          "is-selected": on,
          [color]: on,
        };
      },
      updateGhostName(event) {
        this.socketConnection.send(
          JSON.stringify({
            room: this.roomId,
            by: localStorage.getItem("name"),
            action: UPDATE_BASIC,
            what: "ghostName",
            newValue: event.target.value,
          })
        );
      },
      updateObjective(event) {
        const index = event.target.getAttribute("obj-id");
        const newValue = event.target.value;
        this.socketConnection.send(
          JSON.stringify({
            room: this.roomId,
            by: localStorage.getItem("name"),
            action: UPDATE_BASIC,
            what: `objective${index}`,
            newValue,
          })
        );
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
            action: UPDATE_EVIDENCE,
            evidence: ev.short,
            newValue,
          })
        );
      },
      resetRoom() {
        this.socketConnection.send(
          JSON.stringify({
            room: this.roomId,
            by: localStorage.getItem("name"),
            action: CLEAR_ROOM,
          })
        );
      },
    },
    computed: {
      possibleGhosts() {
        return matchingGhosts(this.evidence);
      },
    },
    compilerOptions: {
      delimiters: ["[[", "]]"],
    },
  }).mount("#room-controls");
});
