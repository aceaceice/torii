import {
  CONNECT_WALLET,
  CONNECT_WALLET_FAILURE,
  CONNECT_WALLET_SUCCESS,
  UPDATE_BALANCES,
  UPDATE_BALANCES_FAILURE,
  UPDATE_BALANCES_SUCCESS,
} from "../action-types";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { ConstantineInfo } from "../../chain.info.constantine";

export const connectWallet = () => {
  return async function (dispatch) {
    dispatch({ type: CONNECT_WALLET });
    const RPC = ConstantineInfo.rpc;
    try {
      if (window) {
        if (window["keplr"]) {
          if (window.keplr["experimentalSuggestChain"]) {
            await window.keplr.experimentalSuggestChain(ConstantineInfo);
            await window.keplr.enable(ConstantineInfo.chainId);
            const offlineSigner = await window.getOfflineSigner(
              ConstantineInfo.chainId
            );
            const wasmClient = await SigningCosmWasmClient.connectWithSigner(
              RPC,
              offlineSigner
            );

            const accounts = await offlineSigner.getAccounts();
            // Query ref.
            const handlers = {
              query: await wasmClient.queryClient.wasm.queryContractSmart,
            }; // Gas
            const gas = { price: await GasPrice.fromString("0.002uconst") };
            // Debug
            // Constantine account balances ('uconst')
            if (accounts.length) {
              // await getBalances();
              dispatch(getBalances(accounts, wasmClient));
            }
            localStorage.setItem("wallet", accounts[0].address);
            localStorage.setItem("client", JSON.stringify(wasmClient));
            await localStorage.setItem("handlers", JSON.stringify(handlers));
            dispatch({
              type: CONNECT_WALLET_SUCCESS,
              payload: {
                accounts,
                client: wasmClient,
                handlers,
                gas,
              },
            });
            // User and market NFTs
            // await this.loadNfts();
          } else {
            console.warn(
              "Error access experimental features, please update Keplr"
            );
            return {
              type: CONNECT_WALLET_FAILURE,
              payload: {
                error:
                  "Error access experimental features, please update Keplr",
              },
            };
          }
        } else {
          console.warn("Error accessing Keplr");
          return {
            type: CONNECT_WALLET_FAILURE,
            payload: { error: "Error accessing Keplr" },
          };
        }
      } else {
        console.warn("Error parsing window object");
        return {
          type: CONNECT_WALLET_FAILURE,
          payload: { error: "Error parsing window object" },
        };
      }
    } catch (e) {
      console.error("Error connecting to wallet", e);
      return {
        type: CONNECT_WALLET_FAILURE,
        payload: { error: "Error connecting to wallet" },
      };
    }
  };
};

export const getBalances = (accounts, client) => {
  return async function (dispatch) {
    if (!ConstantineInfo) {
      return;
    } else if (!ConstantineInfo["chainName"]) {
      return;
    } else if (!ConstantineInfo["currencies"]) {
      return;
    } else if (!ConstantineInfo.currencies.length) {
      return;
    }
    dispatch({
      type: UPDATE_BALANCES,
    });
    if (accounts) {
      if (accounts.length) {
        for (let i = 0; i < accounts.length; i++) {
          if (accounts[i]["address"]) {
            try {
              const balance = await client.getBalance(
                accounts[i].address,
                ConstantineInfo.currencies[0].coinMinimalDenom
              );
              const balances = accounts.map((item, index) =>
                index === i ? { ...item, balance: balance } : item
              );
              dispatch({
                type: UPDATE_BALANCES_SUCCESS,
                payload: { accounts: balances },
              });
            } catch (e) {
              console.warn("Error reading account address", [
                String(e),
                accounts[i],
              ]);
              dispatch({
                type: UPDATE_BALANCES_FAILURE,
                payload: {
                  error: "Error reading account address",
                },
              });
              return;
            }
          } else {
            console.warn(
              "Failed to resolve account address at index " + i,
              accounts[i]
            );
          }
        }
      } else {
        dispatch({
          type: UPDATE_BALANCES_FAILURE,
          payload: { error: "Failed to resolve Keplr wallet" },
        });
        console.warn("Failed to resolve Keplr wallet");
      }
    } else {
      dispatch({
        type: UPDATE_BALANCES_FAILURE,
        payload: { error: "Failed to resolve Keplr wallet" },
      });
      console.warn("Failed to resolve Keplr wallet");
    }
  };
};
