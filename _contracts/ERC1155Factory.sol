// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "./ERC721Token.sol";

contract ERC721Factory {

    event CollectionCreated(address contractAddress, address owner);

    address[] public contractAddresses;

    function deployCollection(string memory _collectionName, string memory _uri) external payable {
        bytes32 _salt = keccak256(abi.encodePacked(_collectionName));
        address contractAddress = address(new ERC721Token{salt: _salt}(_collectionName, _uri));
        contractAddresses.push(contractAddress);

        emit CollectionCreated(contractAddress, msg.sender);
    }
}
