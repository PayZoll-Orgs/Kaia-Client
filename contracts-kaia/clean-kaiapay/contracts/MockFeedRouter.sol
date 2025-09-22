// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IFeedRouter.sol";

contract MockFeedRouter is IFeedRouter {
    mapping(string => int256) public prices;
    mapping(string => uint8) public feedDecimals;
    mapping(string => uint256) public lastUpdated;
    string[] public supportedFeeds;
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        
        // Initialize supported feeds
        supportedFeeds.push("KLAY-USDT");
        supportedFeeds.push("USDT-USD");
        
        // Initialize with sample prices (using proper decimals)
        prices["KLAY-USDT"] = 20000000; // $0.20 with 8 decimals
        prices["USDT-USD"] = 100000000; // $1.00 with 8 decimals
        
        // Set decimals for feeds
        feedDecimals["KLAY-USDT"] = 8;
        feedDecimals["USDT-USD"] = 8;
        
        // Set initial timestamps
        lastUpdated["KLAY-USDT"] = block.timestamp;
        lastUpdated["USDT-USD"] = block.timestamp;
    }
    
    function latestRoundData(string calldata feedName)
        external
        view
        override
        returns (uint64 id, int256 answer, uint256 updatedAt)
    {
        require(prices[feedName] != 0, "Feed not available");
        return (
            1, // Round ID
            prices[feedName], // Price answer
            lastUpdated[feedName] // Last updated timestamp
        );
    }
    
    function decimals(string calldata feedName) external view override returns (uint8) {
        return feedDecimals[feedName];
    }
    
    function getFeedNames() external view override returns (string[] memory) {
        return supportedFeeds;
    }
    
    // Admin functions for testing
    function updatePrice(string memory feedName, int256 newPrice) external onlyOwner {
        prices[feedName] = newPrice;
        lastUpdated[feedName] = block.timestamp;
    }
    
    function addFeed(string memory feedName, int256 price, uint8 decimalsCount) external onlyOwner {
        prices[feedName] = price;
        feedDecimals[feedName] = decimalsCount;
        lastUpdated[feedName] = block.timestamp;
        supportedFeeds.push(feedName);
    }
}