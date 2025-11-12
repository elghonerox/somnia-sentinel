// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SentinelMonitor
/// @notice Real-time DeFi position monitoring system for Somnia Data Streams (SDS)
contract SentinelMonitor {

    // ==============================
    // EVENTS (Critical for SDS Streaming)
    // ==============================

    event PositionRegistered(
        address indexed user,
        address indexed protocol,
        uint256 timestamp,
        string positionType
    );

    event LiquidationRiskUpdated(
        address indexed user,
        uint256 collateralRatio,
        uint256 riskLevel,
        uint256 timeToLiquidation,
        uint256 timestamp
    );

    event AlertTriggered(
        address indexed user,
        string alertType,
        uint256 severity,
        string message,
        uint256 timestamp
    );

    event MonitoringStatusChanged(
        address indexed user,
        bool isActive,
        uint256 timestamp
    );

    // ==============================
    // STATE
    // ==============================

    struct MonitoredPosition {
        address protocol;
        uint256 registeredAt;
        uint256 lastUpdate;
        bool isActive;
        string positionType;
    }

    struct RiskData {
        uint256 collateralRatio;
        uint256 riskLevel;
        uint256 lastCalculation;
        uint256 alertCount;
    }

    mapping(address => MonitoredPosition[]) public userPositions;
    mapping(address => RiskData) public riskScores;
    mapping(address => bool) public isMonitored;
    uint256 public totalUsers;

    uint256 public constant WARNING_THRESHOLD = 60;
    uint256 public constant DANGER_THRESHOLD = 80;
    uint256 public constant CRITICAL_THRESHOLD = 95;

    // ==============================
    // USER FUNCTIONS
    // ==============================

    function registerPosition(
        address protocol,
        string memory positionType
    ) external {
        require(protocol != address(0), "Invalid protocol");

        userPositions[msg.sender].push(MonitoredPosition({
            protocol: protocol,
            registeredAt: block.timestamp,
            lastUpdate: block.timestamp,
            isActive: true,
            positionType: positionType
        }));

        if (!isMonitored[msg.sender]) {
            isMonitored[msg.sender] = true;
            totalUsers++;
        }

        emit PositionRegistered(msg.sender, protocol, block.timestamp, positionType);
        emit MonitoringStatusChanged(msg.sender, true, block.timestamp);
    }

    /// @notice Update risk for a user
    function updateRisk(
        address user,
        uint256 /* collateralRatio */,
        uint256 /* debt */,
        uint256 /* collateral */
    ) external {
        require(isMonitored[user], "User not monitored");

        uint256 collateralRatio = 150e16; // Example dummy; replace with your actual logic
        uint256 riskLevel = calculateRiskLevel(collateralRatio);
        uint256 timeToLiquidation = estimateTimeToLiquidation(collateralRatio, riskLevel);

        riskScores[user] = RiskData({
            collateralRatio: collateralRatio,
            riskLevel: riskLevel,
            lastCalculation: block.timestamp,
            alertCount: riskScores[user].alertCount
        });

        emit LiquidationRiskUpdated(user, collateralRatio, riskLevel, timeToLiquidation, block.timestamp);

        _checkAndTriggerAlerts(user, riskLevel);
    }

    function triggerTestAlert(
        string memory alertType,
        uint256 severity
    ) external {
        emit AlertTriggered(
            msg.sender,
            alertType,
            severity,
            "Test alert triggered",
            block.timestamp
        );
    }

    function pauseMonitoring() external {
        isMonitored[msg.sender] = false;
        emit MonitoringStatusChanged(msg.sender, false, block.timestamp);
    }

    function resumeMonitoring() external {
        require(userPositions[msg.sender].length > 0, "No positions registered");
        isMonitored[msg.sender] = true;
        emit MonitoringStatusChanged(msg.sender, true, block.timestamp);
    }

    // ==============================
    // INTERNAL FUNCTIONS
    // ==============================

    function calculateRiskLevel(uint256 collateralRatio) internal pure returns (uint256) {
        uint256 LIQUIDATION_RATIO = 120e16;
        uint256 SAFE_RATIO = 200e16;

        if (collateralRatio >= SAFE_RATIO) return 0;
        if (collateralRatio <= LIQUIDATION_RATIO) return 100;

        uint256 range = SAFE_RATIO - LIQUIDATION_RATIO;
        uint256 distance = collateralRatio - LIQUIDATION_RATIO;

        return 100 - ((distance * 100) / range);
    }

    function estimateTimeToLiquidation(
        uint256 /* collateralRatio */,
        uint256 riskLevel
    ) internal pure returns (uint256) {
        if (riskLevel < 50) return type(uint256).max;
        if (riskLevel >= 95) return 60;
        if (riskLevel >= 85) return 300;
        if (riskLevel >= 75) return 900;
        return 3600;
    }

    function _checkAndTriggerAlerts(address user, uint256 riskLevel) internal {
        if (riskLevel >= CRITICAL_THRESHOLD) {
            riskScores[user].alertCount++;
            emit AlertTriggered(
                user,
                "CRITICAL_LIQUIDATION_RISK",
                3,
                "Position is at CRITICAL liquidation risk! Take action immediately!",
                block.timestamp
            );
        } else if (riskLevel >= DANGER_THRESHOLD) {
            emit AlertTriggered(
                user,
                "HIGH_LIQUIDATION_RISK",
                2,
                "Position is at HIGH liquidation risk. Monitor closely.",
                block.timestamp
            );
        } else if (riskLevel >= WARNING_THRESHOLD) {
            emit AlertTriggered(
                user,
                "MEDIUM_LIQUIDATION_RISK",
                1,
                "Position approaching liquidation threshold.",
                block.timestamp
            );
        }
    }

    // ==============================
    // VIEW FUNCTIONS
    // ==============================

    function getUserPositions(address user) external view returns (MonitoredPosition[] memory) {
        return userPositions[user];
    }

    function getRiskData(address user) external view returns (RiskData memory) {
        return riskScores[user];
    }

    function isUserMonitored(address user) external view returns (bool) {
        return isMonitored[user];
    }
}
