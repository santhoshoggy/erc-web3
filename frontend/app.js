// ─── CONFIGURATION ──────────────────────────────────────────────
// ⚠️  Replace this with your deployed contract address!
const CONTRACT_ADDRESS = "0xAB5835a5cBbd5d959c6ADcAd7281A0cd263f73F8";

const SHARDEUM_TESTNET = {
  chainId: "0x1FB7",          // 8119 in hex
  chainName: "Shardeum EVM Testnet",
  rpcUrls: ["https://api-mezame.shardeum.org"],
  blockExplorerUrls: ["https://explorer-mezame.shardeum.org"],
  nativeCurrency: { name: "SHM", symbol: "SHM", decimals: 18 },
};

const CONTRACT_ABI = [
  "function mint() public returns (uint256)",
  "function totalMinted() public view returns (uint256)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
];

// ─── STATE ──────────────────────────────────────────────────────
let provider, signer, contract;

// ─── UI HELPERS ─────────────────────────────────────────────────
function setStatus(msg, type = "info") {
  const el = document.getElementById("status");
  el.className = `status ${type}`;
  el.innerHTML = msg;
  el.style.display = "block";
}

function clearStatus() {
  const el = document.getElementById("status");
  el.style.display = "none";
}

// ─── SWITCH / ADD SHARDEUM NETWORK ──────────────────────────────
async function ensureShardeumNetwork() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SHARDEUM_TESTNET.chainId }],
    });
  } catch (switchError) {
    // Chain not added yet — add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [SHARDEUM_TESTNET],
      });
    } else {
      throw switchError;
    }
  }
}

// ─── CONNECT WALLET ─────────────────────────────────────────────
async function connectWallet() {
  clearStatus();

  if (!window.ethereum) {
    setStatus("🦊 Please install MetaMask!", "error");
    return;
  }

  try {
    setStatus("Connecting wallet…", "info");

    await window.ethereum.request({ method: "eth_requestAccounts" });
    await ensureShardeumNetwork();

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Update UI
    document.getElementById("walletInfo").textContent =
      `Connected: ${address.slice(0, 6)}…${address.slice(-4)}`;
    document.getElementById("connectBtn").textContent = "✅ Connected";
    document.getElementById("connectBtn").disabled = true;
    document.getElementById("mintBtn").disabled = false;

    await refreshStats(address);
    clearStatus();
  } catch (err) {
    console.error(err);
    setStatus(`❌ ${err.message}`, "error");
  }
}

// ─── REFRESH STATS ──────────────────────────────────────────────
async function refreshStats(address) {
  try {
    const total = await contract.totalMinted();
    document.getElementById("totalMinted").textContent = total.toString();

    const balance = await contract.balanceOf(address);
    document.getElementById("yourNfts").textContent = balance.toString();
  } catch (e) {
    console.warn("Stats fetch failed:", e);
  }
}

// ─── MINT ───────────────────────────────────────────────────────
async function mintNFT() {
  if (!contract) {
    setStatus("Connect wallet first!", "error");
    return;
  }

  const mintBtn = document.getElementById("mintBtn");
  mintBtn.disabled = true;
  mintBtn.textContent = "⏳ Minting…";

  try {
    setStatus("📝 Sending transaction…", "info");

    const tx = await contract.mint();
    setStatus(`⛏️ Tx sent! Waiting for confirmation…<br><a href="https://explorer-mezame.shardeum.org/tx/${tx.hash}" target="_blank">View on Explorer ↗</a>`, "info");

    const receipt = await tx.wait();
    
    // Get the minted token ID from the Transfer event
    const transferEvent = receipt.logs.find(
      (log) => log.topics.length === 4 // Transfer(address,address,uint256) has 4 topics
    );
    
    let tokenId = null;
    if (transferEvent) {
      tokenId = BigInt(transferEvent.topics[3]).toString();
    }

    const address = await signer.getAddress();
    await refreshStats(address);

    // Try to show the NFT preview
    if (tokenId) {
      try {
        const uri = await contract.tokenURI(tokenId);
        // Decode the base64 JSON
        const jsonStr = atob(uri.split(",")[1]);
        const metadata = JSON.parse(jsonStr);

        document.getElementById("nftPreview").innerHTML =
          `<img src="${metadata.image}" alt="Hack With GDG S3 #${tokenId}" />`;
        document.getElementById("nftPreview").style.display = "block";
      } catch (e) {
        console.warn("Could not load preview:", e);
      }
    }

    setStatus(
      `🎉 Successfully minted NFT #${tokenId || ""}!<br>` +
      `<a href="https://explorer-mezame.shardeum.org/tx/${receipt.hash}" target="_blank">View Transaction ↗</a>`,
      "success"
    );
  } catch (err) {
    console.error(err);
    setStatus(`❌ Mint failed: ${err.reason || err.message}`, "error");
  } finally {
    mintBtn.disabled = false;
    mintBtn.textContent = "🎨 Mint NFT";
  }
}

// ─── AUTO-CONNECT IF ALREADY AUTHORIZED ─────────────────────────
window.addEventListener("load", async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      connectWallet();
    }
  }
});

// ─── HANDLE ACCOUNT / CHAIN CHANGES ────────────────────────────
if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => window.location.reload());
  window.ethereum.on("chainChanged", () => window.location.reload());
}
