require("@nomiclabs/hardhat-waffle");

const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();
//Move to a .ENV later
// const projectId = "1147d6f66b4d422e928010748b7f8f6c";

module.exports = {
  //Network configurations
  networks: {
    //local
    // hardhat: {
    //   chainId: 1337,
    // },
    //polygon mumbai
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/eOTbogfhcv54R1mVigmdzOBHG86jyh1P",
      accounts: [privateKey],
    },
    //polygon mainnet
    mainnet: {
      url: "https://polygon-mainnet.infura.io/v3/1147d6f66b4d422e928010748b7f8f6c",
      accounts: [privateKey],
    },
  },
  solidity: "0.8.4",
};