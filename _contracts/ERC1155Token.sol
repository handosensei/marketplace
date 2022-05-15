// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ERC1155Token is ERC1155, Ownable {

    string name;
    
    constructor(string memory _name, string memory _uri) ERC1155(_uri) {
        name = _name;
    }

    function getTokenIdURI(uint256 id) public view virtual returns (string memory) {
        return string(
            abi.encodePacked(uri(0), '/', Strings.toString(id), ".json")
        );
    }
}
