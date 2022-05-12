import React, { useRef, useState } from "react";
import { ipfsUpload } from "../redux/action-creators/mintActions";
import "./MintingInterface.css";
const MintingPage = ({ dispatch, state }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const fileInput = useRef(null);
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(ipfsUpload(fileInput.current.files, name, desc, state));
  };
  return (
    <div className="minting-interface">
      <form onSubmit={onSubmit} className="minting-form">
        <input type="file" ref={fileInput} class="custom-file-input"></input>
        <div>Name</div>
        <input
          className="nft-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>Description</div>
        <input
          className="nft-input"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        {state.mint.loading ? (
          <div className="mint-loading">Loading...</div>
        ) : (
          ""
        )}
        <a
          type="sumbit"
          className="connect mint-nft"
          onClick={() => {
            dispatch(ipfsUpload(fileInput.current.files, name, desc, state));
          }}
        >
          Mint
        </a>
        <div className="msg">{state.mint.msg}</div>
      </form>
    </div>
  );
};
export default MintingPage;
