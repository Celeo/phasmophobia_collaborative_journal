export interface EvidenceDescription {
  short: string;
  long: string;
}

export const ALL_EVIDENCE: Array<EvidenceDescription> = [
  { short: "box", long: "Spirit Box" },
  { short: "fingerprints", long: "Fingerprints" },
  { short: "writing", long: "Book writing" },
  { short: "orbs", long: "Ghost Orbs" },
  { short: "emf", long: "EMF 5" },
  { short: "freezing", long: "Freezing" },
];

export interface GhostEvidence {
  box: boolean;
  fingerprints: boolean;
  writing: boolean;
  orbs: boolean;
  emf: boolean;
  freezing: boolean;
}

export interface Ghost {
  name: string;
  description: string;
  evidence: GhostEvidence;
}

export const GHOSTS: Array<Ghost> = [
  {
    name: "Spirit",
    description:
      "Smudge Sticks will prevent it from attacking for a long time.",
    evidence: {
      box: true,
      fingerprints: true,
      writing: true,
      orbs: false,
      emf: false,
      freezing: false,
    },
  },
  {
    name: "Wraith",
    description:
      "Can fly, including through walls/lockers/doors. Rarely touches the ground. Have a toxic reaction to salt.",
    evidence: {
      box: true,
      fingerprints: true,
      writing: false,
      orbs: false,
      emf: false,
      freezing: true,
    },
  },
  {
    name: "Phantom",
    description:
      "Looking at it will cause large sanity loss. Taking a photo of it will cause it to temporarily disappear.",
    evidence: {
      box: false,
      fingerprints: false,
      writing: false,
      orbs: true,
      emf: true,
      freezing: true,
    },
  },
  {
    name: "Poltergeist",
    description: "Interacts with many items at a time.",
    evidence: {
      box: true,
      fingerprints: true,
      writing: false,
      orbs: true,
      emf: false,
      freezing: false,
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
      orbs: false,
      emf: true,
      freezing: true,
    },
  },
  {
    name: "Jinn",
    description:
      "Territorial & fast. Faster when target is far away, except when the location's power supply is off.",
    evidence: {
      box: true,
      fingerprints: false,
      writing: false,
      orbs: true,
      emf: true,
      freezing: false,
    },
  },
  {
    name: "Mare",
    description: "Has an increased chance to attack in the dark.",
    evidence: {
      box: true,
      fingerprints: false,
      writing: false,
      orbs: true,
      emf: false,
      freezing: true,
    },
  },
  {
    name: "Revenant",
    description:
      "Slow, but very fast when hunting. Slows greatly when being hid from.",
    evidence: {
      box: false,
      fingerprints: true,
      writing: true,
      orbs: false,
      emf: true,
      freezing: false,
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
      orbs: true,
      emf: true,
      freezing: false,
    },
  },
  {
    name: "Demon",
    description:
      "Aggressive, and attack more often than other ghosts. Asking a successful question via Ouija board will not lower sanity.",
    evidence: {
      box: true,
      fingerprints: false,
      writing: true,
      orbs: false,
      emf: false,
      freezing: true,
    },
  },
  {
    name: "Yurei",
    description:
      "Drains peoples' sanity faster than other ghosts. Smudging its room prevents roaming for a long time.",
    evidence: {
      box: false,
      fingerprints: false,
      writing: true,
      orbs: true,
      emf: false,
      freezing: true,
    },
  },
  {
    name: "Oni",
    description:
      "More active when around multiple people. Can rapidly move items.",
    evidence: {
      box: true,
      fingerprints: false,
      writing: true,
      orbs: false,
      emf: true,
      freezing: false,
    },
  },
];

export const ghostMatches = (
  ghost: Ghost,
  evidence: Array<string>
): boolean => {
  for (const e of evidence) {
    switch (e) {
      case "box": {
        if (!ghost.evidence.box) {
          return false;
        }
        break;
      }
      case "fingerprints": {
        if (!ghost.evidence.fingerprints) {
          return false;
        }
        break;
      }
      case "writing": {
        if (!ghost.evidence.writing) {
          return false;
        }
        break;
      }
      case "orbs": {
        if (!ghost.evidence.orbs) {
          return false;
        }
        break;
      }
      case "emf": {
        if (!ghost.evidence.emf) {
          return false;
        }
        break;
      }
      case "freezing": {
        if (!ghost.evidence.freezing) {
          return false;
        }
        break;
      }
    }
  }
  return true;
};
