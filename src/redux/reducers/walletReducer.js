import {
  CONNECT_WALLET,
  CONNECT_WALLET_FAILURE,
  CONNECT_WALLET_SUCCESS,
  UPDATE_BALANCES,
  UPDATE_BALANCES_FAILURE,
  UPDATE_BALANCES_SUCCESS,
} from "../action-types";

const initialState = {
  accounts: null,
  loading: false,
  error: "",
  client: null,
  balanceError: "",
  balanceLoading: false,
};

const reducer = (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case CONNECT_WALLET:
      return { ...state, loading: true, error: "" };
    case CONNECT_WALLET_SUCCESS:
      return {
        accounts: payload.accounts,
        client: payload.client,
        handlers: payload.handlers,
        gas: payload.gas,
        loading: false,
        error: "",
      };
    case CONNECT_WALLET_FAILURE:
      return { ...state, loading: false, error: payload.error };
    case UPDATE_BALANCES:
      return { ...state, balanceLoading: true, balanceError: "" };
    case UPDATE_BALANCES_SUCCESS:
      return {
        ...state,
        accounts: payload.accounts,
        balanceLoading: false,
        balanceError: "",
      };
    case UPDATE_BALANCES_FAILURE:
      return {
        ...state,
        balanceLoading: false,
        balanceError: payload.error,
      };
    default:
      return state;
  }
};

export default reducer;
