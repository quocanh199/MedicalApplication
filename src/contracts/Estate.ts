import Web3 from "web3";
import { AbiItem } from "web3-utils/types";
import CONFIG from "../constants/config.json";
import { pinDataToIPFS, pinFileToIPFS } from "../utils/MintFunc";

const mint = async (payload: any, from: string) => {
  try {
    const { web3 } = window as any;
    const { address, image, description } = payload;

    const imageResponse = await pinFileToIPFS(image);
    const contract = new web3.eth.Contract(
      CONFIG.Estate.abi as AbiItem[],
      CONFIG.Estate.address
    );
    const metadata = {
      description,
      image: imageResponse.pinataUrl,
      name: address,
      attributes: [
        {
          trait_type: "Address",
          value: address,
        },
        {
          display_type: "date",
          trait_type: "created",
          value: new Date().getTime() / 1000,
        },
      ],
    };
    const pinataResponse = await pinDataToIPFS(metadata);
    if (!pinataResponse) throw new Error("Metadata not pinned");
    await contract.methods.mint(`${pinataResponse.pinataUrl}`).send({ from });
  } catch (error) {
    console.log(error);
  }
};

const tokenURI = async (payload: any) => {
  const { token } = payload;
  const { web3 } = window as any;
  const contract = new web3.eth.Contract(
    CONFIG.Estate.abi as AbiItem[],
    CONFIG.Estate.address
  );
  const tokenURI = await contract.methods.tokenURI(token).call();
  return tokenURI;
};

export { mint, tokenURI };
