// if (typeof web3 !== 'undefined') {
//     // Don't lose an existing provider, like Mist or Metamask
//     web3 = new Web3(web3.currentProvider);
// } else {
//     // set the provider you want from Web3.providers
//     web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// }

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

web3.eth.getCoinbase(function (err, coinbase) {
    if (err) {
        console.error(err);
    } else {
        console.log("Coinbase: " + coinbase);
    }
});

const splitterAddress = "******"; // <-- Address of deployed contract
const splitterContractFactory = web3.eth.contract(splitterCompiled.abi);
const splitterInstance = splitterContractFactory.at(splitterAddress);

// Query eth for balance
web3.eth.getBalance(splitterAddress, function (err, balance) {
    if (err) {
        console.error(err);
    } else {
        console.log("Contract balance: " + balance);
    }
});

function splitEth(account1, account2, amount) {
    console.log("Account1: " + account1);
    console.log("Account2: " + account2);
    console.log("Amount: " + amount);
    web3.eth.getCoinbase(function (err, coinbase) {
        if (err) {
            console.error(err);
        } else {
            web3.eth.getAccounts(function (err, accounts) {
                if (err) {
                    console.error(err);
                } else {
                    splitterInstance.splitEth(
                        account1,
                        account2,
                        { from: coinbase, value: web3.toWei(amount.toString(), "ether") },
                        function (err, txn) {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log("splitEth txn: " + txn);
                            }
                        }
                    );
                }
            });
        }
    });
};

function checkBalance(account1) {
    console.log("Account: " + account1);
    web3.eth.getCoinbase(function (err, coinbase) {
        if (err) {
            console.error(err);
        } else {
            web3.eth.getAccounts(function (err, accounts) {
                if (err) {
                    console.error(err);
                } else {
                    splitterInstance.balances(
                        account1,
                        { from: coinbase },
                        function (err, txn) {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log("checkBalance txn: " + txn);
                                alert("Balance is: " + txn + " wei");
                            }
                        });
                }
            });
        }
    });
};

function withdrawBalance() {
    console.log("Account: " + account);
    web3.eth.getCoinbase(function (err, coinbase) {
        if (err) {
            console.error(err);
        } else {
            web3.eth.getAccounts(function (err, accounts) {
                if (err) {
                    console.error(err);
                } else {
                    await splitterInstance.withdraw.call({ from: coinbase });
                    let receipt = await splitterInstance.withdraw({ from: coinbase });
                }
            });
        }
    });
};

window.onload = async function () {
    document.getElementById('addressBal').textContent = web3.eth.coinbase;
    document.getElementById('weiBal').textContent = await splitterInstance.balances(web3.eth.coinbase);
};