
const { expect } = require("chai");
const { starknet } = require("hardhat");
const { strToFeltArr, toUint256WithFelts, feltArrToStr } = require("./utils/utils.js")
require('dotenv').config();

describe("Test contract : Nft", () => {

    let NftContract, adminWallet, anonymeWallet

    before(async () => {
        // On récupère les comptes déployés sur le devnet par défaut
        // l'avantage c'est qu'ils disposent de token par défaut on pourra faire des transactions
        walletPredeploye = await starknet.devnet.getPredeployedAccounts()

        console.log('Information wallet 0', walletPredeploye[0])
        // On initialise notre wallet d'administrateur
        adminWallet = await starknet.getAccountFromAddress(
            walletPredeploye[0].address,
            walletPredeploye[0].private_key,
            "OpenZeppelin"
        );

        // on initialise un autre wallet
        anonymeWallet = await starknet.getAccountFromAddress(
            walletPredeploye[1].address,
            walletPredeploye[1].private_key,
            "OpenZeppelin"
        );

        /*
        Pour initialiser notre contract ERC721_Full nous avons besoin de :
        * un nom,
        * un symbol,
        * un propriétaire
        * une max supply
        * une URI
        */

        const PROJET_NOM = starknet.shortStringToBigInt(process.env.PROJET_NOM);
        const PROJET_SYMBOLE = starknet.shortStringToBigInt(process.env.PROJET_SYMBOLE);
        const PROJET_PROPRIETAIRE = BigInt(adminWallet.address);
        const initTokenURI = strToFeltArr('ipfs://test/');
        const NftContractFactory = await starknet.getContractFactory("Nft");
        NftContract = await NftContractFactory.deploy({
            name: PROJET_NOM,
            symbol: PROJET_SYMBOLE,
            owner: PROJET_PROPRIETAIRE,
            max_supply: toUint256WithFelts("2"),
            base_token_uri: initTokenURI
        });

        console.log("Déploiement de notre smart contract à l'adresse :", NftContract.address);
    })

    it("Mint le premier symbiote", async () => {
        const fee = await adminWallet.estimateFee(
            NftContract,
            "mint_symbiote",
            {

            }
        );
        await adminWallet.invoke(
            NftContract,
            "mint_symbiote",
            {

            },
            { maxFee: BigInt(fee.amount) * BigInt(2) }
        );
        console.log("NFT 0 Minted");
        const {owner} = await adminWallet.call(
            NftContract,
            "ownerOf",
            {
                tokenId: toUint256WithFelts("0")
            }
        )
        //on vérifie que le wallet admin est bien le propriétaire
        expect(owner).to.be.eq(BigInt(adminWallet.address))
    })

    it("Mint le deuxieme symbiote", async () => {
        const fee = await anonymeWallet.estimateFee(
            NftContract,
            "mint_symbiote",
            {

            }
        );
        await anonymeWallet.invoke(
            NftContract,
            "mint_symbiote",
            {

            },
            { maxFee: BigInt(fee.amount) * BigInt(2) }
        );
        console.log("NFT 1 Minted");
        const {owner} = await anonymeWallet.call(
            NftContract,
            "ownerOf",
            {
                tokenId: toUint256WithFelts("1")
            }
        )
        //on vérifie que le wallet anonyme est bien le propriétaire
        expect(owner).to.be.eq(BigInt(anonymeWallet.address))
    })

    it("Mint le troisième symbiote - Erreur", async () => {
        try {
            const fee = await anonymeWallet.estimateFee(
                NftContract,
                "mint_symbiote",
                {

                }
            );
            await anonymeWallet.invoke(
                NftContract,
                "mint_symbiote",
                {

                },
                { maxFee: BigInt(fee.amount) * BigInt(2) }
            );

        } catch(e) {
            console.log("NFT 2 Not Minted");
            //on vérifie que c'est bien la bonne erreur qui est levée
            expect(e.message).to.deep.contain('All symbiote minted');
        }

        const {balance} = await anonymeWallet.call(
            NftContract,
            "balanceOf",
            {
                owner: BigInt(anonymeWallet.address)
            }
        )

        // on vérifie que la balance du wallet est toujours de 1
        expect(balance.low).to.be.eq(1n)
    })

    it("Update base URI", async () => {
        const baseTokenURI = strToFeltArr(process.env.PROJET_URI);
        // console.log(baseTokenURI)
        const fee = await adminWallet.estimateFee(NftContract, "setBaseURI", {
            base_token_uri: baseTokenURI,
        });

        const testBaseUri = await adminWallet.invoke(
            NftContract,
            "setBaseURI",
            {
                base_token_uri: baseTokenURI,
            },
            { maxFee: BigInt(fee.amount) * BigInt(2) }
        );

        const { tokenURI } = await adminWallet.call(
            NftContract,
            "tokenURI",
            {
                tokenId: toUint256WithFelts("0")
            }
        )
        // on vérifie que notre mise à jour d'URI est bonne
        expect(feltArrToStr(tokenURI)).to.be.eq(process.env.PROJET_URI + '0')
    })
});