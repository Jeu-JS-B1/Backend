class CombatState {
    constructor(player, ennemis, gridSize) {
        this.gridSize = gridSize;
        this.combattants = [player, ...ennemis];
        this.indexTour = 0;
        this.termine = false;
        this.vainqueur = null;
    }
}

module.exports = { CombatState };
