
const { expect } = require("chai");
const { starknet } = require("hardhat");

describe("Test contract : Compteur", () => {

    let CompteurContract

    before(async () => {
        // on récupère notre contrat
        const contractCompteurFactory = await starknet.getContractFactory("Compteur");
        /*
        La méthode getContractAt vous permettra de communiquer avec un contrat déjà déployé.
        CompteurContract = await contractCompteurFactory.getContractAt('0x0363d2c6efb8a98cf73310c0f8e6780d47dc0a62000f4072d6999910e6e49267');
        */
        // on le déploie en initialisant le compteur
        CompteurContract = await contractCompteurFactory.deploy({ compteur_initial: 1 });
    })

    it("Récupérer le compteur courant.", async function () {
        // on appelle le contrat directement (call pour les @view )
        const {res} = await CompteurContract.call("recuperer_compteur", {});
        expect(res).to.be.eq(1n)
    });

    it("Incrémenter le compteur courant.", async function () {
        // ici on invoke une function (@invoke pour les @external)
        const {res} = await CompteurContract.invoke("incrementer_compteur", {montant: 10});
    });

    it("Récupérer le compteur courant.", async function () {
        const {res} = await CompteurContract.call("recuperer_compteur", {});
        expect(res).to.be.eq(11n)
    });

});