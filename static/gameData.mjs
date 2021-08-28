// NOTE: This data needs to be the same as in store.py
export const ALL_EVIDENCE = [
  { short: "emf", long: "EMF 5", value: "unknown" },
  { short: "fingerprints", long: "Fingerprints", value: "unknown" },
  { short: "freezing", long: "Freezing", value: "unknown" },
  { short: "orbs", long: "Ghost Orbs", value: "unknown" },
  { short: "writing", long: "Book writing", value: "unknown" },
  { short: "box", long: "Spirit Box", value: "unknown" },
  { short: "dots", long: "D.O.T.S Projector", value: "unknown" },
];

export const GHOSTS = [
  {
    name: "Spirit",
    description:
      "Smudge Sticks will prevent it from attacking for a long time.",
    evidence: {
      box: true,
      fingerprints: false,
      writing: true,
      orbs: false,
      emf: true,
      freezing: false,
      dots: false,
    },
  },
  {
    name: "Wraith",
    description:
      "Usually flies, including through walls/lockers/doors. Toxic reaction to salt.",
    evidence: {
      box: true,
      fingerprints: false,
      writing: false,
      orbs: false,
      emf: true,
      freezing: false,
      dots: true,
    },
  },
  {
    name: "Phantom",
    description:
      "Looking at it will cause large sanity loss. Taking a photo of it will cause it to temporarily disappear.",
    evidence: {
      box: true,
      fingerprints: true,
      writing: false,
      orbs: false,
      emf: false,
      freezing: false,
      dots: true,
    },
  },
  {
    name: "Poltergeist",
    description: "Interacts with many items at a time.",
    evidence: {
      box: true,
      fingerprints: true,
      writing: true,
      orbs: false,
      emf: false,
      freezing: false,
      dots: false,
    },
  },
  {
    name: "Banshee",
    description:
      "Targets a single person at a time. Will be less aggressive near Crucifixes.",
    evidence: {
      box: false,
      fingerprints: true,
      writing: false,
      orbs: true,
      emf: false,
      freezing: false,
      dots: true,
    },
  },
  {
    name: "Jinn",
    description:
      "Territorial & fast. Faster when target is far away and power supply is on.",
    evidence: {
      box: false,
      fingerprints: true,
      writing: false,
      orbs: false,
      emf: true,
      freezing: true,
      dots: false,
    },
  },
  {
    name: "Mare",
    description: "Increased chance to attack in the dark.",
    evidence: {
      box: true,
      fingerprints: false,
      writing: true,
      orbs: true,
      emf: false,
      freezing: false,
      dots: false,
    },
  },
  {
    name: "Revenant",
    description: "Very fast when hunting; slows greatly when being hid from.",
    evidence: {
      box: false,
      fingerprints: false,
      writing: true,
      orbs: true,
      emf: false,
      freezing: true,
      dots: false,
    },
  },
  {
    name: "Shade",
    description:
      "Very shy. Will not start a hunt when multiple people are nearby.",
    evidence: {
      box: false,
      fingerprints: false,
      writing: true,
      orbs: false,
      emf: true,
      freezing: true,
      dots: false,
    },
  },
  {
    name: "Demon",
    description:
      "Aggressive, and attacks more often. Asking a successful question via Ouija board will not lower sanity.",
    evidence: {
      box: false,
      fingerprints: true,
      writing: true,
      orbs: false,
      emf: false,
      freezing: true,
      dots: false,
    },
  },
  {
    name: "Yurei",
    description:
      "Drains sanity faster than other ghosts. Smudging its room prevents roaming for a long time.",
    evidence: {
      box: false,
      fingerprints: false,
      writing: false,
      orbs: true,
      emf: false,
      freezing: true,
      dots: true,
    },
  },
  {
    name: "Oni",
    description:
      "More active when around multiple people. Can rapidly move items.",
    evidence: {
      box: false,
      fingerprints: false,
      writing: false,
      orbs: true,
      emf: false,
      freezing: true,
      dots: true,
    },
  },
  {
    name: "Yokai",
    description: "Attracted to and angered by talking.",
    evidence: {
      box: true,
      fingerprints: false,
      writing: false,
      orbs: true,
      emf: false,
      freezing: false,
      dots: true,
    },
  },
  {
    name: "Hantu",
    description: "Moves faster in cold areas and slower in warn areas.",
    evidence: {
      box: false,
      fingerprints: true,
      writing: false,
      orbs: true,
      emf: false,
      freezing: true,
      dots: false,
    },
  },
  {
    name: "Myling",
    description: "Quieter when hunting but makes more paranormal sounds.",
    evidence: {
      box: false,
      fingerprints: true,
      writing: true,
      orbs: false,
      emf: true,
      freezing: false,
      dots: false,
    },
  },
  {
    name: "Goryo",
    description: "Only shows itself on camera when alone, doesn't really roam.",
    evidence: {
      box: false,
      fingerprints: true,
      writing: false,
      orbs: false,
      emf: true,
      freezing: false,
      dots: true,
    },
  },
];

export const SECONDARY_OBJECTIVES = [
  "Have a member of your team witness a Ghost Event",
  "Capture a photo of the Ghost",
  "Find evidence of the paranormal with an EMF Reader",
  "Detect a Ghosts presence with a Motion Sensor",
  "Cleanse the area near the Ghost using Smudge Sticks",
  "Prevent the Ghost from hunting with a Crucifix",
  "Get a Ghost to walk through Salt",
  "Detect a Ghost presence with a Candle",
  "Escape the Ghost during a Hunt with no deaths",
  "Use Smudge Sticks while the Ghost is hunting a player",
  "Get an average Sanity below 25%",
];

export function matchingGhosts(collectedEvidence) {
  const matching = [];
  for (let ghost of GHOSTS) {
    let m = true;
    for (let name of Object.keys(ghost.evidence)) {
      if (
        collectedEvidence.find((e) => e.short === name).value === "ignored" &&
        ghost.evidence[name]
      ) {
        m = false;
        break;
      }
    }
    if (m) {
      matching.push(ghost);
    }
  }
  return matching;
}
