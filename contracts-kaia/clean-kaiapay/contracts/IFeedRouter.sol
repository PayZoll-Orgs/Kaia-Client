// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFeedRouter {
    /**
     * @notice Get the latest round data of the feed given a feed name.
     * @param feedName The feed name.
     * @return id The round ID.
     * @return answer The oracle answer.
     * @return updatedAt Timestamp of the last update.
     */
    function latestRoundData(string calldata feedName)
        external
        view
        returns (uint64 id, int256 answer, uint256 updatedAt);

    /**
     * @notice Get decimals of the feed given a feed name.
     * @param feedName The feed name.
     * @return decimals The decimals of the feed.
     */
    function decimals(string calldata feedName) external view returns (uint8);

    /**
     * @notice Get supported feed names.
     * @return The feed names.
     */
    function getFeedNames() external view returns (string[] memory);
}