"use client";
import { useAccount, useConnect } from "wagmi";
import { Button } from "./ui/button";
import { Addreth, AddrethConfig } from "addreth";
// import { Addreth, AddrethConfig } from "addreth";

export const Header = () => {
  const { connectors, connect } = useConnect();
  const { isConnected, address, chainId } = useAccount();

  console.log("isConnected", isConnected);
  console.log("address", address);
  console.log("chainId", chainId);
  /*

        */

  if (isConnected && address) {
    return (
      <div className="flex">
        <AddrethConfig theme="simple-light">
          <Addreth address={address} />
        </AddrethConfig>
        <div className="px-2 text-foreground">Connected to Sepolia</div>
      </div>
    );
  } else {
    return (
      <div className="mx-auto">
        <Button
          className="bg-card text-white mx-auto text-center block mb-3 mt-1"
          onClick={function () {
            connect({
              connector: connectors[0],
            });
          }}
        >
          Connect Wallet
        </Button>
      </div>
    );
  }
};
