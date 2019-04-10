pragma solidity ^0.5.0;

import {Owned} from "./Owned.sol";

contract Toggled is Owned {

    bool private active;

    constructor() internal {
        active = true;
    }

    modifier isActive() {
        require(active, "Contract is currently not active");
        _;
    }

    function deactivateContract() public onlyOwner {
        active = false;
    }

    function activateContract() public onlyOwner {
        active = true;
    }
}