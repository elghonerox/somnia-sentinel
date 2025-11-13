// scripts/updatePosition.js
const hre = require("hardhat");

async function main() {
  console.log("🔄 Triggering position update event...\n");

  const LENDING_POOL_ADDRESS = "0x4C48B2e3911A94A59e942b67E121CdF2fec8C55D";
  const [signer] = await hre.ethers.getSigners();

  const lendingPool = await hre.ethers.getContractAt("MockLendingPool", LENDING_POOL_ADDRESS);

  // Deposit 0.1 ETH
  console.log("Depositing 0.1 ETH...");
  const tx = await lendingPool.deposit({ value: hre.ethers.utils.parseEther("0.1") });
  await tx.wait();

  console.log("✅ Position updated!");
  console.log("\n🎯 Check your dashboard - position should update instantly!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });