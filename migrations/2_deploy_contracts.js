// migrations/2_deploy_contracts.js
const BloodDonation = artifacts.require("BloodDonation");

module.exports = function(deployer) {
  deployer.deploy(BloodDonation);
};