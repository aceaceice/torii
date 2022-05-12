const getTokenNumber = async (handlers, contract) => {
  let entrypoint = {
    all_tokens: {},
  };
  let query = await handlers.query(contract, entrypoint);
  return query.tokens.length;
};

export default getTokenNumber;
