const connectButton = document.getElementById("connectButton");
const disconnectButton = document.getElementById("disconnectButton");

const walletInfo = document.getElementById("walletInfo");
const walletAddress = document.getElementById("walletAddress");
const networkName = document.getElementById("networkName");
const walletBalance = document.getElementById("walletBalance");

const status = document.getElementById("status");

let provider;
let signer;

async function connectWallet() {
try {
  if (!window.ethereum) {
    status.textContent = "MetaMask was not detected. Please install or enable the extension.";
    return;
  } 

  status.textContent = "Connecting wallet...";
  
  provider = new ethers.BrowserProvider(window.ethereum);

  await provider.send("eth_requestAccounts", []);

  signer = await provider.getSigner();

  const address = await signer.getAddress();

  const network =  await provider.getNetwork();

  const balance =  await provider.getBalance(address);

  const formattedBalance = ethers.formatEther(balance);

  walletAddress.textContent = address;
  
  networkName.textContent = network.name;
  
  walletBalance.textContent = `${formattedBalance} ETH`;

  walletInfo.hidden = false;
  
  connectButton.hidden = true;
  
  disconnectButton.hidden = false;

  status.textContent = "Wallet connected successfully";

} catch(error) {
      console.error(error);
      if (error.code === 4001) {
          status.textContent = "You rejected the connection request.";
      } else {
          status.textContent = "Connection failed. Please try again.";
      }
}
}

function disconnectWallet(){
  provider = null;
  signer = null;

  walletAddress.textContent = "Not connected";
  networkName.textContent = "Not connected";
  walletBalance.textContent = "Not connected";

  walletInfor.hidden = true;
  connectButton.hidden = false;
  disconnectButton.hidden = true;

  status.textContent = "Wallet disconnected from this app.";
}

connectButton.addEventListener("click", connectWallet);
disconnectButton.addEventListener("click", disconnectWallet);

if (window.ethereum) {
    window.ethereum.on("accountsChanged", async (accounts) => {
       try {
           if (accounts.length === 0) {
            disconnectWallet();
          } else {
            signer = await provider.getSigner();

            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);

            walletAddress.textContent = address;
            walletBalance.textContent =
                `${ethers.formatEther(balance)} ETH`;

            status.textContent = "Wallet account updated!";
        }
    } catch (error) {
         console.error(error);
         status.textContent = "Could not update wallet account.";
       }
    });
}

if (window.ethereum) {
    window.ethereum.on("chainChanged", () => {
        window.location.reload();
    });
}
