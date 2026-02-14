const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  if (!CONTRACT_ADDRESS) {
    console.error("❌ Set CONTRACT_ADDRESS env variable first!");
    process.exit(1);
  }

  const nft = await hre.ethers.getContractAt("HackWithGDGS3", CONTRACT_ADDRESS);

  console.log("🔨 Minting NFT...");
  const tx = await nft.mint();
  const receipt = await tx.wait();
  console.log(`✅ Minted! Tx: ${receipt.hash}`);

  const totalMinted = await nft.totalMinted();
  console.log(`📊 Total minted so far: ${totalMinted}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
