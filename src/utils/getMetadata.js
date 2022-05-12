import axios from "axios";
import ipfs from "../ipfs";
const getTokenMeta = async (tokenId = false, handlers, contract) => {
  if (!tokenId || typeof tokenId !== "string") {
    console.warn(
      "Invalid token ID. Token ID must be a string, but got " + typeof tokenId
    );
    return;
  }

  let entrypoint = {
    nft_info: {
      token_id: tokenId,
    },
  };

  let query = await handlers.query(contract, entrypoint);

  // Resolve IPFS metadata
  const httpClient = axios.create();
  let ipfsEndpoint = query["token_uri"];
  let httpEndpoint = ipfsEndpoint.replace("ipfs://", ipfs.ipfsGateway);
  let result = await httpClient.get(httpEndpoint);

  if (result.data) {
    if (result.data.image) {
      result.data.image = result.data.image.replace(
        "ipfs://",
        ipfs.ipfsGateway
      );
    }
  }
  entrypoint = {
    owner_of: {
      token_id: tokenId,
    },
  };

  let ownerQuery = await handlers.query(contract, entrypoint);
  if (ownerQuery["owner"]) {
    result.data.owner = ownerQuery.owner;
  }
  if (ownerQuery["approvals"]) {
    result.data.approvals = ownerQuery.approvals;
  }
  return result.data ? result.data : query;
};
export default getTokenMeta;
