---
name: foundry-erc721
description: >-
  Use this skill when writing, testing, or deploying ERC-721 NFT contracts with Foundry
  and OpenZeppelin. Covers Foundry project setup, forge test patterns, deployment scripts,
  contract verification on Base/Ethereum, and OpenZeppelin ERC721 + ERC721URIStorage usage.
author: bloomora-team
---

# Foundry ERC-721 Patterns

## Project Structure

```
contracts/
├── foundry.toml
├── src/
│   └── BloomoraGarden.sol       # Main ERC-721 contract
├── test/
│   └── BloomoraGarden.t.sol     # Foundry tests
├── script/
│   └── DeployBloomora.s.sol     # Deployment script
└── lib/
    └── openzeppelin-contracts/  # Installed via forge install
```

## foundry.toml

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.25"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
base = "${BASE_RPC_URL}"
ethereum = "${ETH_RPC_URL}"

[etherscan]
base = { key = "${BASESCAN_API_KEY}", url = "https://api.basescan.org/api" }
```

## Installation

```bash
cd contracts
forge init . --no-commit
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

## Remappings

Create `remappings.txt`:
```
@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/
```

## Testing Patterns

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test, console} from "forge-std/Test.sol";

contract MyTest is Test {
    // Use setUp() for shared setup
    function setUp() public { }
    
    // test_ prefix for passing tests
    function test_MintNFT() public { }
    
    // testFail_ prefix for expected failures (prefer vm.expectRevert)
    function test_RevertWhen_Unauthorized() public {
        vm.expectRevert("Not owner");
        contract.restrictedFunction();
    }
    
    // vm.prank(address) to impersonate
    function test_AsAlice() public {
        vm.prank(alice);
        contract.doSomething();
    }
    
    // vm.startPrank / vm.stopPrank for multiple calls
    function test_MultipleCallsAsAlice() public {
        vm.startPrank(alice);
        contract.step1();
        contract.step2();
        vm.stopPrank();
    }
}
```

## Deployment Script

```solidity
pragma solidity ^0.8.25;
import {Script} from "forge-std/Script.sol";
import {MyContract} from "../src/MyContract.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        MyContract c = new MyContract();
        vm.stopBroadcast();
    }
}
```

Deploy command:
```bash
forge script script/Deploy.s.sol --rpc-url base --broadcast --verify
```

## Key Commands

```bash
forge build              # Compile
forge test -vvv          # Test with traces
forge test --match-test test_MintNFT  # Run specific test
forge script script/Deploy.s.sol --rpc-url base --broadcast --verify
forge verify-contract <address> src/MyContract.sol:MyContract --chain base
```
