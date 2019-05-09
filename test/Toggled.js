const Splitter = artifacts.require("Splitter");
const truffleAssert = require("truffle-assertions");

contract("Testing Toggled features of Splitter contract", accounts => {
    let instance;
    const [owner, alice, bob, carol] = accounts;

    beforeEach("Deploying clean Splitter contract", async () => {
        instance = await Splitter.new({ from: owner });
    });

    it("Fresh contract is active", async () => {
        assert.equal(await instance.getStatus({ from: owner }), true, "Contract should be active");
    });

    it("Owner can pause the contract", async () => {
        let paused = await instance.pauseContract({ from: owner });
        assert.equal(await instance.getStatus({ from: owner }), false, "Contract should be paused");
        truffleAssert.eventEmitted(paused, "LogContractPaused", (ev) => {
            return ev.performedBy === owner;
        });
    });

    it("Owner can resume the contract", async () => {
        await instance.pauseContract({ from: owner });
        let resumed = await instance.resumeContract({ from: owner });
        assert.equal(await instance.getStatus({ from: owner }), true, "Contract should be resumed")
        truffleAssert.eventEmitted(resumed, "LogContractResumed", (ev) => {
            return ev.performedBy === owner;
        });
    });

    it("Non-owner can not pause the contract", async () => {
        await truffleAssert.fails(
            instance.pauseContract({ from: alice })
        );
    });

    it("Non-owner can not resume the contract", async () => {
        await instance.pauseContract({ from: owner });
        await truffleAssert.fails(
            instance.resumeContract({ from: alice })
        );
    });

    it("Splitting ETH reverts while contract is paused", async () => {
        await instance.pauseContract({ from: owner });
        await truffleAssert.fails(
            instance.splitEth(bob, carol, { from: alice, value: 2 })
        );
    });
});