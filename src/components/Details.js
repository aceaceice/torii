import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { transferNft } from "../redux/action-creators/nftActions";
import "./Details.css";
const Details = (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { name, description, id, owner, image } = props.item;
  const [input, setInput] = useState({ status: false, input: "" });
  const activateInput = () => {
    setInput({ status: true, input: "" });
  };
  return (
    <div className="background">
      <div className="card">
        <svg
          onClick={() => {
            props.close();
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          height="24px"
          width="24px"
          viewBox="0 0 24 24"
          className="close"
        >
          <path
            d="M18 6L6 18M18 18L6 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
        <img src={image}></img>
        <p className="detail-name">{name}</p>
        <p className="detail-desc">{description}</p>
        <p className="detail-owned">Owned by {owner}</p>
        {input.status ? (
          <form className="form">
            {state.nft.sendLoading ? (
              <div className="send-loading">Loading...</div>
            ) : (
              <div className="send-loading">{state.nft.msg}</div>
            )}
            <input
              className="detail-input"
              value={input.value}
              onChange={(e) => {
                setInput({ status: true, input: e.target.value });
              }}
            />
            <a
              className="btn send act"
              onClick={() => {
                dispatch(transferNft(input.input, id, state));
              }}
            >
              Send
            </a>
          </form>
        ) : state.wallet.accounts[0].address === owner ? (
          <a
            className="btn send inact"
            onClick={() => {
              activateInput();
            }}
          >
            Send
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Details;
