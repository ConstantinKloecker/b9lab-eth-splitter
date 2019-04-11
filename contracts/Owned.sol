pragma solidity ^0.5.0;

contract Owned {

    address private owner;

    event LogOwnerChanged(address newOwner);

    constructor() internal {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only executable by owner");
        _;
    }

    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
        emit LogOwnerChanged(newOwner);
    }
}