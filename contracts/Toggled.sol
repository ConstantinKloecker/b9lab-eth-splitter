pragma solidity ^0.5.0;

import {Owned} from "./Owned.sol";

contract Toggled is Owned {

    bool public active;

    event LogContractPaused(address thisContract);
    event LogContractResumed(address thisContract);

    constructor() internal {
        active = true;
    }

    modifier isActive() {
        require(active, "Contract is currently paused");
        _;
    }

    function pauseContract() public onlyOwner {
        active = false;
        emit LogContractPaused(address(this));
    }

    function resumeContract() public onlyOwner {
        active = true;
        emit LogContractResumed(address(this));
    }
}