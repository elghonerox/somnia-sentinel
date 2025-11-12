// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title MockLendingPool
/// @notice Simplified lending protocol for testing SDS subscriptions
contract MockLendingPool {
    // --- Events ---
    event PositionUpdated(
        address indexed user,
        uint256 collateral,
        uint256 debt,
        uint256 timestamp
    );
    
    event PriceUpdated(
        address indexed token,
        uint256 price,
        uint256 timestamp
    );

    // --- Storage ---
    mapping(address => uint256) public collateral;
    mapping(address => uint256) public debt;
    mapping(address => uint256) public prices;

    address public WETH;
    address public USDC;

    // --- Constructor ---
    constructor(address _WETH, address _USDC) {
        WETH = _WETH;
        USDC = _USDC;
    }

    // --- Functions ---
    function deposit(uint256 amount) external {
        collateral[msg.sender] += amount;
        emit PositionUpdated(msg.sender, collateral[msg.sender], debt[msg.sender], block.timestamp);
    }
    
    function borrow(uint256 amount) external {
        debt[msg.sender] += amount;
        emit PositionUpdated(msg.sender, collateral[msg.sender], debt[msg.sender], block.timestamp);
    }
    
    function updatePrice(address token, uint256 newPrice) external {
        prices[token] = newPrice;
        emit PriceUpdated(token, newPrice, block.timestamp);
    }

    /// @notice Creates a test position for a user (for deployment/demo purposes)
    function createTestPosition(
        address user,
        uint256 collateralAmount,
        uint256 debtAmount
    ) external {
        collateral[user] += collateralAmount;
        debt[user] += debtAmount;
        emit PositionUpdated(user, collateral[user], debt[user], block.timestamp);
    }
}
