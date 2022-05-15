var ERC721Factory = artifacts.require("./ERC721Factory.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC721Factory);
};
