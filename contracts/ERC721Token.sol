// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721Token is ERC721Enumerable {

    event Minted(address owner, uint256 tokenId);
    event PriceEdited(uint256 tokenId, uint256 price);

    using Counters for Counters.Counter;
    using Strings for uint256;
    
    Counters.Counter private _tokenIds;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    mapping(uint256 => uint256) private prices;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function mint(address _owner, string memory _uri) public returns(uint256) {
        _tokenIds.increment();        
        uint256 newTokenId = _tokenIds.current();
        _mint(_owner, newTokenId);
        _setTokenURI(newTokenId, _uri);

        emit Minted(_owner, newTokenId);

        return newTokenId;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function approve(address _to, uint256 _tokenId) public override(ERC721, IERC721) virtual {
        _approve(_to, _tokenId);
    }

    function getAddressApprovalsByTokenId(uint256 _tokenId) public view returns(address) {
        return getApproved(_tokenId);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) public view returns (bool) {
        return _isApprovedOrOwner(spender, tokenId);
    }

    function setPrice(uint256 _tokenId, uint256 _price) external {
        prices[_tokenId] = _price;

        emit PriceEdited(_tokenId, _price);
    }

    function getPrice(uint256 _tokenId) public view returns(uint256) {
        return prices[_tokenId];
    }
}
