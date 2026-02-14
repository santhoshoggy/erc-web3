# 🚀 Hack With GDG S3 — ERC-721 NFT on Shardeum

An on-chain ERC-721 NFT project that mints "Hack With GDG S3" tokens with a mint counter, deployed on Shardeum EVM Testnet.

## Network Details

| Property          | Value                                      |
| ----------------- | ------------------------------------------ |
| Network Name      | Shardeum EVM Testnet                       |
| RPC URL           | https://api-mezame.shardeum.org            |
| Chain ID          | 8119                                       |
| Block Explorer    | https://explorer-mezame.shardeum.org       |

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Wallet

Edit the `.env` file and add your MetaMask private key:

```
PRIVATE_KEY=your_private_key_here
```

> Get testnet SHM from the Shardeum faucet to pay for gas.

### 3. Compile the Contract

```bash
npx hardhat compile
```

### 4. Deploy to Shardeum Testnet

```bash
npx hardhat run scripts/deploy.js --network shardeum
```

Copy the deployed contract address from the output.

### 5. Mint via CLI (optional)

```bash
CONTRACT_ADDRESS=0xYourAddress npx hardhat run scripts/mint.js --network shardeum
```

### 6. Use the Frontend

1. Open `frontend/app.js` and replace `PASTE_YOUR_CONTRACT_ADDRESS_HERE` with your deployed contract address.
2. Open `frontend/index.html` in your browser (or use Live Server).
3. Connect MetaMask and click **Mint NFT**.

## Project Structure

```
├── contracts/
│   └── HackWithGDGS3.sol     # ERC-721 smart contract (on-chain SVG + metadata)
├── scripts/
│   ├── deploy.js              # Deployment script
│   └── mint.js                # CLI minting script
├── frontend/
│   ├── index.html             # Minting UI
│   └── app.js                 # Frontend logic (ethers.js)
├── hardhat.config.js          # Hardhat configuration
├── .env                       # Private key (never commit!)
└── README.md
```

## Features

- **Fully on-chain** SVG art with GDG brand colors
- **Mint counter** — each NFT shows its mint number
- **Anyone can mint** — no allowlist required
- **Beautiful frontend** with wallet connect + live stats
- **Auto-adds Shardeum network** to MetaMask

## License

MIT
