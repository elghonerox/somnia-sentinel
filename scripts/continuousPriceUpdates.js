// scripts/continuousPriceUpdates.js
const hre = require("hardhat");

async function main() {
  console.log("🔄 Starting continuous price updates for demo...\n");
  console.log("Press Ctrl+C to stop\n");
  console.log("Watch your dashboard at http://localhost:3000/dashboard\n");
  console.log("You should see the price chart update every 3 seconds!\n");

  const LENDING_POOL_ADDRESS = "0x4C48B2e3911A94A59e942b67E121CdF2fec8C55D";
  const WETH_ADDRESS = "0x0000000000000000000000000000000000000001";

  const lendingPool = await hre.ethers.getContractAt("MockLendingPool", LENDING_POOL_ADDRESS);

  let updateCount = 0;
  let currentPrice = 2000; // Start at $2000

  while (true) {
    updateCount++;
    
    // Random price change between -50 and +50
    const changeAmount = Math.floor(Math.random() * 100) - 50;
    const newPrice = Math.max(1500, Math.min(2500, currentPrice + changeAmount)); // Keep between $1500-$2500
    
    console.log(`[${updateCount}] Updating price from $${currentPrice} to $${newPrice} (${changeAmount >= 0 ? '+' : ''}${changeAmount})...`);
    
    try {
      const tx = await lendingPool.updatePrice(
        WETH_ADDRESS, 
        hre.ethers.parseEther(newPrice.toString())
      );
      await tx.wait();
      
      console.log(`    ✅ Success! Price is now $${newPrice}`);
      console.log(`    📊 Check your dashboard - chart should update instantly!\n`);
      
      currentPrice = newPrice; // Update for next iteration
    } catch (error) {
      console.error("    ❌ Error:", error.message);
      console.log("    Retrying in 3 seconds...\n");
    }

    // Wait 3 seconds before next update
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });