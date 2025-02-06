import { createPublicClient, http, defineChain } from "viem";
import {
  mainnet,
  base,
  optimism,
  bsc,
  arbitrum,
  avalanche,
  celo,
  polygon,
  kaia,
  kava,
  cronos,
} from "viem/chains";

export enum ChainId {
  ARBITRUM_ONE = 42161,
  AVALANCHE = 43114,
  BASE = 8453,
  BLAST_MAINNET = 81457,
  BSC = 56,
  CELO = 42220,
  MAINNET = 1,
  MATIC = 137,
  OPTIMISM = 10,
  DIONE = 153153,
  CRONOS = 25,
  KAVA = 2222,
  KAIA = 8217,
}

export const publicClients = {
  1: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  42161: createPublicClient({
    chain: arbitrum,
    transport: http(),
  }),
  43114: createPublicClient({
    chain: avalanche,
    transport: http(),
  }),
  8453: createPublicClient({
    chain: base,
    transport: http(),
  }),
  56: createPublicClient({
    chain: bsc,
    transport: http(),
  }),
  42220: createPublicClient({
    chain: celo,
    transport: http(),
  }),
  137: createPublicClient({
    chain: polygon,
    transport: http(),
  }),
  10: createPublicClient({
    chain: optimism,
    transport: http(),
  }),
  25: createPublicClient({
    chain: cronos,
    transport: http(),
  }),
  2222: createPublicClient({
    chain: kava,
    transport: http(),
  }),
  8217: createPublicClient({
    chain: kaia,
    transport: http(),
  }),
  153153: createPublicClient({
    chain: defineChain({
      name: "Dione",
      rpcUrls: {
        default: {
          http: ['https://node.dioneprotocol.com/ext/bc/D/rpc'],
        },
      },
      id: 153153,
      nativeCurrency: {
        name: "DIONE",
        symbol: "DIONE",
        decimals: 0
      }
    }),
    transport: http(),
  }),
};