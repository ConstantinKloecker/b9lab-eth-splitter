pragma solidity ^0.5.0;

contract Ownable {

    address owner;
    bool active;

    function deactivateContract() public {
        require(msg.sender == owner, "Only executable by owner");
        active = false;
    }
}

contract Splitter is Ownable {

    mapping (address => uint) balances;

    event LogEthSplitted(
        address indexed from, 
        address indexed toUser1, 
        address indexed toUser2,
        uint preSplitAmount
    );

    event LogWithdrawal(
        address indexed to, 
        uint amount
    );

    constructor() public {
        owner = msg.sender;
        active = true;
    }

    function getBalance(address user) public view returns (uint) {
        return balances[user];
    }

    function withdraw() public {
        uint amount = balances[msg.sender];
        require(amount > 0, "No balance available");
        balances[msg.sender] = 0;
        emit LogWithdrawal(msg.sender, amount);
        msg.sender.transfer(amount);
    }

    function splitEth(address toUser1, address toUser2) external payable {
        require(active == true, "Contract is no longer active");
        require(toUser1 != address(0), "Address of 'toUser1' cannot be empty");
        require(toUser2 != address(0), "Address of 'toUser2' cannot be empty");
        uint amount = msg.value / 2;
        balances[toUser1] += amount;
        balances[toUser2] += amount;
        emit LogEthSplitted(msg.sender, toUser1, toUser2, msg.value);
    }

    function() external {
        revert("Please use functions");
    }
}