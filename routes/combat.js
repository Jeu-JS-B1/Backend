const express = require('express');
const router = express.Router();
const { CombatState } = require('../game/combatState');
const { executerAction } = require('../game/combatLogic');
const { getCasesAtteignables } = require('../game/pathfinding');

const combatsEnCours = {};

// POST /api/combat/start
router.post('/start', (req, res) => {
    const { playerId } = req.body;

    const joueur = {
        id: 0, nom: 'Joueur', equipe: 'joueur',
        grilleX: 2, grilleY: 2,
        pv: 100, pvMax: 100,
        pa: 6, paMax: 6,
        pm: 3, pmMax: 3,
        degats: 15, porteeAttaque: 3
    };

    const ennemi = {
        id: 1, nom: 'Gobelin', equipe: 'ennemi',
        grilleX: 7, grilleY: 7,
        pv: 50, pvMax: 50,
        pa: 6, paMax: 6,
        pm: 3, pmMax: 3,
        degats: 10, porteeAttaque: 1
    };

    const state = new CombatState(joueur, [ennemi], 10);
    const combatId = `combat_${Date.now()}`;
    combatsEnCours[combatId] = state;

    const obstacles = state.combattants
        .filter(c => c.pv > 0 && c.id !== joueur.id)
        .map(c => ({ x: c.grilleX, y: c.grilleY }));

    const casesAtteignables = getCasesAtteignables(
        joueur.grilleX, joueur.grilleY,
        joueur.pm, state.gridSize, obstacles
    );

    res.json({
        combatId,
        combattants: state.combattants,
        tourDe: 'joueur',
        casesAtteignables
    });
});

// POST /api/combat/action
router.post('/action', (req, res) => {
    const { combatId, action } = req.body;
    const state = combatsEnCours[combatId];

    if (!state) {
        return res.status(404).json({ error: 'Combat non trouvé' });
    }

    if (state.termine) {
        return res.status(400).json({ error: 'Combat terminé' });
    }

    const resultat = executerAction(state, action);

    if (resultat.error) {
        return res.status(400).json(resultat);
    }

    // Ajouter les cases atteignables si c'est encore le tour du joueur
    const combattantActuel = state.combattants[state.indexTour];
    if (combattantActuel.equipe === 'joueur' && !state.termine) {
        const obstacles = state.combattants
            .filter(c => c.pv > 0)
            .map(c => ({ x: c.grilleX, y: c.grilleY }));

        resultat.casesAtteignables = getCasesAtteignables(
            combattantActuel.grilleX, combattantActuel.grilleY,
            combattantActuel.pm, state.gridSize, obstacles
        );
        resultat.statsJoueur = {
            pv: combattantActuel.pv,
            pvMax: combattantActuel.pvMax,
            pa: combattantActuel.pa,
            paMax: combattantActuel.paMax,
            pm: combattantActuel.pm,
            pmMax: combattantActuel.pmMax
        };
    }

    if (state.termine) {
        delete combatsEnCours[combatId];
    }

    res.json(resultat);
});

// GET /api/combat/state (debug)
router.get('/state', (req, res) => {
    const { combatId } = req.query;
    const state = combatsEnCours[combatId];

    if (!state) {
        return res.status(404).json({ error: 'Combat non trouvé' });
    }

    res.json({
        combattants: state.combattants,
        indexTour: state.indexTour,
        termine: state.termine,
        vainqueur: state.vainqueur
    });
});

module.exports = router;
