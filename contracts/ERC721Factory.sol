// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "./ERC721Token.sol";

contract ERC721Factory {

    event CollectionCreated(address contractAddress, address owner);
    event Minted(address owner, uint256 tokenId);
    
    mapping(address => ERC721Token) private contracts;

    Collection[] private collections;
    struct Collection {
        address contractAddress;
        address owner;
        ERC721Token token;
    }
     
    mapping(address => mapping(uint256 => address)) private owners;
    /*
    address[] private contractAddresses;

    

    // ERC721 contract address => (tokenID => owner address)
   
    
    // owner address => (ERC721 contract address => tableau de token id)
    mapping(address => mapping(address => uint256[])) private balances;
   
*/
    function deployCollection(string memory _name, string memory _symbol) external payable returns(address) {
        bytes32 _salt = keccak256(abi.encodePacked(_name));
        ERC721Token token = new ERC721Token{salt: _salt}(_name, _symbol);
        address contractAddress = address(token);



        contracts[contractAddress] = token;
        collections.push(Collection(contractAddress, msg.sender, token));






        emit CollectionCreated(contractAddress, msg.sender);

        return contractAddress;
    }

    function getCollectionName(address _address) public view returns(string memory) {
        return contracts[_address].name();
    }

    function getNextTokenId(address _address) public view returns(uint256) {
        return contracts[_address].totalSupply() + 1;
    }

    function mint(address _contractAddress, string memory _cid) public {
        uint256 tokenId = contracts[_contractAddress].mint(_cid);
        owners[_contractAddress][tokenId] = msg.sender;

        emit Minted(msg.sender, tokenId);
    }

    function getCIDbyTokenId(address _address, uint256 _tokenId) public view returns(string memory) {
        return contracts[_address].getCIDbyTokenId(_tokenId);
    }

    function getOwnerAddressByTokenId(address _address, uint256 _tokenId) public view returns(address) {
        require(owners[_address][_tokenId] != address(0), "Token ID not found");

        return owners[_address][_tokenId];
    }

    function getOwnerCollections(address _owner) external view returns(Collection[] memory){
        Collection[] memory tmp;
        uint256 i;
        for (uint256 index = 0; index < collections.length; index++) {
            if(collections[index].token.balanceOf(_owner) > 0){
                tmp[i] = collections[index];
                i++;
            }
        }

        return tmp;
    }
}
