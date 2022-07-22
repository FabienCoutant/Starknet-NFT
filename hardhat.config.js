
require("@shardlabs/starknet-hardhat-plugin");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  starknet: {
    dockerizedVersion: "0.9.0",
    network: "devnet",
    // nos wallets de test
    wallets: {
      adminWallet: {
        accountName: "OpenZeppelin",
        modulePath: "starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount",
        accountPath: "~/.starknet_accounts"
      },
      anonWallet: {
        accountName: "OpenZeppelin",
        modulePath: "starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount",
        accountPath: "~/.starknet_accounts"
      }
    }
  },
  paths: {
    // Par défaut = "contracts".
    starknetSources: "contracts",

    // Par défaut ="starknet-artifacts".
    starknetArtifacts: "starknet-artifacts",

    // Les répertoires qui contiennent des librairies externes à votre projet.
    cairoPaths: []
  },
  networks: {
    devnet: {
      url: "http://127.0.0.1:5050"
    }
  },
  mocha: {
    timeout: 1000000
  }
};