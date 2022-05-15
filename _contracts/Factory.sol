// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "./ERC721Token.sol";

contract ERC721Factory {

    event CollectionCreated(
        string name, 
        string artistName, 
        ERC721Token contractToken, 
        string description, 
        address createdBy, 
        address contractAddress
    );

    struct Collection {
        string artistName;
        ERC721Token contractToken;
        string description;
        uint128 royalties;
        address createdBy;
    }

    mapping(address => Collection) collections;
    
    uint public collectionCount = 0;     

    function deployCollection(string memory _name, string memory _symbole, string memory _artistName, string memory _description, string memory _uri, uint256 _supplyMax, uint128 _royalties)  public {
        require(bytes(_name).length > 0);
        
        collectionCount++;
        ERC721Token contractToken = new ERC721Token(_name, _symbole);
        contractToken.setSupplyMax(_supplyMax);
        contractToken.setBaseURI(_uri);

        address addressContract = address(contractToken);
        
        collections[addressContract].artistName = _artistName;
        collections[addressContract].contractToken = contractToken;
        collections[addressContract].description = _description;
        collections[addressContract].royalties = _royalties;
        collections[addressContract].createdBy = msg.sender;
   
        emit CollectionCreated(_name, _artistName, contractToken, _description, msg.sender, addressContract);
    }

    function getCollection(address _addr) external view returns(Collection memory) {
        return collections[_addr];
    }
}
