import "./ConnectButton.css";

const ConnectButton = ({ wallet }) => {
  return (
    <div className="connect">
      {!wallet ? "Connect Wallet" : "arch..." + wallet.slice(-4)}
    </div>
  );
};
export default ConnectButton;
