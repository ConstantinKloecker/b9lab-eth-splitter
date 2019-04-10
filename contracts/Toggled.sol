pragma solidity ^0.5.0;

import "./Owned.sol";

contract Toggled is Owned {

    bool public active;

    constructor() public {
        active = true;
    }

    function deactivateContract() public {
        require(msg.sender == owner, "Only executable by owner");
        active = false;
    }
}