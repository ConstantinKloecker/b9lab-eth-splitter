pragma solidity ^0.5.0;

contract Splitter {

    mapping (address => uint) balances;
    address alice;
    address bob;
    address carol;

    constructor(address _alice, address _bob, address _carol) public {
        alice = _alice;
        bob = _bob;
        carol = _carol;
    }

    function getSenderBalance() public view returns (uint) {
        return balances[msg.sender];
    }

    function getAllBalances() public view returns (uint, uint) {
        return (balances[bob], balances[carol]);
    }

    function withdraw() public {
        uint amount = getSenderBalance();
        if (amount > 0) {
            balances[msg.sender] = 0;
            if (!msg.sender.send(amount)) {
                revert("Error during withdrawal");
            }
        } else {
            revert("No balance available");
        }
    }

    function() external payable {
        if (msg.sender == alice) {
            uint amount = msg.value / 2;
            balances[bob] += amount;
            balances[carol] += amount;
        } else {
            revert("Only usable by Alice");
        }
    }
}