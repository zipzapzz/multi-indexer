import { 
  MintFactory,   
  StakingFactory,
  StakingClaim,
  StakingDeposit,
  StakingPool,
  StakingWithdraw, 
  teamFinanceTokens
} from "generated";

import {
  fetchTokenDecimals,
  fetchTokenName,
  fetchTokenSymbol,
  fetchTokenTotalSupply,
} from "../utils/token";
import { publicClients } from "../utils/viem";

StakingFactory.Claim.handler(async ({ event, context }) => {
  const entity: StakingClaim = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user.toLocaleLowerCase(),
    amount: event.params.amount,
    poolIndex: event.params.poolIndex,
    address: event.srcAddress.toLocaleLowerCase(),
    hash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp * 1000),
    blockHeight: event.block.number,
    transactionIndex: event.logIndex,
    chainId: event.chainId
  };

  context.StakingClaim.set(entity);
});

StakingFactory.Deposit.handler(async ({ event, context }) => {
  const entity: StakingDeposit = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user.toLocaleLowerCase(),
    amount: event.params.amount,
    poolIndex: event.params.poolIndex,
    address: event.srcAddress.toLocaleLowerCase(),
    hash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp * 1000),
    blockHeight: event.block.number,
    transactionIndex: event.logIndex,
    chainId: event.chainId
  };

  context.StakingDeposit.set(entity);
});

StakingFactory.PoolCreated.handler(async ({ event, context }) => {
  const entity: StakingPool = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    stakingToken: event.params.stakingToken.toLocaleLowerCase(),
    rewardToken: event.params.rewardToken.toLocaleLowerCase(),
    startTime: event.params.startTime,
    endTime: event.params.endTime,
    precision: event.params.precision,
    totalReward: event.params.totalReward,
    hash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp * 1000),
    blockHeight: event.block.number,
    transactionIndex: event.logIndex,
    chainId: event.chainId
  };

  context.StakingPool.set(entity);
});

StakingFactory.Withdraw.handler(async ({ event, context }) => {
  const entity: StakingWithdraw = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user.toLocaleLowerCase(),
    amount: event.params.amount,
    poolIndex: event.params.poolIndex,
    address: event.srcAddress.toLocaleLowerCase(),
    hash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp * 1000),
    blockHeight: event.block.number,
    transactionIndex: event.logIndex,
    chainId: event.chainId
  };

  context.StakingWithdraw.set(entity);
});

MintFactory.TeamFinanceTokenMint.handler(async ({ event, context }) => {
  const [decimals, symbol, name, totalSupply] = await Promise.all([
    fetchTokenDecimals(
      event.srcAddress,
      event.chainId as keyof typeof publicClients
    ),
    fetchTokenSymbol(
      event.srcAddress,
      event.chainId as keyof typeof publicClients
    ),
    fetchTokenName(
      event.srcAddress,
      event.chainId as keyof typeof publicClients
    ),
    fetchTokenTotalSupply(
      event.srcAddress,
      event.chainId as keyof typeof publicClients
    ),
  ]);
  const entity: teamFinanceTokens = { 
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    name,
    symbol,
    totalSupply,
    decimals: decimals ?? 0,
    address: event.srcAddress.toLocaleLowerCase(),
    owner: event.params.owner.toLocaleLowerCase(),
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp * 1000),
    blockHeight: event.block.number,
    transactionIndex: event.logIndex,
    chainId: event.chainId
  };
  context.teamFinanceTokens.set(entity);
},
{ wildcard: true },
);