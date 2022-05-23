// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "./ERC721Token.sol";

contract Factory {

    event CollectionCreated(address contractAddress, address owner);
    event FactoryMinted(address contractAddress, address owner, uint256 tokenId);

    address[] private collections;
    mapping(address => mapping(address => uint256[])) private ownerCollections;

    function deploy(string memory _name, string memory _symbol) external payable {
        bytes32 _salt = keccak256(abi.encodePacked(_name));
        ERC721Token token = new ERC721Token{salt: _salt}(_name, _symbol);
        address tokenAddress = address(token);
        collections.push(tokenAddress);
    
        emit CollectionCreated(address(token), msg.sender);
    }

    function mint(address _tokenAddress, address _owner, string memory _uri) external returns(uint256) {
        uint256 tokenId = ERC721Token(_tokenAddress).mint(_owner, _uri);
        ownerCollections[_owner][_tokenAddress].push(tokenId);
        emit FactoryMinted(_tokenAddress, _owner, tokenId);
        
        return tokenId;
    }

    function getTokenURI(address _tokenAddress, uint256 _tokenId) public view returns(string memory) {
        return ERC721Token(_tokenAddress).tokenURI(_tokenId);
    }

    function getCollections() public view returns (address[] memory) {
        return collections;
    }

    function getOwnerBalanceByCollection(address _tokenAddress, address _owner) public view returns(uint256){
        return ERC721Token(_tokenAddress).balanceOf(_owner);
    }

    function getTotalSupply(address _tokenAddress) public view returns(uint256) {
        return ERC721Token(_tokenAddress).totalSupply();
    }

    function getOwnerTokenIdsByCollection(address _tokenAddress, address _owner) public view returns(uint256[] memory) {
        return ownerCollections[_owner][_tokenAddress];
    }

    function getCollectionName(address _tokenAddress) public view returns (string memory) {
        return ERC721Token(_tokenAddress).name();
    }

    function setPrice(address _contractCollection, uint256 _tokenId, uint256 _price) external {
        ERC721Token(_contractCollection).setPrice(_tokenId, _price);
    }

    function getPrice(address _contractCollection, uint256 _tokenId) public view returns (uint256) {
        return ERC721Token(_contractCollection).getPrice(_tokenId);
    }

    function 
}
