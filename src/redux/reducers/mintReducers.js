import {
  IPFS_UPLOAD,
  IPFS_UPLOAD_SUCCESS,
  MINT_NFT,
  MINT_NFT_FAILURE,
  MINT_NFT_SUCCESS,
  SAVE_METADATA,
} from "../action-types";

const initialState = {
  metadata: {
    tokenId: null,
    uri: null,
    ipfsMetadata: {
      name: null,
      description: null,
      image: null,
      date: null,
    },
  },
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MINT_NFT:
      return { ...state, loading: true, msg: "" };
    case MINT_NFT_SUCCESS:
      return { ...state, loading: false, msg: "Success" };
    case MINT_NFT_FAILURE:
      return { ...state, loading: false, msg: "Failure" };
    case IPFS_UPLOAD:
      return { ...state, loading: true };
    case IPFS_UPLOAD_SUCCESS:
      return { ...state };
    case SAVE_METADATA:
      return { ...state };
    default:
      return state;
  }
};
export default reducer;
