// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "./ERC721Token.sol";

contract Sale {
    address collectionAddress;
    uint256 tokenId;
    uint256 price;
    address seller;
    ERC721Token token;

    constructor(address _collectionAddress, uint256 _tokenId, uint256 _price, address _seller) {
        collectionAddress = _collectionAddress;
        tokenId = _tokenId;
        price = _price;
        seller = _seller;
        token = IERC721(_collectionAddress);
    }

    
}
