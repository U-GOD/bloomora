// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {BloomoraGarden} from "../src/BloomoraGarden.sol";

contract BloomoraGardenTest is Test {
    BloomoraGarden garden;
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        garden = new BloomoraGarden();
    }

    function test_PlantGarden() public {
        vm.prank(alice);
        uint256 tokenId = garden.plantGarden("ipfs://test");
        assertEq(tokenId, 1);
        assertEq(garden.ownerOf(1), alice);
        assertEq(garden.gardenerToGarden(alice), 1);
    }

    function test_CannotPlantTwice() public {
        vm.startPrank(alice);
        garden.plantGarden("ipfs://test");
        vm.expectRevert("Already has garden");
        garden.plantGarden("ipfs://test2");
        vm.stopPrank();
    }

    function test_LogPlantGrowth() public {
        vm.startPrank(alice);
        garden.plantGarden("ipfs://test");
        garden.logPlantGrowth(address(0xdead), 100e6);
        (, , uint256 totalDeposits, , ) = garden.gardens(1);
        assertEq(totalDeposits, 100e6);
        vm.stopPrank();
    }

    function test_LogHarvest() public {
        vm.startPrank(alice);
        garden.plantGarden("ipfs://test");
        garden.logHarvest(address(0xdead), 50e6);
        (, , , uint256 totalRedeems, ) = garden.gardens(1);
        assertEq(totalRedeems, 50e6);
        vm.stopPrank();
    }

    function test_EvolveGarden() public {
        vm.startPrank(alice);
        garden.plantGarden("ipfs://v1");
        garden.evolveGarden("ipfs://v2");
        assertEq(garden.tokenURI(1), "ipfs://v2");
        vm.stopPrank();
    }

    function test_RevertLogWithoutGarden() public {
        vm.prank(alice);
        vm.expectRevert("No garden");
        garden.logPlantGrowth(address(0xdead), 100e6);
    }

    function test_RevertHarvestWithoutGarden() public {
        vm.prank(alice);
        vm.expectRevert("No garden");
        garden.logHarvest(address(0xdead), 50e6);
    }

    function test_RevertEvolveWithoutGarden() public {
        vm.prank(alice);
        vm.expectRevert("No garden");
        garden.evolveGarden("ipfs://v2");
    }

    function test_GardenScoreAccumulates() public {
        vm.startPrank(alice);
        garden.plantGarden("ipfs://test");
        garden.logPlantGrowth(address(0xdead), 100e6);
        garden.logPlantGrowth(address(0xdead), 200e6);
        (, , , , uint256 score) = garden.gardens(1);
        assertEq(score, 300); // (100e6 + 200e6) / 1e6
        vm.stopPrank();
    }

    function test_TwoGardenersIndependent() public {
        vm.prank(alice);
        garden.plantGarden("ipfs://alice");

        vm.prank(bob);
        garden.plantGarden("ipfs://bob");

        assertEq(garden.gardenerToGarden(alice), 1);
        assertEq(garden.gardenerToGarden(bob), 2);
        assertEq(garden.ownerOf(1), alice);
        assertEq(garden.ownerOf(2), bob);
    }
}
