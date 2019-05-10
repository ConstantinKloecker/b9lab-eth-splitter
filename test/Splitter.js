const Splitter = artifacts.require("Splitter");
const truffleAssert = require("truffle-assertions");

contract("Testing Main features of Splitter contract", accounts => {
    let instance;
    const [owner, alice, bob, carol] = accounts;

    beforeEach("Deploying clean Splitter contract", async () => {
        instance = await Splitter.new({ from: owner });
    });

    it("Balances are empty (0) after fresh deployment", async () => {
        assert.equal(await instance.balances(alice, { from: owner }), 0, "Fresh contract's user balances' should be 0");
        assert.equal(await instance.balances(bob, { from: owner }), 0, "Fresh contract's user balances' should be 0");
        assert.equal(await instance.balances(carol, { from: owner }), 0, "Fresh contract's user balances' should be 0");
        assert.equal(await web3.eth.getBalance(instance.address), 0, "Fresh contract's balance should be 0");
    });

    it("Splitting ether correctly", async () => {
        let split = await instance.splitEth(bob, carol, { from: alice, value: 2 });
        truffleAssert.eventEmitted(split, 'LogEthSplitted', (ev) => {
            return ev.from === alice && ev.toUser1 === bob && ev.toUser2 === carol;
        });

        assert.equal(await instance.balances(bob, { from: owner }), 1, "Bob's balance should be 1");
        assert.equal(await instance.balances(carol, { from: owner }), 1, "Carol's balance should be 1");
        assert.equal(await web3.eth.getBalance(instance.address), 2, "Contract's balance should be 2");
    });

    it("Reverting incorrect splitting attempts", async () => {
        const zeroAddress = "0x0000000000000000000000000000000000000000";

        // revert 0 address
        await truffleAssert.fails(
            instance.splitEth(bob, zeroAddress, { from: alice, value: 2 })
        );

        // revert 0 address
        await truffleAssert.fails(
            instance.splitEth(zeroAddress, bob, { from: alice, value: 2 })
        );

        // revert 0 value
        await truffleAssert.fails(
            instance.splitEth(bob, carol, { from: alice, value: 0 })
        );

        // revert uneven value
        await truffleAssert.fails(
            instance.splitEth(bob, carol, { from: alice, value: 3 })
        );
    });

    it("Withdrawing balances correctly", async () => {
        await instance.splitEth(bob, carol, { from: alice, value: 2 });

        let preBalance1 = await web3.eth.getBalance(bob);
        let withdrawal1 = await instance.withdraw({ from: bob });
        let tx1 = await web3.eth.getTransaction(withdrawal1.tx);
        let gasCost1 = tx1.gasPrice * withdrawal1.receipt.gasUsed;
        truffleAssert.eventEmitted(withdrawal1, "LogWithdrawal", (ev) => {
            return ev.to === bob && ev.amount == 1;
        });
        assert.equal(await instance.balances(bob, { from: bob }), 0, "Bob's post withdrawal balance should be 0");
        assert.equal(await web3.eth.getBalance(bob), (preBalance1 - gasCost1 + 1), "Bob should have received Ether");

        let preBalance2 = await web3.eth.getBalance(carol);
        let withdrawal2 = await instance.withdraw({ from: carol });
        let tx2 = await web3.eth.getTransaction(withdrawal2.tx);
        let gasCost2 = tx2.gasPrice * withdrawal2.receipt.gasUsed;
        truffleAssert.eventEmitted(withdrawal2, "LogWithdrawal", (ev) => {
            return ev.to === carol && ev.amount == 1;
        });
        assert.equal(await instance.balances(carol, { from: carol }), 0, "Carol's post withdrawal balance should be 0");
        assert.equal(await web3.eth.getBalance(carol), (preBalance2 - gasCost2 + 1), "Carol should have received Ether");
    });

    it("Reverting invalid withdrawals", async () => {
        await truffleAssert.fails(
            instance.withdraw({ from: owner })
        )
    });

    it("Reverting ether send to fallback function", async () => {
        await truffleAssert.fails(
            instance.sendTransaction({ from: owner, value: 1 })
        );
    });
});