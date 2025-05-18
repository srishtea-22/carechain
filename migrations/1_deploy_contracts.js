const CareChain = artifacts.require("CareChain");

module.exports = function (deployer) {
  deployer.deploy(CareChain);
};
