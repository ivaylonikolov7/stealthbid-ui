import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

/*
todo: env config
*/

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(
      "https://sepolia.infura.io/v3/6062fb6a519c49c58175a9032b67b27e"
    ),
  },
  connectors: [metaMask()],
  ssr: true,
});
