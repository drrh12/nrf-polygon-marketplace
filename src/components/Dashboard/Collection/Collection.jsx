import React from "react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftmarketaddress, nftaddress } from "../../../config";

import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function Collection() {
  //Connection to MetaMask
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect wallet");

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
        });
    } else {
      setErrorMessage("Install Metamask");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount.toString());
  };

  const getUserBalance = (address) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      });
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  // End connection with metamask function

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
                <p class="lead">Address: {defaultAccount}</p>
                <p class="lead">Balance: {userBalance}</p>
                <div onClick={connectWalletHandler} class="py-5 text-right">
                  <a href="#" class="btn btn-dark px-5 py-3 text-uppercase">
                    CONNECT TO YOUR WALLET
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            {nfts.map((nft, i) => (
              <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
                <div key={i} class="bg-white rounded shadow-sm">
                  <img src={nft.image} alt="" class="img-fluid card-img-top" />
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
                        <i class="fa fa-picture-o mr-2"></i>
                        <span class="font-weight-bold">{nft.price}</span>
                      </p>
                      <div
                        class="badge badge-danger px-3 rounded-pill font-weight-normal text-black"
                        text-black
                      >
                        Sell
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
