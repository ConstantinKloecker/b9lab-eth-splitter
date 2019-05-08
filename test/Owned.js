const Splitter = artifacts.require("Splitter");
const truffleAssert = require("truffle-assertions");

contract("Testing Owned features of Splitter contract", accounts => {
    let owner;
    let alice;
    let instance;

    beforeEach("Deploying clean Splitter contract", async () => {
        [owner, alice] = accounts;
        instance = await Splitter.new({ from: owner });
    });

    it("Deployer is contract owner", async () => {
        assert.equal(await instance.getOwner({ from: owner }), owner, "Deployer should be the owner");
    });

    it("Owner can transfer ownership", async () => {
        let ownership = await instance.changeOwner(alice, { from: owner });
        assert.equal(await instance.getOwner({ from: alice }), alice, "Alice should be the new owner");
        truffleAssert.eventEmitted(ownership, "LogOwnerChanged", (ev) => {
            return ev.oldOwner === owner && ev.newOwner === alice;
        });
    });

    it("Non-owner can not transfer ownership", async () => {
        await truffleAssert.fails(
            instance.changeOwner(alice, { from: alice })
        );
    });
});