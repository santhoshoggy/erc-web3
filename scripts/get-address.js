const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const address = await deployer.getAddress();
  const balance = await hre.ethers.provider.getBalance(address);
  
  console.log("📍 Your wallet address:", address);
  console.log("💰 Current balance:", hre.ethers.formatEther(balance), "SHM");
  console.log("\n🚰 Get testnet tokens from:");
  console.log("   https://faucet-mezame.shardeum.org/");
  console.log("\n   Paste your address above to receive free SHM tokens.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
