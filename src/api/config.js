import { ethers } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ElementSDK, Network,getChainId } from 'element-js-sdk'

const apiKey = 'e7c58c9a5dcbfb0017d0b9e47ce9ce22'

const network = Network.BSC
const isTestnet = false
const chainId = getChainId(network, isTestnet)

export function createSDK(privateKey) {
 // console.log('RPC_URLS[chainId]:',chainId, RPC_URLS[chainId]);
    const provider = new JsonRpcProvider(RPC_URLS[chainId])
    const signer = new ethers.Wallet(privateKey, provider)
    return new ElementSDK({
        networkName: network,
        isTestnet: isTestnet,
        apiKey: apiKey,
        signer: signer
    })
}


export const RPC_URLS = {
    1: 'https://mainnet.infura.io/v3/083d4f747d934f799e087765b10d7be8',
    5: 'https://goerli.infura.io/v3/083d4f747d934f799e087765b10d7be8',
    //56: 'https://bsc-dataseed1.binance.org',
    56:'https://api.zan.top/node/v1/bsc/mainnet/6b55148012b74249962002e2154d5f26',
    97: 'https://api.zan.top/node/v1/bsc/testnet/6b55148012b74249962002e2154d5f26',
    //97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    137: 'https://polygon-rpc.com',
    80001: 'https://matic-mumbai.chainstacklabs.com',
    43114: 'https://api.avax.network/ext/bc/C/rpc',
    43113: 'https://api.avax-test.network/ext/bc/C/rpc',
    42161: 'https://arb1.arbitrum.io/rpc',
    421613: 'https://goerli-rollup.arbitrum.io/rpc',
    324: 'https://mainnet.era.zksync.io',
    280: 'https://zksync2-testnet.zksync.dev',
    59144: 'https://rpc.linea.build',
    59140: 'https://rpc.goerli.linea.build',
    8453: 'https://mainnet.base.org',
    84531: 'https://goerli.base.org',
    204: 'https://opbnb-mainnet-rpc.bnbchain.org',
    10: 'https://mainnet.optimism.io',
    534352: 'https://rpc.scroll.io',
    169: 'https://pacific-rpc.manta.network/http',
    5000: 'https://rpc.mantle.xyz',
}