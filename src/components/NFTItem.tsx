import React, { CSSProperties } from "react";
import { BASE_URL } from "../constants/config";
import { shortAddress } from "../utils/AddressHelper";

export const NFTItem = (props: any) => {
  const { web3 } = window as any;
  const {
    token,
    showSell,
    onPressCancel,
    onPressBuy,
    onPressBid,
    account,
    isShowButton = true,
  } = props;
  const { owner_of, token_address, token_id, metadata, price } = token;

  const { description, image, name, attributes } = metadata
    ? metadata
    : {
        description: "",
        image: "",
        name: "",
        attributes: [],
      };

  const styleText: CSSProperties = isShowButton
    ? {
        maxWidth: (350 * 3) / 4,
        flexWrap: "wrap",
        wordBreak: "break-all",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }
    : {
        maxWidth: "100%",
      };

  return (
    <>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          marginRight: "5px",
          marginLeft: "5px",
        }}
      >
        <img
          className="rounded"
          style={{
            height: 350,
            width: 350,
          }}
          src={`${BASE_URL}storage/read?key=${image}`}
        />
      </div>
      <div className="ml-2">
        <p />
        <a
          onClick={() => {
            window.open(
              `https://rinkeby.etherscan.io/token/${token_address}?a=${token_id}`
            );
          }}
          className="font-weight-bold text-primary"
          style={{
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
          children={`Contract address: ${shortAddress(
            token_address
          )} - Token ID: ${token_id}`}
        />
        <p />
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                ...styleText,
              }}
            >
              {name}
            </div>
            <div
              style={{
                ...styleText,
                fontWeight: "lighter",
              }}
              children={`${description}`}
            />
            {price > 0 && (
              <div
                style={{
                  ...styleText,
                }}
                className="font-weight-bold text-info"
                children={`${`${parseFloat(
                  web3.utils.fromWei(price, "ether")
                ).toFixed(5)}`} WETH`}
              />
            )}
          </div>
          {isShowButton && (
            <>
              {account == owner_of && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <button
                    className="btn btn-outline-primary"
                    style={{
                      marginRight: 10,
                      marginBottom: 10,
                    }}
                  >
                    Transfer
                  </button>
                  {price == 0 ? (
                    <button
                      onClick={() => showSell(token)}
                      className="btn btn-outline-info"
                      style={{
                        marginRight: 10,
                      }}
                    >
                      Sell
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-danger"
                      style={{
                        marginRight: 10,
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
              {account != owner_of && (
                <>
                  {price == 0 ? (
                    <button
                      className="btn btn-outline-warning"
                      style={{
                        width: 100,
                        marginRight: 10,
                      }}
                    >
                      Bid
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-info"
                      style={{
                        width: 100,
                        marginRight: 10,
                      }}
                    >
                      Buy
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NFTItem;
