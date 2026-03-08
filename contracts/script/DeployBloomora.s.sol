// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {BloomoraGarden} from "../src/BloomoraGarden.sol";

contract DeployBloomora is Script {
    function run() external returns (BloomoraGarden) {
        vm.startBroadcast();
        BloomoraGarden garden = new BloomoraGarden();
        vm.stopBroadcast();
        return garden;
    }
}
