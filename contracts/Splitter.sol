pragma solidity ^0.5.0;

contract Splitter {

    bool active;
    address owner;
    mapping (address => uint) balances;

    event LogEthSplitted(address indexed _from, uint _amount, address _toUser1, address _toUser2);
    event LogRemainder(address indexed _user);
    event LogWithdrawal(address indexed _to, uint _amount);

    constructor() public {
        owner = msg.sender;
        active = true;
    }

    function deactivateSplitter() public {
        require(msg.sender == owner, "Only executable by owner");
        active = false;
    }

    function getBalance(address _user) public view returns (uint) {
        return balances[_user];
    }

    function withdraw() public {
        uint amount = getBalance(msg.sender);
        require(amount > 0, "No balance available");
        balances[msg.sender] = 0;
        require(msg.sender.send(amount) == true, "Error during withdrawal");
        emit LogWithdrawal(msg.sender, amount);
    }

    function splitEth(address _toUser1, address _toUser2) external payable {
        require(active == true, "Contract is no longer active");
        uint amount = msg.value / 2;
        balances[_toUser1] += amount;
        balances[_toUser2] += amount;
        emit LogEthSplitted(msg.sender, msg.value, _toUser1, _toUser2);
        uint remainder = msg.value - (2 * amount);
        if (remainder != 0) {
            balances[msg.sender] += remainder;
            emit LogRemainder(msg.sender);
        }
    }

    function() external {
        revert("Please use functions");
    }
}