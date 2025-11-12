// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Somnia Sentinel contracts to Somnia Testnet...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // FIX: Use provider to get balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy mock token addresses (in production, use real WETH/USDC)
  console.log("📝 Using mock token addresses for testnet...");
  const WETH_ADDRESS = "0x0000000000000000000000000000000000000001"; // Placeholder
  const USDC_ADDRESS = "0x0000000000000000000000000000000000000002"; // Placeholder

  // Rest of your deployment code remains the same...
  // Deploy MockLendingPool
  console.log("📦 Deploying MockLendingPool...");
  const MockLendingPool = await hre.ethers.getContractFactory("MockLendingPool");
  const lendingPool = await MockLendingPool.deploy(WETH_ADDRESS, USDC_ADDRESS);
  await lendingPool.waitForDeployment();
  console.log("✅ MockLendingPool deployed to:", lendingPool.target);

  // Deploy SentinelMonitor
  console.log("\n📦 Deploying SentinelMonitor...");
  const SentinelMonitor = await hre.ethers.getContractFactory("SentinelMonitor");
  const sentinel = await SentinelMonitor.deploy();
  await sentinel.waitForDeployment();
  console.log("✅ SentinelMonitor deployed to:", sentinel.target);

  // Initialize with test data
  console.log("\n🔧 Initializing with test data...");
  
  // Set initial price
  console.log("Setting initial ETH price to $2000...");
  const tx1 = await lendingPool.updatePrice(WETH_ADDRESS, hre.ethers.parseEther("2000"));
  await tx1.wait();
  console.log("✅ Price set");

  // Create test position for deployer
  console.log("Creating test position...");
  const tx2 = await lendingPool.createTestPosition(
    deployer.address,
    hre.ethers.parseEther("1"), // 1 ETH collateral
    hre.ethers.parseEther("1500") // $1500 debt
  );
  await tx2.wait();
  console.log("✅ Test position created");

  // Register position in Sentinel
  console.log("Registering position in Sentinel...");
  const tx3 = await sentinel.registerPosition(lendingPool.target, "LENDING");
  await tx3.wait();
  console.log("✅ Position registered");

  // Update risk (collateral ratio = 1 ETH * $2000 / $1500 = 133%)
  console.log("Updating risk calculation...");
  const tx4 = await sentinel.updateRisk(
    deployer.address,
    hre.ethers.parseEther("1.33"), // 133% ratio
    hre.ethers.parseEther("1500"), // debt
    hre.ethers.parseEther("1") // collateral
  );
  await tx4.wait();
  console.log("✅ Risk updated");

  // Print deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("\n📍 Contract Addresses:");
  console.log("   MockLendingPool:", lendingPool.target);
  console.log("   SentinelMonitor:", sentinel.target);
  
  console.log("\n🔗 Somnia Testnet Explorer:");
  console.log("   https://shannon-explorer.somnia.network/address/" + lendingPool.target);
  console.log("   https://shannon-explorer.somnia.network/address/" + sentinel.target);

  console.log("\n⚙️  Environment Variables for .env:");
  console.log("   NEXT_PUBLIC_LENDING_POOL_ADDRESS=" + lendingPool.target);
  console.log("   NEXT_PUBLIC_SENTINEL_ADDRESS=" + sentinel.target);
  console.log("   NEXT_PUBLIC_WETH_ADDRESS=" + WETH_ADDRESS);
  console.log("   NEXT_PUBLIC_USDC_ADDRESS=" + USDC_ADDRESS);

  console.log("\n📚 Next Steps:");
  console.log("   1. Add these addresses to your .env file");
  console.log("   2. Update frontend configuration");
  console.log("   3. Test SDS subscriptions with these contracts");
  console.log("   4. Verify contracts on explorer (optional)");
  
  console.log("\n✨ Deployment complete!");
  console.log("=".repeat(60) + "\n");

  // Save deployment info to file
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      MockLendingPool: lendingPool.target,
      SentinelMonitor: sentinel.target,
      WETH: WETH_ADDRESS,
      USDC: USDC_ADDRESS
    }
  };

  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment info saved to deployment.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });