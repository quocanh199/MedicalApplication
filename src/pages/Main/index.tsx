/* global BigInt */
import { useEffect, useState } from "react";
import Web3 from "web3"; // Only when using npm/yarn
import logo from "../../assets/images/logo512.png";
import ModalDepositWETH from "../../components/ModalDepositWETH";
import ModalMintNFT from "../../components/ModalMintNFT";
import ModalSellNFT from "../../components/ModalSellNFT";
import ModalTransferNFT from "../../components/ModalTransferNFT";
import ModalWithdrawWETH from "../../components/ModalWithdrawWETH";
import NFTItem from "../../components/NFTItem";
import { LIST_NFT_TYPE, NETWOKR } from "../../constants/config";
import { mint } from "../../contracts/Estate";
import { sell } from "../../contracts/Market";
import { deposit, getBalanceWETH, withdraw } from "../../contracts/Weth";
import { getBalanceAPI, getListNFTAPI } from "../../services";
import { shortAddress } from "../../utils/AddressHelper";
import "./index.css";

const Application = () => {
  const wdx = window as any;

  const [isShowMintNFT, setIsShowMintNFT] = useState(false);
  const [isShowTransferNFT, setIsShowTransferNFT] = useState(false);
  const [isShowSellNFT, setIsShowSellNFT] = useState(false);
  const [isShowWithdraw, setIsShowWithdraw] = useState(false);
  const [isShowDeposit, setIsShowDeposit] = useState(false);
  const [currentTokenSelect, setCurrentTokenSelect] = useState(null);
  const [balance, setBalance] = useState("");
  const [balanceWETH, setBalanceWETH] = useState("");
  const [ownerNFTs, setOwnerNFTs] = useState<any>([]);
  const [marketNFTs, setMarketNFTs] = useState<any>([]);
  const [isLoading, setLoading] = useState(false);
  const [account, setAccount] = useState("");
  const chainId = wdx.ethereum.networkVersion;
  const [isConnect, setIsConnect] = useState(false);

  const getBalance = async () => {
    if (account) {
      try {
        const balance = await getBalanceAPI({
          address: account,
        });
        const { eth, weth } = balance.data;

        setBalance(
          `${parseFloat(wdx.web3.utils.fromWei(eth, "ether")).toFixed(5)}`
        );
        setBalanceWETH(
          `${parseFloat(wdx.web3.utils.fromWei(weth, "ether")).toFixed(5)}`
        );
      } catch (error) {}
    }
  };

  const connectWallet = async () => {
    if (wdx.ethereum) {
      try {
        wdx.web3 = new Web3(wdx.ethereum);
        await wdx.ethereum.enable();
        await switchToNetwork();
        const accounts = await wdx.web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    } else {
      wdx.alert("Please Install MetaMask as a Chrome Extension");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (isConnect) {
      getBalance();
      getOnwerNFTs();
      getMarketNFTs();
    }
  }, [isConnect, account, chainId]);

  const switchToNetwork = async () => {
    const web3 = wdx.web3;
    if (wdx.ethereum.networkVersion != NETWOKR.chainId) {
      try {
        await wdx.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: web3.utils.toHex(NETWOKR.chainId) }],
        });
        setIsConnect(true);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      setIsConnect(true);
    }
  };

  const getOnwerNFTs = async () => {
    if (account) {
      try {
        const response = await getListNFTAPI({
          address: account,
          type: LIST_NFT_TYPE.INCLUDE,
        });
        setOwnerNFTs(response.data);
      } catch (error) {}
    }
  };

  const getMarketNFTs = async () => {
    if (account) {
      try {
        const response = await getListNFTAPI({
          address: account,
          type: LIST_NFT_TYPE.EXCLUDE,
        });
        setMarketNFTs(response.data);
      } catch (error) {}
    }
  };

  const onPressMintNFT = async (
    address: string,
    description: string,
    image: File
  ) => {
    hideMint();
    try {
      setLoading(true);
      if (account)
        await mint(
          {
            address,
            description,
            image,
          },
          account
        );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onPressTransferNFT = async () => {
    hideTransfer();
  };

  const onPressSellNFT = async (tokenId: number, price: number) => {
    hideSell();
    try {
      setLoading(true);
      if (account) {
        await sell(
          {
            token: tokenId,
            price,
          },
          account
        );
        await getBalanceWETH(account);
        await getBalance();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onPressWithdraw = async (amount: number) => {
    hideWithdraw();
    try {
      setLoading(true);
      if (account) {
        await withdraw(amount, account);
        await getBalanceWETH(account);
        await getBalance();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onPressDeposit = async (amount: number) => {
    hideDeposit();
    try {
      setLoading(true);
      if (account) {
        await deposit(amount, account);
        await getBalanceWETH(account);
        await getBalance();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onPressBid = async (tokenId: number, price: number) => {};
  const onPressBuy = async (tokenId: number, price: number) => {};

  const onPressCancel = async (tokenId: number) => {};
  const showMint = () => {
    setIsShowMintNFT(true);
  };

  const hideMint = () => {
    setIsShowMintNFT(false);
  };

  const showTransfer = (token: any) => {
    setIsShowTransferNFT(true);
    setCurrentTokenSelect(token);
  };

  const hideTransfer = () => {
    setIsShowTransferNFT(false);
    setCurrentTokenSelect(null);
  };

  const showSell = (token: any) => {
    setIsShowSellNFT(true);
    setCurrentTokenSelect(token);
  };

  const hideSell = () => {
    setIsShowSellNFT(false);
    setCurrentTokenSelect(null);
  };

  const showWithdraw = () => {
    setIsShowWithdraw(true);
  };

  const hideWithdraw = () => {
    setIsShowWithdraw(false);
  };

  const showDeposit = () => {
    setIsShowDeposit(true);
  };

  const hideDeposit = () => {
    setIsShowDeposit(false);
  };

  return (
    <div className="App">
      <ModalWithdrawWETH
        isShow={isShowWithdraw}
        onSubmit={onPressWithdraw}
        onClose={hideWithdraw}
      />
      <ModalDepositWETH
        isShow={isShowDeposit}
        onSubmit={onPressDeposit}
        onClose={hideDeposit}
      />
      <ModalMintNFT
        isShow={isShowMintNFT}
        onSubmit={onPressMintNFT}
        onClose={hideMint}
      />
      <ModalTransferNFT
        isShow={isShowTransferNFT}
        onSubmit={onPressTransferNFT}
        onClose={hideTransfer}
        token={currentTokenSelect}
      />
      <ModalSellNFT
        isShow={isShowSellNFT}
        onSubmit={onPressSellNFT}
        onClose={hideSell}
        token={currentTokenSelect}
      />
      <span> </span>
      <nav className="navbar navbar-dark fixed-top bg-light flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0 text-secondary"
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        >
          <img
            src={logo}
            style={{
              height: 40,
              marginRight: "15px",
            }}
          />
          Real Esatet Marketplace
        </a>

        <ul className="navbar-nav px-3">
          {isConnect && account ? (
            <li
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <button
                onClick={showDeposit}
                style={{
                  marginRight: "10px",
                }}
                className="btn btn-outline-primary"
              >
                Deposit WETH
              </button>
              <button
                onClick={showWithdraw}
                style={{
                  marginRight: "10px",
                }}
                className="btn btn-outline-info"
              >
                Withdraw WETH
              </button>
              <button
                style={{
                  marginRight: "10px",
                }}
                onClick={showMint}
                className="btn btn-success"
              >
                Mint
              </button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "250px",
                }}
                className="text-secondary"
              >
                <span children={`Address: ${shortAddress(account)}`} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                    className="text-primary"
                  >
                    {balance} ETH
                  </span>
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                    className="text-info"
                  >
                    {balanceWETH} WETH
                  </span>
                </div>
              </div>
            </li>
          ) : (
            <button onClick={connectWallet} className="btn-3">
              Connect Wallet
            </button>
          )}
        </ul>
      </nav>
      {!!isLoading && (
        <div className="overlay">
          <div className="overlayDoor"></div>
          <div className="overlayContent">
            <div className="loader">
              <div className="inner"></div>
            </div>
          </div>
        </div>
      )}
      <h1
        style={{
          marginTop: 80,
        }}
        id="title"
      >
        Owner NFT
      </h1>
      <div style={{ flexDirection: "row", display: "flex" }}>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            overflowY: "scroll",
          }}
        >
          {ownerNFTs.map((house: any, idx: number) => (
            <div
              key={idx}
              style={{
                marginTop: 30,
                flexDirection: "column",
                display: "flex",
                width: 380,
              }}
            >
              <NFTItem
                showSell={showSell}
                showTransfer={showTransfer}
                onPressCancel={onPressCancel}
                token={house}
              />
              <div
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  display: "flex",
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 4 }}>
        <h1 style={{ marginTop: 30 }} id="title">
          Market
        </h1>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            flexWrap: "wrap",
            wordBreak: "break-all",
          }}
        >
          {marketNFTs.map((house: any, idx: number) => (
            <div
              key={idx}
              style={{
                marginTop: 30,
              }}
            >
              <NFTItem
                onPressBuy={onPressBuy}
                onPressBid={onPressBid}
                token={house}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Application;
