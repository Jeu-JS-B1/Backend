const { getCasesAtteignables, trouverChemin } = require('./pathfinding');

const COUT_PA = 3;

function executerTourIA(state, ennemi) {
    const actions = [];
    const joueur = state.combattants.find(c => c.equipe === 'joueur' && c.pv > 0);
    if (!joueur) return actions;

    // Étape 1 : si à portée, attaquer
    if (estAPortee(ennemi, joueur) && ennemi.pa >= COUT_PA) {
        actions.push(faireAttaque(state, ennemi, joueur));

        if (estAPortee(ennemi, joueur) && ennemi.pa >= COUT_PA && joueur.pv > 0) {
            actions.push(faireAttaque(state, ennemi, joueur));
        }
        return actions;
    }

    // Étape 2 : se rapprocher
    if (ennemi.pm > 0) {
        const obstacles = state.combattants
            .filter(c => c.pv > 0 && c.id !== ennemi.id)
            .map(c => ({ x: c.grilleX, y: c.grilleY }));

        const cases = getCasesAtteignables(
            ennemi.grilleX, ennemi.grilleY,
            ennemi.pm, state.gridSize, obstacles
        );

        const casesLibres = cases.filter(c =>
            !obstacles.some(o => o.x === c.x && o.y === c.y)
        );

        let meilleure = null;
        let meilleureDist = Infinity;
        for (const c of casesLibres) {
            const dist = Math.abs(c.x - joueur.grilleX) + Math.abs(c.y - joueur.grilleY);
            if (dist < meilleureDist) {
                meilleureDist = dist;
                meilleure = c;
            }
        }

        if (meilleure) {
            const chemin = trouverChemin(
                ennemi.grilleX, ennemi.grilleY,
                meilleure.x, meilleure.y,
                state.gridSize, obstacles
            );

            if (chemin && chemin.length >= 2) {
                ennemi.pm -= (chemin.length - 1);
                ennemi.grilleX = meilleure.x;
                ennemi.grilleY = meilleure.y;

                actions.push({
                    type: 'move',
                    combattantId: ennemi.id,
                    chemin: chemin,
                    pmRestants: ennemi.pm
                });

                if (estAPortee(ennemi, joueur) && ennemi.pa >= COUT_PA && joueur.pv > 0) {
                    actions.push(faireAttaque(state, ennemi, joueur));
                }
            }
        }
    }

    return actions;
}

function estAPortee(a, b) {
    return (Math.abs(a.grilleX - b.grilleX) + Math.abs(a.grilleY - b.grilleY)) <= a.porteeAttaque;
}

function faireAttaque(state, attaquant, cible) {
    attaquant.pa -= COUT_PA;
    cible.pv -= attaquant.degats;
    if (cible.pv < 0) cible.pv = 0;

    if (cible.pv <= 0) {
        const joueursVivants = state.combattants.filter(c => c.equipe === 'joueur' && c.pv > 0);
        if (joueursVivants.length === 0) {
            state.termine = true;
            state.vainqueur = 'ennemi';
        }
    }

    return {
        type: 'attack',
        combattantId: attaquant.id,
        cibleId: cible.id,
        degats: attaquant.degats,
        ciblePV: cible.pv,
        paRestants: attaquant.pa,
        mort: cible.pv <= 0,
        combatTermine: state.termine || false,
        vainqueur: state.vainqueur || null
    };
}

module.exports = { executerTourIA };
