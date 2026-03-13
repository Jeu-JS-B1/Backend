const { getCasesAtteignables, trouverChemin } = require('./pathfinding');

const COUT_PA_ATTAQUE = 3;

function executerAction(combatState, action) {
    const combattant = combatState.combattants[combatState.indexTour];

    switch (action.type) {
        case 'move':
            return executerDeplacement(combatState, combattant, action);
        case 'attack':
            return executerAttaque(combatState, combattant, action);
        case 'end-turn':
            return executerFinTour(combatState);
        default:
            return { error: 'Action inconnue' };
    }
}

function executerDeplacement(state, combattant, action) {
    const obstacles = state.combattants
        .filter(c => c.pv > 0)
        .map(c => ({ x: c.grilleX, y: c.grilleY }));

    const atteignables = getCasesAtteignables(
        combattant.grilleX, combattant.grilleY,
        combattant.pm, state.gridSize, obstacles
    );
    const caseValide = atteignables.find(c => c.x === action.x && c.y === action.y);
    if (!caseValide) {
        return { error: 'Case non atteignable' };
    }

    const chemin = trouverChemin(
        combattant.grilleX, combattant.grilleY,
        action.x, action.y, state.gridSize, obstacles
    );
    if (!chemin) {
        return { error: 'Pas de chemin' };
    }

    const coutPM = chemin.length - 1;
    combattant.pm -= coutPM;
    combattant.grilleX = action.x;
    combattant.grilleY = action.y;

    return {
        type: 'move',
        chemin: chemin,
        pmRestants: combattant.pm
    };
}

function executerAttaque(state, combattant, action) {
    const cible = state.combattants.find(c => c.id === action.cibleId);

    if (!cible || cible.pv <= 0) {
        return { error: 'Cible invalide' };
    }

    if (combattant.pa < COUT_PA_ATTAQUE) {
        return { error: 'Pas assez de PA' };
    }

    const distance = Math.abs(combattant.grilleX - cible.grilleX)
                   + Math.abs(combattant.grilleY - cible.grilleY);
    if (distance > combattant.porteeAttaque) {
        return { error: 'Hors de portée' };
    }

    combattant.pa -= COUT_PA_ATTAQUE;
    cible.pv -= combattant.degats;
    if (cible.pv < 0) cible.pv = 0;

    const mort = cible.pv <= 0;

    const ennemisVivants = state.combattants.filter(c => c.equipe === 'ennemi' && c.pv > 0);
    const joueurVivant = state.combattants.find(c => c.equipe === 'joueur' && c.pv > 0);

    if (ennemisVivants.length === 0) {
        state.termine = true;
        state.vainqueur = 'joueur';
    } else if (!joueurVivant) {
        state.termine = true;
        state.vainqueur = 'ennemi';
    }

    return {
        type: 'attack',
        attaquantId: combattant.id,
        cibleId: cible.id,
        degats: combattant.degats,
        ciblePV: cible.pv,
        paRestants: combattant.pa,
        mort: mort,
        combatTermine: state.termine,
        vainqueur: state.vainqueur
    };
}

function executerFinTour(state) {
    do {
        state.indexTour = (state.indexTour + 1) % state.combattants.length;
    } while (state.combattants[state.indexTour].pv <= 0);

    const prochain = state.combattants[state.indexTour];
    prochain.pa = prochain.paMax;
    prochain.pm = prochain.pmMax;

    if (prochain.equipe === 'ennemi') {
        const actionsIA = require('./enemyAi').executerTourIA(state, prochain);

        if (!state.termine) {
            // Revenir au tour du joueur
            do {
                state.indexTour = (state.indexTour + 1) % state.combattants.length;
            } while (state.combattants[state.indexTour].pv <= 0);

            const joueur = state.combattants[state.indexTour];
            joueur.pa = joueur.paMax;
            joueur.pm = joueur.pmMax;
        }

        return {
            type: 'end-turn',
            actionsEnnemi: actionsIA,
            tourDe: getTourDe(state),
            combatTermine: state.termine,
            vainqueur: state.vainqueur
        };
    }

    return {
        type: 'end-turn',
        actionsEnnemi: [],
        tourDe: getTourDe(state),
        combatTermine: state.termine,
        vainqueur: state.vainqueur
    };
}

function getTourDe(state) {
    return state.combattants[state.indexTour].equipe;
}

module.exports = { executerAction };
