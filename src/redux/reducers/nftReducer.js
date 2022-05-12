import {
  GET_NFTS,
  GET_NFTS_FAILURE,
  GET_NFTS_SUCCESS,
  TRANSTER_NFT,
  TRANSTER_NFT_FAILURE,
  TRANSTER_NFT_SUCCESS,
} from "../action-types";

const initialState = {
  nfts: { user: null, market: { tokens: [] }, metadata: {} },
  loading: { status: false, msg: "" },
  sendLoading: false,
};
const reducer = (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case GET_NFTS:
      return { ...state, loading: payload.loading };
    case GET_NFTS_FAILURE:
      return {};
    case GET_NFTS_SUCCESS:
      return {
        ...state,
        nfts: { ...state.nfts, market: payload.nfts },
        loading: payload.loading,
      };
    case TRANSTER_NFT:
      return { ...state, sendLoading: true, msg: "" };
    case TRANSTER_NFT_SUCCESS:
      return { ...state, sendLoading: false, msg: "Success" };
    case TRANSTER_NFT_FAILURE:
      return { ...state, sendLoading: false, msg: "Failure" };
    default:
      return state;
  }
};

export default reducer;
