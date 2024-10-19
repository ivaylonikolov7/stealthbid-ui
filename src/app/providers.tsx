"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { config } from "../../config";

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
