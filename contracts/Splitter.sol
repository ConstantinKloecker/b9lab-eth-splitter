pragma solidity ^0.5.0;

contract Splitter {

    mapping (address => uint) balances;
    address alice;
    address bob;
    address carol;

    event LogEthSplitted(address indexed _from, uint _amount);
    event LogWithdrawal(address indexed _to, uint _amount);

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
            emit LogWithdrawal(msg.sender, amount);
        } else {
            revert("No balance available");
        }
    }

    function() external payable {
        if (msg.sender == alice) {
            uint amount = msg.value / 2;
            balances[bob] += amount;
            balances[carol] += amount;
            emit LogEthSplitted(msg.sender, msg.value);
        } else {
            revert("Only usable by Alice");
        }
    }
}