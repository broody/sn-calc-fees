# calc-fees

A simple CLI tool to calculate Starknet transaction fees based on current gas prices.

## How it works

Fetches gas prices from Starknet mainnet (latest block or a specific block) and calculates the total fee using:

```
fee = (l2_gas × l2_gas_price) + (l1_data_gas × l1_data_gas_price) + (l1_gas × l1_gas_price)
```

## Installation

```bash
npm install
```

## Usage

```bash
node calc.js <l1_gas> <l1_data_gas> <l2_gas> [block_number]
```

| Argument | Required | Description |
|----------|----------|-------------|
| `l1_gas` | Yes | L1 gas amount |
| `l1_data_gas` | Yes | L1 data gas amount |
| `l2_gas` | Yes | L2 gas amount |
| `block_number` | No | Specific block to use (defaults to latest) |

### Examples

```bash
# Use latest block gas prices
node calc.js 0 128 600000

# Use gas prices from a specific block
node calc.js 0 128 600000 750000
```

## Units

- **FRI** - The smallest unit of STRK (like wei to ETH)
- **STRK** - 1 STRK = 10¹⁸ FRI

