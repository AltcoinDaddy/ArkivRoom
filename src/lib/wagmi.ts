import { createConfig, http, injected } from "wagmi";
import { CHAIN } from "./constants";

export const wagmiConfig = createConfig({
  chains: [CHAIN],
  connectors: [injected({ shimDisconnect: true })],
  ssr: true,
  transports: {
    [CHAIN.id]: http(CHAIN.rpcUrls.default.http[0]),
  },
});
