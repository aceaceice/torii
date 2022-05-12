import {
  GET_NFTS,
  GET_NFTS_SUCCESS,
  TRANSTER_NFT,
  TRANSTER_NFT_FAILURE,
  TRANSTER_NFT_SUCCESS,
} from "../action-types";
import getTokenMeta from "../../utils/getMetadata";
import { calculateFee } from "@cosmjs/stargate";
import { getBalances } from ".";
export const getNfts = (handlers) => {
  const contract = process.env.REACT_APP_CONTRACT_ADDRESS;
  return async function (dispatch) {
    let entrypoint = {
      all_tokens: {},
    };
    dispatch({
      type: GET_NFTS,
      payload: {
        loading: {
          status: true,
          msg: "Loading all NFTs of contract " + contract + "...",
        },
      },
    });
    let query = await handlers.query(contract, entrypoint);
    for (let i = 0; i < query.tokens.length; i++) {
      let id = query.tokens[i];
      let data = await getTokenMeta(id, handlers, contract);
      let resolvedMetadata = data;
      resolvedMetadata.id = id;
      query.tokens[i] = resolvedMetadata;
    }
    dispatch({
      type: GET_NFTS_SUCCESS,
      payload: { nfts: query, loading: { status: false, msg: "" } },
    });
  };
};

export const transferNft = (recipient = null, tokenId = null, state) => {
  return async function (dispatch) {
    const contract = process.env.REACT_APP_CONTRACT_ADDRESS;
    const { accounts, client, handlers, gas } = state.wallet;
    // SigningCosmWasmClient.execute: async (senderAddress, contractAddress, msg, fee, memo = "", funds)
    if (!accounts) {
      console.warn("Error getting user", accounts);
      return;
    } else if (!accounts.length) {
      console.warn("Error getting user", accounts);
      return;
    } else if (!tokenId || !recipient) {
      console.warn(
        "Nothing to transfer (check token ID and recipient address)",
        { token_id: tokenId, recipient: recipient }
      );
      return;
    }
    // Prepare Tx
    let entrypoint = {
      transfer_nft: {
        recipient: recipient,
        token_id: tokenId,
      },
    };
    // this.isSending = true;
    dispatch({
      type: TRANSTER_NFT,
      payload: "Transferring NFT to " + recipient + "...",
    });

    let txFee = calculateFee(300000, gas.price); // XXX TODO: Fix gas estimation (https://github.com/cosmos/cosmjs/issues/828)
    // Send Tx
    try {
      let tx = await client.execute(
        accounts[0].address,
        contract,
        entrypoint,
        txFee
      );
      dispatch({ type: TRANSTER_NFT_SUCCESS });

      await dispatch(getNfts(handlers, contract));
      if (accounts.length) {
        await dispatch(getBalances(accounts, client));
      }
    } catch (e) {
      console.warn("Error executing NFT transfer", e);
      dispatch({ type: TRANSTER_NFT_FAILURE });
    }
  };
};
