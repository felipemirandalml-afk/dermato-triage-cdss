import { rankDifferentials } from '../engine/differential_ranker.js';

const mockHelper = (features) => ({
    has: (f) => !!features[f],
    get: (f) => features[f] || 0
});

function test() {
    console.log('--- TEST: ECZEMA (Prurito, Eritema, Escama, Crónico) ---');
    const eczemaHelper = mockHelper({ prurito: 1, eritema: 1, escama: 1, cronico: 1 });
    const eczemaRes = rankDifferentials('eczema_dermatitis', eczemaHelper);
    console.log(JSON.stringify(eczemaRes, null, 2));

    console.log('\n--- TEST: VIRAL (Herpes Zoster: Vesícula, Dolor, Dermatomal) ---');
    const viralHelper = mockHelper({ vesicula: 1, dolor: 1, dermatomal: 1, agudo: 1 });
    const viralRes = rankDifferentials('viral_skin_infection', viralHelper);
    console.log(JSON.stringify(viralRes, null, 2));
    
    console.log('\n--- TEST: TUMOR (SCC: Nódulo, Úlcera, Costra, Crónico) ---');
    const tumorHelper = mockHelper({ nodulo: 1, ulcera: 1, costra: 1, cronico: 1 });
    const tumorRes = rankDifferentials('cutaneous_tumor_suspected', tumorHelper);
    console.log(JSON.stringify(tumorRes, null, 2));

    console.log('\n--- TEST: FUNGAL (Tinea: Placa anular, Escama, Localizado) ---');
    const fungalHelper = mockHelper({ placa: 1, escama: 1, localizado: 1, cronico: 1 });
    const fungalRes = rankDifferentials('fungal_skin_infection', fungalHelper);
    console.log(JSON.stringify(fungalRes, null, 2));
}

test();
