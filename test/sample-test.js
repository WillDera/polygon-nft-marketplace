const { expect } = require("chai");
const { ethers } = require("hardhat");

let NFTMarket, Market, marketAddress, NFT, nft, nftContractAddress;

before(async () => {
  NFTMarket = await ethers.getContractFactory("NFTMarket");
  Market = await NFTMarket.deploy();
  marketAddress = Market.address;

  NFT = await ethers.getContractFactory("NFT");
  nft = await NFT.deploy(marketAddress);
  nftContractAddress = nft.address;
});

describe("NFTMarket", function () {
  it("Should deploy and execute market sales", async function () {
    // simulate nft deployment and sale
    await Market.deployed();

    await nft.deployed();

    let listingPrice = await Market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");

    await Market.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await Market.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();
    console.log({ "owner: ": _.address, "buyer:": buyerAddress.address });

    await Market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {
      value: auctionPrice,
    });

    // get unsold nfts on the marketplace
    const unsoldItems = await Market.fetchMarketItems();
    console.log(unsoldItems);

    // get nfts owned by user sending this request
    const userItems = await Market.fetchItemsCreated();
    console.log(userItems);
  });
});
