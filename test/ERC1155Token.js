const ERC1155Token = artifacts.require("./ERC1155Token.sol");
const { BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract("ERC1155Token", accounts => {
    const owner = accounts[0];
    let ERC1155TokenInstance;

    describe("Test ERC1155Token smart contract to marketplace project", function () {
    
        beforeEach(async () => {
            ERC1155TokenInstance = await ERC1155Token.new({from:owner}); 
        });
        
    });
});
