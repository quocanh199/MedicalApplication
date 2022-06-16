import Web3 from "web3";
import { AbiItem } from "web3-utils/types";
import CONFIG from "../constants/config.json";
const deposit = async (value: number, from: string) => {
  const { web3 } = window as any;

  const contract = new web3.eth.Contract(
    CONFIG.WrapETH.abi as AbiItem[],
    CONFIG.WrapETH.address
  );
  await contract.methods
    .deposit()
    .send({ from, value: web3.utils.toWei(value.toString(), "ether") });
};

const withdraw = async (value: number, from: string) => {
  const { web3 } = window as any;
  const contract = new web3.eth.Contract(
    CONFIG.WrapETH.abi as AbiItem[],
    CONFIG.WrapETH.address
  );
  await contract.methods
    .withdraw(web3.utils.toWei(value.toString(), "ether"))
    .send({ from });
};

const getBalanceWETH = async (from: string) => {
  const { web3 } = window as any;
  const contract = new web3.eth.Contract(
    CONFIG.WrapETH.abi as AbiItem[],
    CONFIG.WrapETH.address
  );
  const balance = await contract.methods.balanceOf(from).call();
  return balance;
};

export { deposit, withdraw, getBalanceWETH };
