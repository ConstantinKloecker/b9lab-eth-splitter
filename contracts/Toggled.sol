pragma solidity ^0.5.0;

import {Owned} from "./Owned.sol";

contract Toggled is Owned {

    bool private active;

    event LogContractPaused(address indexed performedBy);
    event LogContractResumed(address indexed performedBy);

    constructor() internal {
        active = true;
    }

    modifier isActive() {
        require(active, "Contract is currently paused");
        _;
    }

    modifier isPaused() {
        require(!active, "Contract is currently active");
        _;
    }

    function pauseContract() public onlyOwner isActive {
        emit LogContractPaused(msg.sender);
        active = false;
    }

    function resumeContract() public onlyOwner isPaused {
        emit LogContractResumed(msg.sender);
        active = true;
    }

    function pausePermanently() public onlyOwner {
        pauseContract();
        deleteOwner();
    }

    function getStatus() public view returns(bool) {
        return active;
    }
}