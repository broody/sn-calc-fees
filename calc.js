import { RpcProvider } from "starknet";

const RPC_URL = "https://api.cartridge.gg/x/starknet/mainnet/rpc/v0_9";
const provider = new RpcProvider({ nodeUrl: RPC_URL });

function hexToBigInt(hex) {
  return BigInt(hex);
}

// 1 STRK = 10^18 FRI
const FRI_PER_STRK = 10n ** 18n;

function calculateFeeFri({
  l1Gas,
  l1DataGas,
  l2Gas,
  l1GasPriceFri,
  l1DataGasPriceFri,
  l2GasPriceFri,
}) {
  return (
    l2Gas * l2GasPriceFri +
    l1DataGas * l1DataGasPriceFri +
    l1Gas * l1GasPriceFri
  );
}

function formatStrk(fri) {
  const integer = fri / FRI_PER_STRK;
  const frac = fri % FRI_PER_STRK;
  const fracStr = frac.toString().padStart(18, "0").replace(/0+$/, "") || "0";
  return `${integer}.${fracStr} STRK`;
}

async function main() {
  // ---- CLI ARGS ----
  const [, , l1GasArg, l1DataGasArg, l2GasArg, blockNumberArg] = process.argv;

  if (!l1GasArg || !l1DataGasArg || !l2GasArg) {
    console.error("Usage: node calc.js <l1_gas> <l1_data_gas> <l2_gas> [block_number]");
    process.exit(1);
  }

  const input = {
    l1Gas: BigInt(l1GasArg),
    l1DataGas: BigInt(l1DataGasArg),
    l2Gas: BigInt(l2GasArg),
  };

  console.log("Your Input:", input);

  // ---- FETCH BLOCK ----
  const blockId = blockNumberArg ? parseInt(blockNumberArg) : "latest";
  console.log(`Fetching block ${blockId}…`);
  const block = await provider.getBlock(blockId);
  const header = block.header ?? block;

  console.log("Block Number:", header.block_number);

  const l2GasPriceFri = hexToBigInt(header.l2_gas_price.price_in_fri);
  const l1DataGasPriceFri = hexToBigInt(header.l1_data_gas_price.price_in_fri);
  const l1GasPriceFri = hexToBigInt(header.l1_gas_price.price_in_fri);

  console.log("\n== Block Gas Prices (FRI) ==");
  console.log("L2 Gas Price (FRI):      ", l2GasPriceFri.toString());
  console.log("L1 Data Gas Price (FRI): ", l1DataGasPriceFri.toString());
  console.log("L1 Gas Price (FRI):      ", l1GasPriceFri.toString());
  console.log("");

  // ---- CALCULATE FEE ----
  const feeFri = calculateFeeFri({
    ...input,
    l2GasPriceFri,
    l1DataGasPriceFri,
    l1GasPriceFri,
  });

  console.log("Fee (FRI): ", feeFri.toString());
  console.log("Fee (STRK):", formatStrk(feeFri));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

