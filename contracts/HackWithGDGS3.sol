// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract HackWithGDGS3 is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;

    constructor() ERC721("Hack With GDG S3", "GDGS3") Ownable(msg.sender) {}

    /// @notice Returns the total number of NFTs minted so far
    function totalMinted() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /// @notice Generates on-chain SVG art for the NFT
    function _generateSVG(uint256 tokenId) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">',
                '<defs>',
                '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" style="stop-color:#4285F4;stop-opacity:1" />',
                '<stop offset="25%" style="stop-color:#EA4335;stop-opacity:1" />',
                '<stop offset="50%" style="stop-color:#FBBC05;stop-opacity:1" />',
                '<stop offset="75%" style="stop-color:#34A853;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#4285F4;stop-opacity:1" />',
                '</linearGradient>',
                '</defs>',
                '<rect width="500" height="500" rx="20" fill="#1a1a2e"/>',
                '<rect x="10" y="10" width="480" height="480" rx="15" fill="none" stroke="url(#bg)" stroke-width="4"/>',
                '<text x="250" y="120" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="bold" fill="url(#bg)">HACK WITH</text>',
                '<text x="250" y="190" text-anchor="middle" font-family="Arial,sans-serif" font-size="56" font-weight="bold" fill="url(#bg)">GDG S3</text>',
                '<circle cx="250" cy="300" r="80" fill="none" stroke="url(#bg)" stroke-width="3"/>',
                '<text x="250" y="290" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#aaaaaa">MINT #</text>',
                '<text x="250" y="325" text-anchor="middle" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="#ffffff">',
                tokenId.toString(),
                '</text>',
                '<text x="250" y="440" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#888888">Powered by Shardeum</text>',
                '<text x="250" y="470" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#666666">ERC-721 On-Chain NFT</text>',
                '</svg>'
            )
        );
    }

    /// @notice Generates on-chain metadata JSON for the NFT
    function _generateTokenURI(uint256 tokenId) internal pure returns (string memory) {
        string memory svg = _generateSVG(tokenId);
        string memory svgBase64 = Base64.encode(bytes(svg));

        string memory json = string(
            abi.encodePacked(
                '{"name": "Hack With GDG S3 #',
                tokenId.toString(),
                '", "description": "Hack With GDG S3 - NFT Mint #',
                tokenId.toString(),
                ' on Shardeum Testnet", "image": "data:image/svg+xml;base64,',
                svgBase64,
                '", "attributes": [{"trait_type": "Mint Number", "value": ',
                tokenId.toString(),
                '}, {"trait_type": "Event", "value": "Hack With GDG S3"}]}'
            )
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(json))
            )
        );
    }

    /// @notice Mint a new NFT — anyone can mint!
    function mint() public returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _generateTokenURI(newTokenId));
        return newTokenId;
    }

    // ── Required overrides ──

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
