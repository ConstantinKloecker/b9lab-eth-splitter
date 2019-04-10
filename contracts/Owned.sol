pragma solidity ^0.5.0;

contract Owned {

    address private owner;

    constructor() internal {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only executable by owner");
        _;
    }
}