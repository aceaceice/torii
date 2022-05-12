import { calculateFee } from "@cosmjs/stargate";
import { getBalances } from ".";
import ipfs from "../../ipfs";
import getTokenNumber from "../../utils/getTokenNumber";
import {
  IPFS_UPLOAD,
  IPFS_UPLOAD_FAILURE,
  MINT_NFT,
  MINT_NFT_FAILURE,
  MINT_NFT_SUCCESS,
} from "../action-types";
import { getNfts } from "./nftActions";
const IPFS_PREFIX = "ipfs://";
const IPFS_SUFFIX = "/";

export const mintNft = (state, uri) => {
  console.log(process);
  const contract = process.env.REACT_APP_CONTRACT_ADDRESS;
  const { accounts, client, handlers, gas } = state.wallet;
  return async function (dispatch) {
    // SigningCosmWasmClient.execute: async (senderAddress, contractAddress, msg, fee, memo = "", funds)
    if (!accounts) {
      console.warn("Error getting user", accounts);
      return;
    } else if (!accounts.length) {
      console.warn("Error getting user", accounts);
      return;
    }

    // Refresh NFT market to get last minted ID
    // (Tx. might still fail if multiple users try to mint in the same block)

    // Prepare Tx
    let entrypoint = {
      mint: {
        token_id: String(await getTokenNumber(handlers, contract)),
        owner: accounts[0].address,
        token_uri: uri,
        extension: null, // XXX: null prop?
      },
    };

    dispatch({
      type: MINT_NFT,
      payload: { status: true, msg: "Minting NFT..." },
    });
    let txFee = calculateFee(300000, gas.price); // XXX TODO: Fix gas estimation (https://github.com/cosmos/cosmjs/issues/828)
    try {
      // Send Tx
      let tx = await client.execute(
        accounts[0].address,
        contract,
        entrypoint,
        txFee
      );
      dispatch({ type: MINT_NFT_SUCCESS, payload: { status: false, msg: "" } });
      await dispatch(getNfts(handlers, contract));
      if (accounts.length) {
        await dispatch(getBalances(accounts, client));
      }
    } catch (e) {
      console.warn("Error executing mint tx", e);
      dispatch({ type: MINT_NFT_FAILURE, payload: "Error executing mint tx" });
    }
  };
};

export const ipfsUpload = (files, name, description, state) => {
  return async function (dispatch) {
    if (!files.length) {
      console.warn("Nothing to upload to IPFS");
      dispatch({
        type: IPFS_UPLOAD_FAILURE,
        payload: "Nothing to upload to IPFS",
      });
      return;
    }

    dispatch({
      type: IPFS_UPLOAD,
    });
    // this.isMinting = true;

    // Art upload
    const reader = new FileReader();

    let file = files[0];
    reader.readAsDataURL(file);

    reader.onload = async (event) => {
      const image = event.target.result;
      try {
        let uploadResult = await ipfs.upload(image);
        console.log("Successfully uploaded art", [
          uploadResult,
          String(uploadResult.cid),
        ]);

        // Metadata upload (json)
        let ipfsMetadata = { name, description };
        ipfsMetadata.date = new Date().getTime();
        ipfsMetadata.image =
          IPFS_PREFIX + String(uploadResult.cid) + IPFS_SUFFIX;

        let json = JSON.stringify(ipfsMetadata);
        const blob = new Blob([json], { type: "application/json" });
        const jsonReader = new FileReader();
        jsonReader.readAsDataURL(blob);

        jsonReader.onload = async (event) => {
          let jsonUploadTarget = event.target.result;
          let metadataUploadResult = await ipfs.upload(jsonUploadTarget);
          // Mint NFT

          const uri =
            IPFS_PREFIX + String(metadataUploadResult.cid) + IPFS_SUFFIX;
          dispatch(mintNft(state, uri));
        };
      } catch (e) {
        console.error("Error uploading file to IPFS: ", e);
        dispatch({ type: IPFS_UPLOAD_FAILURE });
        return;
      }
    };
    reader.onerror = (e) => {
      console.error("Error uploading file to IPFS: ", e);
      dispatch({ type: IPFS_UPLOAD_FAILURE });
      return;
    };
  };
};
