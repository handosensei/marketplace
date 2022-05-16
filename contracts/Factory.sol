// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "./ERC721Token.sol";

contract Factory {

    event CollectionCreated(address contractAddress, address owner);

    struct Collection {
        address contractAddress;
        address owner;
        ERC721Token token;
    }
    Collection[] private collections;
     
    function deploy(string memory _name, string memory _symbol) external payable {
        bytes32 _salt = keccak256(abi.encodePacked(_name));
        ERC721Token token = new ERC721Token{salt: _salt}(_name, _symbol);
        address contractAddress = address(token);
        collections.push(Collection(contractAddress, msg.sender, token));

        emit CollectionCreated(contractAddress, msg.sender);
    }
}
