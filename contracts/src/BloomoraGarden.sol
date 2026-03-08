// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {
    ERC721URIStorage
} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title BloomoraGarden
/// @notice ERC-721 NFT representing a user's living yield garden.
///         Does NOT hold or manage user funds — all deposits flow through YO Protocol.
contract BloomoraGarden is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    event GardenPlanted(
        address indexed gardener,
        uint256 indexed tokenId,
        uint256 timestamp
    );
    event PlantGrown(
        uint256 indexed tokenId,
        address indexed vault,
        uint256 depositAmount,
        uint256 timestamp
    );
    event GardenHarvested(
        uint256 indexed tokenId,
        address indexed vault,
        uint256 redeemAmount,
        uint256 timestamp
    );
    event GardenEvolved(
        uint256 indexed tokenId,
        string newMetadataURI,
        uint256 timestamp
    );
    event CrossPollinated(
        uint256 indexed gardenA,
        uint256 indexed gardenB,
        uint256 timestamp
    );

    struct GardenInfo {
        address gardener;
        uint256 createdAt;
        uint256 totalDeposits;
        uint256 totalRedeems;
        uint256 gardenScore;
    }

    mapping(uint256 => GardenInfo) public gardens;
    mapping(address => uint256) public gardenerToGarden;

    constructor() ERC721("Bloomora Garden", "BLOOM") Ownable(msg.sender) {}

    /// @notice Mint a new garden NFT for the caller.
    function plantGarden(string memory uri) external returns (uint256) {
        require(gardenerToGarden[msg.sender] == 0, "Already has garden");
        uint256 tokenId = ++_nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        gardens[tokenId] = GardenInfo({
            gardener: msg.sender,
            createdAt: block.timestamp,
            totalDeposits: 0,
            totalRedeems: 0,
            gardenScore: 0
        });
        gardenerToGarden[msg.sender] = tokenId;

        emit GardenPlanted(msg.sender, tokenId, block.timestamp);
        return tokenId;
    }

    /// @notice Log a deposit event on-chain after a YO deposit succeeds.
    function logPlantGrowth(address vault, uint256 amount) external {
        uint256 tokenId = gardenerToGarden[msg.sender];
        require(tokenId != 0, "No garden");
        gardens[tokenId].totalDeposits += amount;
        gardens[tokenId].gardenScore += amount / 1e6;
        emit PlantGrown(tokenId, vault, amount, block.timestamp);
    }

    /// @notice Log a redeem event on-chain after a YO redeem succeeds.
    function logHarvest(address vault, uint256 amount) external {
        uint256 tokenId = gardenerToGarden[msg.sender];
        require(tokenId != 0, "No garden");
        gardens[tokenId].totalRedeems += amount;
        emit GardenHarvested(tokenId, vault, amount, block.timestamp);
    }

    /// @notice Update garden metadata URI when the garden visually evolves.
    function evolveGarden(string memory newUri) external {
        uint256 tokenId = gardenerToGarden[msg.sender];
        require(tokenId != 0, "No garden");
        _setTokenURI(tokenId, newUri);
        emit GardenEvolved(tokenId, newUri, block.timestamp);
    }

    // ── Required overrides ──────────────────────────────────────

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
