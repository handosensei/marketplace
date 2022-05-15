// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Token is ERC721Enumerable, Ownable {

    mapping(uint256 => string) private cids;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function mint(string memory _cid) public returns(uint256) {
        uint256 tokenId = totalSupply() + 1;
        cids[tokenId] = _cid;
        
        _mint(msg.sender, tokenId);

        return tokenId;
    }

    function getCIDbyTokenId(uint256 tokenId) public view returns(string memory) {
        
        return cids[tokenId];
    }
}
