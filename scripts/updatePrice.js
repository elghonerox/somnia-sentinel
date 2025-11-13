// scripts/updatePrice.js
const hre = require("hardhat");

async function main() {
  console.log("🔄 Triggering price update event...\n");

  const LENDING_POOL_ADDRESS = "0x4C48B2e3911A94A59e942b67E121CdF2fec8C55D";
  const WETH_ADDRESS = "0x0000000000000000000000000000000000000001";

  const lendingPool = await hre.ethers.getContractAt("MockLendingPool", LENDING_POOL_ADDRESS);

  // Generate random price movement (-2% to +2%)
  const currentPrice = await lendingPool.getPrice(WETH_ADDRESS);
  const changePercent = Math.floor(Math.random() * 4) - 2; // -2 to +2
  
  console.log(`Current price: $${hre.ethers.utils.formatEther(currentPrice)}`);
  console.log(`Changing by: ${changePercent}%`);

  const tx = await lendingPool.simulatePriceMovement(WETH_ADDRESS, changePercent);
  await tx.wait();

  const newPrice = await lendingPool.getPrice(WETH_ADDRESS);
  console.log(`\n✅ New price: $${hre.ethers.utils.formatEther(newPrice)}`);
  console.log("\n🎯 Check your dashboard - price should update instantly!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });