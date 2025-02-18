import { 
  MintFactory,   
  StakingFactory,
  stakingClaims,
  stakingDeposits,
  stakingPools,
  stakingWithdraws, 
  teamFinanceTokens
} from "generated";

import {
  fetchTokenDecimals,
  fetchTokenName,
  fetchTokenSymbol,
  fetchTokenTotalSupply,
  getTOkenInfo
} from "../utils/token";
import { publicClients } from "../utils/viem";

import { setTimeout } from "timers/promises";

StakingFactory.Claim.handler(async ({ event, context }) => {
  const entity: stakingClaims = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user.toLocaleLowerCase(),
    amount: event.params.amount,
    poolIndex: event.params.poolIndex,
    address: event.srcAddress.toLocaleLowerCase(),
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp * 1000),
    blockHeight: event.block.number,
    transactionIndex: event.logIndex,
    chainId: event.chainId
  };

  context.stakingClaims.set(entity);
});

StakingFactory.Deposit.handler(async ({ event, context }) => {
  const entity: stakingDeposits = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user.toLocaleLowerCase(),
    amount: event.params.amount,
    poolIndex: event.params.poolIndex,
    address: event.srcAddress.toLocaleLowerCase(),
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp * 1000),
    blockHeight: event.block.number,
    transactionIndex: event.logIndex,
    chainId: event.chainId
  };

  context.stakingDeposits.set(entity);
});

// StakingFactory.PoolCreated.handler(async ({ event, context }) => {
//   const entity: stakingPool = {
//     id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
//     stakingToken: event.params.stakingToken.toLocaleLowerCase(),
//     rewardToken: event.params.rewardToken.toLocaleLowerCase(),
//     startTime: event.params.startTime,
//     endTime: event.params.endTime,
//     precision: event.params.precision,
//     totalReward: event.params.totalReward,
//     txHash: event.transaction.hash,
//     timestamp: BigInt(event.block.timestamp * 1000),
//     blockHeight: event.block.number,
//     transactionIndex: event.logIndex,
//     chainId: event.chainId
//   };

//   context.stakingPool.set(entity);
// });

StakingFactory.Withdraw.handler(async ({ event, context }) => {
  const entity: stakingWithdraws = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user.toLocaleLowerCase(),
    amount: event.params.amount,
    poolIndex: event.params.poolIndex,
    address: event.srcAddress.toLocaleLowerCase(),
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp * 1000),
    blockHeight: event.block.number,
    transactionIndex: event.logIndex,
    chainId: event.chainId
  };

  context.stakingWithdraws.set(entity);
});



MintFactory.MetadataUpdated.handler(async ({ event, context }) => {
  const address = event.srcAddress.toLocaleLowerCase();
  await setTimeout(2000);
  let existingToken = await context.teamFinanceTokens.get(`${event.chainId}_${address}`);
  
  if (existingToken) {
    existingToken = {
      ...existingToken,
      ipfs: event.params.metadata_ipfs_hash
    }
    context.teamFinanceTokens.set(existingToken);
  } 
},
{ wildcard: true },
);

MintFactory.TeamFinanceTokenMint.handler(async ({ event, context }) => {
  
  const address = event.srcAddress.toLocaleLowerCase();

  let existingToken = await context.teamFinanceTokens.get(`${event.chainId}_${address}`);
  
  if (existingToken) {
    existingToken = {
      ...existingToken,
      owner: event.params.owner.toLocaleLowerCase(),
    }
    context.teamFinanceTokens.set(existingToken);
  } else {
    const tokenInfo = await getTOkenInfo(address, event.chainId as keyof typeof publicClients);
    const [decimals, symbol, name, totalSupply] = [tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name, tokenInfo.totalSupply];

    const entity: teamFinanceTokens = { 
      id: `${event.chainId}_${address}`,
      name,
      symbol,
      totalSupply,
      decimals: decimals ?? 0,
      address,
      owner: event.params.owner.toLocaleLowerCase(),
      txHash: event.transaction.hash,
      timestamp: BigInt(event.block.timestamp * 1000),
      blockHeight: event.block.number,
      transactionIndex: event.logIndex,
      ipfs: undefined,
      chainId: event.chainId
    };
    context.teamFinanceTokens.set(entity);
  }
},
{ wildcard: true },
);