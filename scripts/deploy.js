const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying HackWithGDGS3 NFT to Shardeum Testnet...\n");

  const HackWithGDGS3 = await hre.ethers.getContractFactory("HackWithGDGS3");
  const nft = await HackWithGDGS3.deploy();
  await nft.waitForDeployment();

  const address = await nft.getAddress();
  console.log(`✅ HackWithGDGS3 deployed to: ${address}`);
  console.log(`🔗 View on explorer: https://explorer-mezame.shardeum.org/address/${address}`);
  console.log(`\n📋 Copy the address above into frontend/app.js to connect the UI.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
