import React from "react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftmarketaddress, nftaddress } from "../../../config";

import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function Collection() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchMyNFTs();

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
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1>No assets owned</h1>;

  return (
    <>
      <div class="container-fluid">
        <div class="px-lg-5">
          <div class="row py-5">
            <div class="col-lg-12 mx-auto">
              <div class="text-black p-5 shadow-sm rounded banner">
                {/* <h1 class="display-4">Address:</h1> */}
                <p class="lead">Address:</p>
                <p class="lead">Balance:</p>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
              <div class="bg-white rounded shadow-sm">
                <img
                  src="https://bootstrapious.com/i/snippets/sn-gallery/img-1.jpg"
                  alt=""
                  class="img-fluid card-img-top"
                />
                <div class="p-4">
                  <h5>
                    {" "}
                    <a href="#" class="text-dark">
                      Red paint cup
                    </a>
                  </h5>
                  <p class="small text-muted mb-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit
                  </p>
                  <div class="d-flex align-items-center justify-content-between rounded-pill bg-light px-3 py-2 mt-4">
                    <p class="small mb-0">
                      <i class="fa fa-picture-o mr-2"></i>
                      <span class="font-weight-bold">JPG</span>
                    </p>
                    <div class="badge badge-danger px-3 rounded-pill font-weight-normal">
                      New
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
              <div class="bg-white rounded shadow-sm">
                <img
                  src="https://bootstrapious.com/i/snippets/sn-gallery/img-2.jpg"
                  alt=""
                  class="img-fluid card-img-top"
                />
                <div class="p-4">
                  <h5>
                    {" "}
                    <a href="#" class="text-dark">
                      Blorange
                    </a>
                  </h5>
                  <p class="small text-muted mb-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit
                  </p>
                  <div class="d-flex align-items-center justify-content-between rounded-pill bg-light px-3 py-2 mt-4">
                    <p class="small mb-0">
                      <i class="fa fa-picture-o mr-2"></i>
                      <span class="font-weight-bold">PNG</span>
                    </p>
                    <div class="badge badge-primary px-3 rounded-pill font-weight-normal">
                      Trend
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="py-5 text-right">
            <a href="#" class="btn btn-dark px-5 py-3 text-uppercase">
              Show me more
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

{
  /* <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="rounded" />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} Eth
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div> */
}

{
  /* <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="rounded" />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} Eth
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div> */
}
