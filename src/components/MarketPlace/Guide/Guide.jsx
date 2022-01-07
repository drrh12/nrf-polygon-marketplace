import React from "react";
import "./guide.css";

export default function Guide() {
  return (
    <div className="guide">
      <h1>Welcome to this guide</h1>
      <h4 className="guide-fst-h4">
        Here you will learn how to set-up your wallet and start minting NFTs
      </h4>
      <h4 className="guide-snd-h4">How to create a MetaMask wallet</h4>
      <p>
        The first step it is create a MetaMask wallet. To learn how to create
        this wallet, please refer to this link: <br></br>
        <a href="https://myterablock.medium.com/how-to-create-or-import-a-metamask-wallet-a551fc2f5a6b#:~:text=Click%20on%20the%20MetaMask%20extension,or%20create%20a%20new%20one.&text=Click%20on%20%E2%80%9CCreate%20a%20Wallet,%E2%80%9CNo%20Thanks%E2%80%9D%20to%20proceed.">
          How to create a MetaMask wallet
        </a>
      </p>
      <h4>How to create your first NFT</h4>
      <p>
        Navigate to the /create page and fill all necessary fields, "Title",
        "Description", "Price", upload a GIF or JPEG document and click on
        create.
      </p>
      <img src="" alt="" />
    </div>
  );
}
