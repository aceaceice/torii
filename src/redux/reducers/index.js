import { combineReducers } from "redux";
import walletReducer from "./walletReducer";
import nftReducer from "./nftReducer";
import mintReducer from "./mintReducers";
const reducers = combineReducers({
  wallet: walletReducer,
  nft: nftReducer,
  mint: mintReducer,
});

export default reducers;
