import { 
  MintFactory,   
  StakingFactory,
  stakingClaims,
  stakingDeposits,
  stakingPools,
  stakingWithdraws, 
  teamFinanceTokens,
  LockContract,
  deposits,
  depositNfts,
  depositDetail,
  logNftWithdrawals,
  logTokenWithdrawals
} from "generated";

import {
  getTokenInfo
} from "../utils/token";
import {
  getDepositDetail
} from "../utils/lock";

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

StakingFactory.PoolCreated.handler(async ({ event, context }) => {
  // const entity: stakingPools = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   stakingToken: event.params.stakingToken.toLocaleLowerCase(),
  //   rewardToken: event.params.rewardToken.toLocaleLowerCase(),
  //   startTime: event.params.startTime,
  //   endTime: event.params.endTime,
  //   precision: event.params.precision,
  //   totalReward: event.params.totalReward,
  //   txHash: event.transaction.hash,
  //   timestamp: BigInt(event.block.timestamp * 1000),
  //   blockHeight: event.block.number,
  //   transactionIndex: event.logIndex,
  //   chainId: event.chainId,
  //   poolIndex: undefined,
  //   rewardTokenInfo_id: undefined,
  //   stakingContract: undefined,
  //   stakingTokenInfo_id: undefined,
  //   user: undefined
  // };

  // context.stakingPools.set(entity);
});

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
    const tokenInfo = await getTokenInfo(address, event.chainId as keyof typeof publicClients);
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

LockContract.Deposit.handler(async ({ event, context }) => {
  const tokenAddress = event.params.tokenAddress.toLocaleLowerCase();
  let existingToken = await context.token.get(`${event.chainId}_${tokenAddress}`);
  if (!existingToken) {
    const tokenInfo = await getTokenInfo(tokenAddress, event.chainId as keyof typeof publicClients);
    const [decimals, symbol, name, totalSupply] = [tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name, tokenInfo.totalSupply];

    existingToken = {
      id: `${event.chainId}_${tokenAddress}`,
      name,
      symbol,
      totalSupply,
      decimals: decimals ?? 0,
      address: tokenAddress,
      chainId: event.chainId
    };
    context.token.set(existingToken);
  }

  let depositDetail = await context.depositDetail.get(`${event.chainId}_${event.params.id}`);
  if (!depositDetail) {
    const depositDetailData = await getDepositDetail(event.srcAddress, event.params.id, event.chainId as keyof typeof publicClients);
    const entity: depositDetail = {
      id: `${event.chainId}_${event.params.id}`,
      chainId: event.chainId,
      tokenAddress: depositDetailData._tokenAddress.toLocaleLowerCase(),
      withdrawalAddress: depositDetailData._withdrawalAddress.toLocaleLowerCase(),
      tokenAmount: depositDetailData._tokenAmount,
      unlockTime:  depositDetailData._unlockTime,
      withdrawn: depositDetailData._withdrawn,
      tokenId: depositDetailData._tokenId,
      isNFT: depositDetailData._isNFT,
      migratedLockDepositId: depositDetailData._migratedLockDepositId,
      isNFTMinted: depositDetailData._isNFTMinted,
    };
    context.depositDetail.set(entity);
  }

  const entity: deposits = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    depositId: event.params.id,
    tokenAddress: event.params.tokenAddress.toLocaleLowerCase(),
    withdrawalAddress: event.params.withdrawalAddress.toLocaleLowerCase(),
    lockContractAddress: event.srcAddress.toLocaleLowerCase(),
    amount: event.params.amount,
    unlockTime: event.params.unlockTime,
    txHash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp * 1000),
    blockHeight: event.block.number,
    transactionIndex: event.logIndex,
    chainId: event.chainId,
    token_id: `${event.chainId}_${tokenAddress}`,
    depositDetail_id: `${event.chainId}_${event.params.id}`
  };

  context.deposits.set(entity);
});

LockContract.DepositNFT.handler(async ({ event, context }) => {
  const tokenAddress = event.params.tokenAddress.toLocaleLowerCase();
  let existingToken = await context.token.get(`${event.chainId}_${tokenAddress}`);
  if (!existingToken) {
    const tokenInfo = await getTokenInfo(tokenAddress, event.chainId as keyof typeof publicClients);
    const [decimals, symbol, name, totalSupply] = [tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name, tokenInfo.totalSupply];

    existingToken = {
      id: `${event.chainId}_${tokenAddress}`,
      name,
      symbol,
      totalSupply,
      decimals: decimals ?? 0,
      address: tokenAddress,
      chainId: event.chainId
    };
    context.token.set(existingToken);
  }

  let depositDetail = await context.depositDetail.get(`${event.chainId}_${event.params.id}`);
  if (!depositDetail) {
    const depositDetailData = await getDepositDetail(event.srcAddress, event.params.id, event.chainId as keyof typeof publicClients);
    const entity: depositDetail = {
      id: `${event.chainId}_${event.params.id}`,
      chainId: event.chainId,
      tokenAddress: depositDetailData._tokenAddress.toLocaleLowerCase(),
      withdrawalAddress: depositDetailData._withdrawalAddress.toLocaleLowerCase(),
      tokenAmount: depositDetailData._tokenAmount,
      unlockTime:  depositDetailData._unlockTime,
      withdrawn: depositDetailData._withdrawn,
      tokenId: depositDetailData._tokenId,
      isNFT: depositDetailData._isNFT,
      migratedLockDepositId: depositDetailData._migratedLockDepositId,
      isNFTMinted: depositDetailData._isNFTMinted,
    };
    context.depositDetail.set(entity);
  }

  // const entity: depositNfts = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   depositId: event.params.id,
  //   tokenAddress: event.params.tokenAddress.toLocaleLowerCase(),
  //   withdrawalAddress: event.params.withdrawalAddress.toLocaleLowerCase(),
  //   lockContractAddress: event.srcAddress.toLocaleLowerCase(),
  //   amount: event.params.amount,
  //   unlockTime: event.params.unlockTime,
  //   txHash: event.transaction.hash,
  //   timestamp: BigInt(event.block.timestamp * 1000),
  //   blockHeight: event.block.number,
  //   transactionIndex: event.logIndex,
  //   chainId: event.chainId,
  //   nft_id: `${event.chainId}_${tokenAddress}`,
  //   depositDetail_id: `${event.chainId}_${event.params.id}`
  // };
});

LockContract.LogNFTWithdrawal.handler(async ({ event, context }) => {

});

LockContract.LogTokenWithdrawal.handler(async ({ event, context }) => {

});