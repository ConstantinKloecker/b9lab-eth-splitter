pragma solidity ^0.5.0;

contract Owned {

    address public owner;

    constructor() public {
        owner = msg.sender;
    }
}