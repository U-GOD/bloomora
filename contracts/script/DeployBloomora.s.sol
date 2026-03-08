// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {BloomoraGarden} from "../src/BloomoraGarden.sol";

contract DeployBloomora is Script {
    function run() external returns (BloomoraGarden) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        BloomoraGarden garden = new BloomoraGarden();

        vm.stopBroadcast();
        return garden;
    }
}
