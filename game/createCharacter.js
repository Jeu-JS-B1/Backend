const RACES = [
    {
        id: 1,
        name: "Humalosk",
        bonus: { hp: 10, str: 1, int: 1 }
    },
    {
        id: 2,
        name: "Elfique",
        bonus: { mp: 20, int: 2, agi: 1 }
    },
    {
        id: 3,
        name: "Nainborg",
        bonus: { hp: 30, str: 2, luck: 1 }
    },
    {
        id: 4,
        name: "Orkami",
        bonus: { hp: 20, str: 3 }
    },
    {
        id: 5,
        name: "Félidane",
        bonus: { agi: 3, luck: 2 }
    }
];

const CLASSES = [
    {
        id: 1,
        name: "Flamarion",
        description: "Maître des flammes, inflige de lourds dégâts de zone",
        baseStats: { hp: 80, mp: 120, str: 5, int: 14, agi: 6, luck: 5 }
    },
    {
        id: 2,
        name: "Ombrelin",
        description: "Assassin furtif, frappe vite et disparaît",
        baseStats: { hp: 90, mp: 80, str: 10, int: 6, agi: 14, luck: 8 }
    },
    {
        id: 3,
        name: "Gardior",
        description: "Tank inébranlable, protège ses alliés",
        baseStats: { hp: 150, mp: 60, str: 12, int: 4, agi: 4, luck: 6 }
    },
    {
        id: 4,
        name: "Verdantis",
        description: "Soigneur naturel, manipule la flore",
        baseStats: { hp: 100, mp: 110, str: 4, int: 12, agi: 6, luck: 8 }
    },
    {
        id: 5,
        name: "Fulgurak",
        description: "Mage de foudre, contrôle et dégâts à distance",
        baseStats: { hp: 85, mp: 130, str: 4, int: 15, agi: 8, luck: 5 }
    },
    {
        id: 6,
        name: "Bersrak",
        description: "Guerrier enragé, plus il souffre plus il frappe",
        baseStats: { hp: 120, mp: 40, str: 15, int: 3, agi: 8, luck: 7 }
    }
];

/* pour les sprites
const APPEARANCES = {
  skinColors: ["#f5d0a9", "#c68642", "#8d5524", "#e0ac69", "#f1c27d"],
  hairColors: ["#2c1b0e", "#b55239", "#f2e2a0", "#c0c0c0", "#4a90d9", "#7b2d8b"],
  hairStyles: ["Court", "Long", "Crête", "Tresses", "Chauve", "Queue de cheval"]
};
*/

class CharacterCreator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 0;
        this.steps = ["race", "class", "appearance", "name", "summary"];
    }
}
