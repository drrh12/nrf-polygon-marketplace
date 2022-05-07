import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../../config";

import { Link, Routes, Route } from "react-router-dom";

// import contracts
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import Guide from "../MarketPlace/Guide/Guide";
import ethlogo from "../../assets/logo/eth-logo.svg";
import loader from "../../assets/logo/loader.svg";
import matic from "../../assets/logo/matic.svg";

import { ethers } from "ethers";

import "./marketplace.css";

export default function MarketPlace() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  // https://polygon-mumbai.g.alchemy.com/v2/eOTbogfhcv54R1mVigmdzOBHG86jyh1P
  // https://polygon-mumbai.g.alchemy.com/v2/vghaROHuGEOW7A8FyLT3qdaFpPuQSC1S

  async function loadNFTs() {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/eOTbogfhcv54R1mVigmdzOBHG86jyh1P"
    );

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  }

  if (loadingState === "not-loaded" && !nfts.length)
    return <img class="rounded mx-auto d-block" src={loader} />;

  return (
    <>
      <div class="container-fluid">
        <div class="px-lg-5" id="market-container">
          <div class="row py-5">
            <div class="col-lg-12 mx-auto">
              <div class="text-black p-5 shadow-sm rounded banner">
                {/* <h3 class="display-10">
                  Thank you for reaching to this project
                </h3> */}
                <p class="lead">NFT Amount:</p>
                <p class="lead">Market Volume:</p>
                <Link
                  to="/guide"
                  class="btn btn-warning px-5 py-2 text-uppercase"
                >
                  GUIDE
                </Link>
              </div>
            </div>
          </div>

          <div class="row">
            {nfts.map((nft, i) => (
              <div key={i} class="col-xl-3 col-lg-4 col-md-6 mb-4">
                <div class="bg-white rounded shadow-sm">
                  <img
                    src={nft.image}
                    alt="nft"
                    class="img-fluid card-img-top"
                  />
                  <div class="p-4">
                    <h5>
                      {" "}
                      <a href="#" class="text-dark">
                        {nft.name}
                      </a>
                    </h5>
                    <p class="small text-muted mb-0">{nft.description}</p>
                    <div class="d-flex align-items-center justify-content-between rounded-pill bg-light px-3 py-2 mt-4">
                      <p class="small mb-0">
                        <i class="fa fa-picture-o mr-2">
                          <img src={matic} width={"30px"} alt="logo" />{" "}
                        </i>
                        <span class="font-weight-bold">{nft.price}</span>
                      </p>
                      <div
                        onClick={() => buyNft(nft)}
                        class="badge badge-danger px-3 rounded-pill font-weight-normal text-black"
                      >
                        BUY
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* <div class="py-5 text-right">
            <a href="#" class="btn btn-dark px-5 py-3 text-uppercase">
              Show me more
            </a>
          </div> */}
        </div>
      </div>
    </>
  );
}
