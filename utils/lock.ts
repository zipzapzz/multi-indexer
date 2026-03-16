import { isAddress } from "viem";
import { publicClients } from "./viem";
import { lockAbi } from "./abis";
// import {Contract, Web3} from 'web3';

export async function getDepositDetail(
    address: string,
    depositId: bigint,
    chainId: keyof typeof publicClients
  ) {

    let _tokenAddress: string = "";
    let _withdrawalAddress: string = "";
    let _tokenAmount: bigint = BigInt(0);
    let _unlockTime: bigint = BigInt(0);
    let _withdrawn: boolean = false;
    let _tokenId: bigint = BigInt(0);
    let _isNFT: boolean = false;
    let _migratedLockDepositId: bigint = BigInt(0);
    let _isNFTMinted: boolean = false;
  
    if (!isAddress(address)) return {
      _tokenAddress,
      _withdrawalAddress,
      _tokenAmount,
      _unlockTime,
      _withdrawn,
      _tokenId,
      _isNFT,
      _migratedLockDepositId,
      _isNFTMinted,
    };
    try {
      let data = await publicClients[chainId].readContract({
        address,
        abi: lockAbi,
        functionName: "getDepositDetails",
        args: [depositId] // Provide an argument of type 'bigint'
      });
      _tokenAddress = data[0];
      _withdrawalAddress = data[1];
      _tokenAmount = data[2];
      _unlockTime = data[3];
      _withdrawn = data[4];
      _tokenId = data[5];
      _isNFT = data[6];
      _migratedLockDepositId = data[7];
      _isNFTMinted = data[8];

      

    } catch (error) {
      console.error("fetch getDepositDetails fail", error);  
    }

    return {
      _tokenAddress,
      _withdrawalAddress,
      _tokenAmount,
      _unlockTime,
      _withdrawn,
      _tokenId,
      _isNFT,
      _migratedLockDepositId,
      _isNFTMinted,
    }
  }