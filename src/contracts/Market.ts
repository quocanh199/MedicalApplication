import { AbiItem } from "web3-utils/types";
import CONFIG from "../constants/config.json";

const sell = async (payload: any, from: string) => {
  try {
    const { token, price } = payload;
    const { web3 } = window as any;

    const contractEstate = new web3.eth.Contract(
      CONFIG.Estate.abi as AbiItem[],
      CONFIG.Estate.address
    );

    await contractEstate.methods
      .approve(CONFIG.Market.address, token)
      .send({ from });

    const contractMarket = new web3.eth.Contract(
      CONFIG.Market.abi as AbiItem[],
      CONFIG.Market.address
    );
    await contractMarket.methods
      .openSellToken(token, web3.utils.toWei(price.toString(), "ether"))
      .send({ from });
  } catch (error) {
    console.log(error);
  }
};

const priceOfToken = async (payload: any) => {
  const { token } = payload;
  const { web3 } = window as any;
  const contract = new web3.eth.Contract(
    CONFIG.Market.abi as AbiItem[],
    CONFIG.Market.address
  );
  const price = await contract.methods.priceOfToken(token).call();
  return price;
};

export { sell, priceOfToken };
