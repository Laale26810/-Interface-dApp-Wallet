const { ethers } = require('ethers');

async function main() {
  // Connect to a provider (e.g., a public Ethereum node or a local node)
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // or use a public node URL like 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID'

  // Address to check the balance of
  const address = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';

  // Get the balance
  const balance = await provider.getBalance(address);

  // Convert balance from wei to ether
  const balanceInEther = ethers.utils.formatEther(balance);

  console.log('Balance of ', ${address},': ', ${balanceInEther},  'ETH');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});