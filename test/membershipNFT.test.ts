import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { deployContract, MockProvider, solidity } from "ethereum-waffle";
import { BigNumber, ethers } from "ethers";
import MembershipNFT from "../built-test-contracts/MembershipNFT.json";
import { MembershipNFT as MembershipNFTType } from "../typechain-types/MembershipNFT";

use(solidity);
use(chaiAsPromised);

describe("Membership NFT", () => {
  const [admin, customer1, customer2] = new MockProvider().getWallets();
  let instance: MembershipNFTType;

  beforeEach(async () => {
    instance = (await deployContract(admin, MembershipNFT, [
      "testName",
      "testSymbol",
    ])) as MembershipNFTType;
  });

  describe("Instantiation", () => {
    it("Deploys to an address", async () => {
      expect(instance.address).not.to.be.undefined;
    });

    it("Has the correct max supply", async () => {
      const maxPublicMint = await instance.MAX_PUBLIC_MINT();
      expect(maxPublicMint).to.equal(5);
    });

    it("Has the correct name and symbol", async () => {
      const name = await instance.name();
      const symbol = await instance.symbol();
      expect(name).to.equal("testName");
      expect(symbol).to.equal("testSymbol");
    });
  });

  describe("Whitelist", () => {
    it("Can add an address to the whitelist", async () => {
      const whitelist = [customer1.address];
      await instance.setAllowList(whitelist, 1);
      const customer1AllowedAmount = await instance.numAvailableToMint(
        customer1.address
      );
      expect(customer1AllowedAmount).to.equal(1);
      const customer2AllowedAmount = await instance.numAvailableToMint(
        customer2.address
      );
      expect(customer2AllowedAmount).to.equal(0);
    });

    it("Can toggle the whitelist", async () => {
      let isAllowListOpen = await instance.isAllowListActive();
      expect(isAllowListOpen).to.equal(false, "AllowList should start closed");
      await instance.setIsAllowListActive(true);
      isAllowListOpen = await instance.isAllowListActive();
      expect(isAllowListOpen).to.equal(true, "AllowList should be toggle-able");
    });
  });

  describe("Minting Tokens", () => {
    it("Fails to mint more tokens than are whitelisted for an address", async () => {
      await instance.setIsAllowListActive(true);
      await instance.setAllowList([customer1.address], 1);
      /** Customer 1 tries to mint 5 tokens */
      expect(
        instance.connect(customer1).mintAllowList(5, {
          value: ethers.utils.parseEther(".123"),
        })
      ).to.eventually.be.rejected;
    });
    it("Mints the correct number of tokens from allowlist", async () => {
      await instance.setIsAllowListActive(true);
      await instance.setAllowList([customer1.address], 1);
      await instance.setAllowList([customer2.address], 2);

      /** Customer 1 tries to mint 5 tokens */
      await instance.connect(customer1).mintAllowList(1, {
        value: ethers.utils.parseEther(".123"),
      });

      let numTokens = await instance.balanceOf(customer1.address);
      expect(numTokens).to.equal(1);

      /** Customer 1 tries to mint 5 tokens */
      await instance.connect(customer2).mintAllowList(2, {
        value: ethers.utils.parseEther(".246"),
      });
      numTokens = await instance.balanceOf(customer2.address);
      expect(numTokens).to.equal(2);
    });
  });

  describe("Transferring Tokens", () => {
    let customer1TokenId: BigNumber;
    beforeEach(async () => {
      await instance.setSaleState(true);
      await instance.connect(customer1).mint(1, {
        value: ethers.utils.parseEther(".123"),
      });
      customer1TokenId = await instance.tokenOfOwnerByIndex(
        customer1.address,
        0
      );
    });

    it("Initially is owned by customer 1", async () => {
      const owner = await instance.ownerOf(customer1TokenId);
      expect(owner).to.equal(customer1.address);
    });
    it("Cannot be transferred by default", async () => {
      expect(
        instance
          .connect(customer1)
          .transferFrom(customer1.address, customer2.address, customer1TokenId)
      ).to.be.eventually.rejected;
    });
    it("Can be transferred if modified", async () => {
      await instance.setTransferrable([customer1TokenId], true);
      await instance
        .connect(customer1)
        .transferFrom(customer1.address, customer2.address, customer1TokenId);
      const owner = await instance.ownerOf(customer1TokenId);
      expect(owner).to.equal(customer2.address);
    });
  });
});
