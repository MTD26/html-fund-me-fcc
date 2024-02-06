// in nodejs (backend)
// require

//this is front-end javascript - we cant use require
// import
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

console.log(ethers)

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (window.ethereum !== undefined) {
        console.log("I see wallet")
        await ethereum.request({ method: "eth_requestAccounts" })
        console.log("Connected")
        document.getElementById("connectButton").innerHTML = "Connected"
    } else {
        console.log("No wallet")
        document.getElementById("connectButton").innerHTML = "Install metamask"
    }
}
async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}
//fund
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}...`)

    if (typeof window.ethereum !== "undefined") {
        // 1 we need a provider AKA connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // &
        // 2 Signer AKA a wallet with gas
        const signer = provider.getSigner()
        // 3 contract that we are interacting with
        // AKA abi and address
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })

            await listenForTransactionMine(transactionResponse, provider)
            console.log("done")
        } catch (e) {
            console.log(e)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`,
            )
            resolve()
        })
    })
}
//withdraw
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (e) {
            console.log(e)
        }
    }
}
