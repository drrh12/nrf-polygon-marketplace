import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";

import { useNavigate } from "react-router-dom";

import { nftaddress, nftmarketaddress } from "../../../config";

//import contracts
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

import "./create.css";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function Create() {
  const [fileUrl, setFileUrl] = useState(null);

  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  let navigate = useNavigate();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function createMarket() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    navigate("/marketplace");
  }

  return (
    <>
      <div className="form-container">
        <form>
          <div class="form-group">
            <label for="exampleInputEmail1">Title:</label>

            <input
              onChange={(e) =>
                updateFormInput({ ...formInput, name: e.target.value })
              }
              // type="name"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter the art name"
            />
          </div>

          <div class="form-group">
            <label for="exampleInputPassword1">Description:</label>

            <input
              onChange={(e) =>
                updateFormInput({ ...formInput, description: e.target.value })
              }
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Enter the description"
            />
          </div>

          <div class="form-group">
            <label for="exampleInputPassword1">Price:</label>

            <input
              onChange={(e) =>
                updateFormInput({ ...formInput, price: e.target.value })
              }
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Enter the price in MATIC"
            />
          </div>

          <div id="upload-file" class="input-group">
            <div class="custom-file">
              <input
                type="file"
                class="custom-file-input"
                id="inputGroupFile04"
                onChange={onChange}
              />
            </div>
          </div>

          <div className="image-div">
            {fileUrl && <img width="100%" alt="nft" src={fileUrl} />}
          </div>
        </form>
        <button id="button" onClick={createMarket} class="btn btn-primary">
          Create
        </button>
      </div>
    </>
  );
}
