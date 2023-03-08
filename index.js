//Declaring global variables that will need to be accessed by multiple functions
let provider = new ethers.providers.Web3Provider(window.ethereum)
let signer

let accountAddress
let tokenContractAddress
let foundersContractAddress
let investorsContractAddress
let presaleContractAddress

let founderTokenLockDuration  
let investorTokenLockDuration
let presaleTokenLockDuration

let investorLockingDate
let founderLockingDate
let presaleLockingDate



//The ABIs for the following smart contracts were obtained via Remix compiler
const tokenContractAbi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_symbol",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]



const foundersContractAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_founder",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "addFounderAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "amount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endLocking",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAccountBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_expiry",
				"type": "uint256"
			}
		],
		"name": "lock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lockDuration",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewFounders",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]


const investorsContractAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_investor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "addInvestorAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "amount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endLocking",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAccountBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_expiry",
				"type": "uint256"
			}
		],
		"name": "lock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lockDuration",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewInvestors",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]


const presaleContractAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokensPerEth",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "availableTokenSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endLocking",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAccountBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_expiry",
				"type": "uint256"
			}
		],
		"name": "lock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lockAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lockDuration",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokensPerEth",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]



//Connects Metamask
async function connectMetamask(){
    await provider.send("eth_requestAccounts", [])
    signer = await provider.getSigner()
    accountAddress = await signer.getAddress()
    console.log(`Account address = ${accountAddress}`)
    document.getElementById("metamask-connection-message").textContent = `Account address = ${accountAddress}`
}




/* ------------------------------------------TOKEN CREATION SECTION----------------------------------------------- */




//1. Deploys the token contract. The deployer (owner) can choose the name, symbol, and amount of tokens 
//   to be created via the UI.
//2. All of the newly created tokens will be deposited into the owner's wallet (the same address used to 
//   deploy the token) 
async function deployTokenContract(){
    
    //The bytecode for the token smart contract (TokenGenerator.sol) was obtained via Remix compiler
    const tokenContractByteCode = "60806040523480156200001157600080fd5b5060405162001d0b38038062001d0b8339818101604052810190620000379190620003f2565b828281600390816200004a9190620006cd565b5080600490816200005c9190620006cd565b5050506200009b3362000074620000a460201b60201c565b600a62000082919062000944565b836200008f919062000995565b620000ad60201b60201c565b50505062000acc565b60006012905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036200011f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001169062000a41565b60405180910390fd5b62000133600083836200021a60201b60201c565b806002600082825462000147919062000a63565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620001fa919062000aaf565b60405180910390a362000216600083836200021f60201b60201c565b5050565b505050565b505050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200028d8262000242565b810181811067ffffffffffffffff82111715620002af57620002ae62000253565b5b80604052505050565b6000620002c462000224565b9050620002d2828262000282565b919050565b600067ffffffffffffffff821115620002f557620002f462000253565b5b620003008262000242565b9050602081019050919050565b60005b838110156200032d57808201518184015260208101905062000310565b60008484015250505050565b6000620003506200034a84620002d7565b620002b8565b9050828152602081018484840111156200036f576200036e6200023d565b5b6200037c8482856200030d565b509392505050565b600082601f8301126200039c576200039b62000238565b5b8151620003ae84826020860162000339565b91505092915050565b6000819050919050565b620003cc81620003b7565b8114620003d857600080fd5b50565b600081519050620003ec81620003c1565b92915050565b6000806000606084860312156200040e576200040d6200022e565b5b600084015167ffffffffffffffff8111156200042f576200042e62000233565b5b6200043d8682870162000384565b935050602084015167ffffffffffffffff81111562000461576200046062000233565b5b6200046f8682870162000384565b92505060406200048286828701620003db565b9150509250925092565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620004df57607f821691505b602082108103620004f557620004f462000497565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200055f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000520565b6200056b868362000520565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620005ae620005a8620005a284620003b7565b62000583565b620003b7565b9050919050565b6000819050919050565b620005ca836200058d565b620005e2620005d982620005b5565b8484546200052d565b825550505050565b600090565b620005f9620005ea565b62000606818484620005bf565b505050565b5b818110156200062e5762000622600082620005ef565b6001810190506200060c565b5050565b601f8211156200067d576200064781620004fb565b620006528462000510565b8101602085101562000662578190505b6200067a620006718562000510565b8301826200060b565b50505b505050565b600082821c905092915050565b6000620006a26000198460080262000682565b1980831691505092915050565b6000620006bd83836200068f565b9150826002028217905092915050565b620006d8826200048c565b67ffffffffffffffff811115620006f457620006f362000253565b5b620007008254620004c6565b6200070d82828562000632565b600060209050601f83116001811462000745576000841562000730578287015190505b6200073c8582620006af565b865550620007ac565b601f1984166200075586620004fb565b60005b828110156200077f5784890151825560018201915060208501945060208101905062000758565b868310156200079f57848901516200079b601f8916826200068f565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008160011c9050919050565b6000808291508390505b600185111562000842578086048111156200081a5762000819620007b4565b5b60018516156200082a5780820291505b80810290506200083a85620007e3565b9450620007fa565b94509492505050565b6000826200085d576001905062000930565b816200086d576000905062000930565b81600181146200088657600281146200089157620008c7565b600191505062000930565b60ff841115620008a657620008a5620007b4565b5b8360020a915084821115620008c057620008bf620007b4565b5b5062000930565b5060208310610133831016604e8410600b8410161715620009015782820a905083811115620008fb57620008fa620007b4565b5b62000930565b620009108484846001620007f0565b925090508184048111156200092a5762000929620007b4565b5b81810290505b9392505050565b600060ff82169050919050565b60006200095182620003b7565b91506200095e8362000937565b92506200098d7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff84846200084b565b905092915050565b6000620009a282620003b7565b9150620009af83620003b7565b9250828202620009bf81620003b7565b91508282048414831517620009d957620009d8620007b4565b5b5092915050565b600082825260208201905092915050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b600062000a29601f83620009e0565b915062000a3682620009f1565b602082019050919050565b6000602082019050818103600083015262000a5c8162000a1a565b9050919050565b600062000a7082620003b7565b915062000a7d83620003b7565b925082820190508082111562000a985762000a97620007b4565b5b92915050565b62000aa981620003b7565b82525050565b600060208201905062000ac6600083018462000a9e565b92915050565b61122f8062000adc6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461016857806370a082311461019857806395d89b41146101c8578063a457c2d7146101e6578063a9059cbb14610216578063dd62ed3e14610246576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610276565b6040516100c39190610b0c565b60405180910390f35b6100e660048036038101906100e19190610bc7565b610308565b6040516100f39190610c22565b60405180910390f35b61010461032b565b6040516101119190610c4c565b60405180910390f35b610134600480360381019061012f9190610c67565b610335565b6040516101419190610c22565b60405180910390f35b610152610364565b60405161015f9190610cd6565b60405180910390f35b610182600480360381019061017d9190610bc7565b61036d565b60405161018f9190610c22565b60405180910390f35b6101b260048036038101906101ad9190610cf1565b6103a4565b6040516101bf9190610c4c565b60405180910390f35b6101d06103ec565b6040516101dd9190610b0c565b60405180910390f35b61020060048036038101906101fb9190610bc7565b61047e565b60405161020d9190610c22565b60405180910390f35b610230600480360381019061022b9190610bc7565b6104f5565b60405161023d9190610c22565b60405180910390f35b610260600480360381019061025b9190610d1e565b610518565b60405161026d9190610c4c565b60405180910390f35b60606003805461028590610d8d565b80601f01602080910402602001604051908101604052809291908181526020018280546102b190610d8d565b80156102fe5780601f106102d3576101008083540402835291602001916102fe565b820191906000526020600020905b8154815290600101906020018083116102e157829003601f168201915b5050505050905090565b60008061031361059f565b90506103208185856105a7565b600191505092915050565b6000600254905090565b60008061034061059f565b905061034d858285610770565b6103588585856107fc565b60019150509392505050565b60006012905090565b60008061037861059f565b905061039981858561038a8589610518565b6103949190610ded565b6105a7565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546103fb90610d8d565b80601f016020809104026020016040519081016040528092919081815260200182805461042790610d8d565b80156104745780601f1061044957610100808354040283529160200191610474565b820191906000526020600020905b81548152906001019060200180831161045757829003601f168201915b5050505050905090565b60008061048961059f565b905060006104978286610518565b9050838110156104dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d390610e93565b60405180910390fd5b6104e982868684036105a7565b60019250505092915050565b60008061050061059f565b905061050d8185856107fc565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610616576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060d90610f25565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610685576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067c90610fb7565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516107639190610c4c565b60405180910390a3505050565b600061077c8484610518565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146107f657818110156107e8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107df90611023565b60405180910390fd5b6107f584848484036105a7565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361086b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610862906110b5565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108da576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108d190611147565b60405180910390fd5b6108e5838383610a72565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101561096b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610962906111d9565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610a599190610c4c565b60405180910390a3610a6c848484610a77565b50505050565b505050565b505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610ab6578082015181840152602081019050610a9b565b60008484015250505050565b6000601f19601f8301169050919050565b6000610ade82610a7c565b610ae88185610a87565b9350610af8818560208601610a98565b610b0181610ac2565b840191505092915050565b60006020820190508181036000830152610b268184610ad3565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610b5e82610b33565b9050919050565b610b6e81610b53565b8114610b7957600080fd5b50565b600081359050610b8b81610b65565b92915050565b6000819050919050565b610ba481610b91565b8114610baf57600080fd5b50565b600081359050610bc181610b9b565b92915050565b60008060408385031215610bde57610bdd610b2e565b5b6000610bec85828601610b7c565b9250506020610bfd85828601610bb2565b9150509250929050565b60008115159050919050565b610c1c81610c07565b82525050565b6000602082019050610c376000830184610c13565b92915050565b610c4681610b91565b82525050565b6000602082019050610c616000830184610c3d565b92915050565b600080600060608486031215610c8057610c7f610b2e565b5b6000610c8e86828701610b7c565b9350506020610c9f86828701610b7c565b9250506040610cb086828701610bb2565b9150509250925092565b600060ff82169050919050565b610cd081610cba565b82525050565b6000602082019050610ceb6000830184610cc7565b92915050565b600060208284031215610d0757610d06610b2e565b5b6000610d1584828501610b7c565b91505092915050565b60008060408385031215610d3557610d34610b2e565b5b6000610d4385828601610b7c565b9250506020610d5485828601610b7c565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610da557607f821691505b602082108103610db857610db7610d5e565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610df882610b91565b9150610e0383610b91565b9250828201905080821115610e1b57610e1a610dbe565b5b92915050565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b6000610e7d602583610a87565b9150610e8882610e21565b604082019050919050565b60006020820190508181036000830152610eac81610e70565b9050919050565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000610f0f602483610a87565b9150610f1a82610eb3565b604082019050919050565b60006020820190508181036000830152610f3e81610f02565b9050919050565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b6000610fa1602283610a87565b9150610fac82610f45565b604082019050919050565b60006020820190508181036000830152610fd081610f94565b9050919050565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b600061100d601d83610a87565b915061101882610fd7565b602082019050919050565b6000602082019050818103600083015261103c81611000565b9050919050565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b600061109f602583610a87565b91506110aa82611043565b604082019050919050565b600060208201905081810360008301526110ce81611092565b9050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b6000611131602383610a87565b915061113c826110d5565b604082019050919050565b6000602082019050818103600083015261116081611124565b9050919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b60006111c3602683610a87565b91506111ce82611167565b604082019050919050565b600060208201905081810360008301526111f2816111b6565b905091905056fea26469706673582212201077f52118b601396acf697afd1d84a901579ac2b5008cc3e97537006459f6d364736f6c63430008130033"

    const tokenName = document.getElementById("name").value
    const tokenSymbol = document.getElementById("symbol").value
    const tokenAmount = document.getElementById("amount").value
    
    try {
        const factory = new ethers.ContractFactory(tokenContractAbi, tokenContractByteCode, signer)
        const tokenContract = await factory.deploy(tokenName, tokenSymbol, tokenAmount)
        const transactionReceipt = await tokenContract.deployTransaction.wait()

        //The contract address for the new token is captured and stored for later use
        tokenContractAddress = transactionReceipt.contractAddress
        document.getElementById("token-contract-address").textContent = `Token Address = ${tokenContractAddress}`
    } catch(e) {
        document.getElementById("token-contract-address").textContent = "Failed"
        console.log(e)
    }

}

//Sets the token contract address variable (needed for the presale and withdraw pages of the site)
function getTokenAddress(){
    tokenContractAddress = document.getElementById("token-contract-address-input").value
    console.log(tokenContractAddress)
    document.getElementById("submit-token-address-confirmation").textContent = "Token Address Received"
}



/* ------------------------------------------FOUNDERS SECTION----------------------------------------------- */


//Deploys the vesting contract for the founders (FounderVesting.sol). 
async function deployFoundersContract(){

    //The bytecode for the founders vesting contract (FounderVesting.sol) was obtained via Remix compiler
    const foundersContractBytecode = "60806040526000600460006101000a81548160ff02191690831515021790555034801561002b57600080fd5b50604051610f6f380380610f6f833981810160405281019061004d9190610137565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600460016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610164565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610104826100d9565b9050919050565b610114816100f9565b811461011f57600080fd5b50565b6000815190506101318161010b565b92915050565b60006020828403121561014d5761014c6100d4565b5b600061015b84828501610122565b91505092915050565b610dfc806101736000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c80636896fabf116100665780636896fabf1461013557806387bc187e146101535780639076f1f91461016f578063aa8c217c1461018d578063fc0c546a146101ab5761009e565b806304554443146100a35780631338736f146100c157806316c3a63a146100dd5780632e1a7d4d146100fb578063557ed1ba14610117575b600080fd5b6100ab6101c9565b6040516100b8919061078d565b60405180910390f35b6100db60048036038101906100d691906107d9565b6101cf565b005b6100e561038b565b6040516100f29190610909565b60405180910390f35b6101156004803603810190610110919061092b565b610419565b005b61011f6105f0565b60405161012c919061078d565b60405180910390f35b61013d6105f8565b60405161014a919061078d565b60405180910390f35b61016d60048036038101906101689190610984565b61063f565b005b610177610744565b604051610184919061078d565b60405180910390f35b61019561074a565b6040516101a2919061078d565b60405180910390f35b6101b3610750565b6040516101c09190610a23565b60405180910390f35b60025481565b3373ffffffffffffffffffffffffffffffffffffffff16600460019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461022957600080fd5b600460009054906101000a900460ff1615610279576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161027090610a9b565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd600460019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1630856040518463ffffffff1660e01b81526004016102f893929190610aca565b6020604051808303816000875af1158015610317573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061033b9190610b39565b508160018190555062015180816103529190610b95565b600281905550600254426103669190610bd7565b6003819055506001600460006101000a81548160ff0219169083151502179055505050565b6060600680548060200260200160405190810160405280929190818152602001828054801561040f57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116103c5575b5050505050905090565b600354421161045d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161045490610c57565b60405180910390fd5b6000670de0b6b3a7640000826104739190610ca6565b905080600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156104f7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104ee90610d49565b60405180910390fd5b80600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105469190610d69565b9250508190555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33846040518363ffffffff1660e01b81526004016105a8929190610d9d565b6020604051808303816000875af11580156105c7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105eb9190610b39565b505050565b600042905090565b6000600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905090565b3373ffffffffffffffffffffffffffffffffffffffff16600460019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461069957600080fd5b80600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506006829080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60035481565b60015481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000819050919050565b61078781610774565b82525050565b60006020820190506107a2600083018461077e565b92915050565b600080fd5b6107b681610774565b81146107c157600080fd5b50565b6000813590506107d3816107ad565b92915050565b600080604083850312156107f0576107ef6107a8565b5b60006107fe858286016107c4565b925050602061080f858286016107c4565b9150509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061087082610845565b9050919050565b61088081610865565b82525050565b60006108928383610877565b60208301905092915050565b6000602082019050919050565b60006108b682610819565b6108c08185610824565b93506108cb83610835565b8060005b838110156108fc5781516108e38882610886565b97506108ee8361089e565b9250506001810190506108cf565b5085935050505092915050565b6000602082019050818103600083015261092381846108ab565b905092915050565b600060208284031215610941576109406107a8565b5b600061094f848285016107c4565b91505092915050565b61096181610865565b811461096c57600080fd5b50565b60008135905061097e81610958565b92915050565b6000806040838503121561099b5761099a6107a8565b5b60006109a98582860161096f565b92505060206109ba858286016107c4565b9150509250929050565b6000819050919050565b60006109e96109e46109df84610845565b6109c4565b610845565b9050919050565b60006109fb826109ce565b9050919050565b6000610a0d826109f0565b9050919050565b610a1d81610a02565b82525050565b6000602082019050610a386000830184610a14565b92915050565b600082825260208201905092915050565b7f546f6b656e73206861766520616c7265616479206265656e206c6f636b656400600082015250565b6000610a85601f83610a3e565b9150610a9082610a4f565b602082019050919050565b60006020820190508181036000830152610ab481610a78565b9050919050565b610ac481610865565b82525050565b6000606082019050610adf6000830186610abb565b610aec6020830185610abb565b610af9604083018461077e565b949350505050565b60008115159050919050565b610b1681610b01565b8114610b2157600080fd5b50565b600081519050610b3381610b0d565b92915050565b600060208284031215610b4f57610b4e6107a8565b5b6000610b5d84828501610b24565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610ba082610774565b9150610bab83610774565b9250828202610bb981610774565b91508282048414831517610bd057610bcf610b66565b5b5092915050565b6000610be282610774565b9150610bed83610774565b9250828201905080821115610c0557610c04610b66565b5b92915050565b7f546f6b656e732068617665206e6f74206265656e20756e6c6f636b6564000000600082015250565b6000610c41601d83610a3e565b9150610c4c82610c0b565b602082019050919050565b60006020820190508181036000830152610c7081610c34565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000610cb182610774565b9150610cbc83610774565b925082610ccc57610ccb610c77565b5b828204905092915050565b7f596f752061726520747279696e6720746f207769746864726177206d6f72652060008201527f746f6b656e73207468616e20796f75206f776e00000000000000000000000000602082015250565b6000610d33603383610a3e565b9150610d3e82610cd7565b604082019050919050565b60006020820190508181036000830152610d6281610d26565b9050919050565b6000610d7482610774565b9150610d7f83610774565b9250828203905081811115610d9757610d96610b66565b5b92915050565b6000604082019050610db26000830185610abb565b610dbf602083018461077e565b939250505056fea264697066735822122055bdda9069f4353c010a0b2914e4f82b6fef45fe61d31ef6bee7fcc6a7c78a7364736f6c63430008130033"
   
    try {
        const factory = new ethers.ContractFactory(foundersContractAbi, foundersContractBytecode, signer)
        const foundersContract = await factory.deploy(tokenContractAddress)
        const transactionReceipt = await foundersContract.deployTransaction.wait()
        foundersContractAddress = transactionReceipt.contractAddress
        document.getElementById("founders-contract-address").textContent = `Founders Vesting Contract Address = ${foundersContractAddress}`
    } catch(e){
        document.getElementById("founders-contract-address").textContent = "Failed"
        console.log(e)
    }
}


/*
Allows the founders vesting contract owner (the address which deployed the contract) to: 
    a) add founder addresses (as many as desired) 
    b) determine how many tokens to allocate to each address
*/
async function addFounder() {
    const tokenAmount = document.getElementById("founderTokenAmount").value
    const founderAddress = document.getElementById("founder_Address").value

    try {
        const foundersContract = new ethers.Contract(foundersContractAddress, foundersContractAbi, provider)
        const addFounderTx = await foundersContract.connect(signer).addFounderAddress(founderAddress, tokenAmount)
        const response = await addFounderTx.wait()
        console.log(await response)
        document.getElementById("founderTokenAmount").value = ""
        document.getElementById("founder_Address").value = ""
        document.getElementById("founder-added-confirmation").textContent = "Founder has been added to the contract"
    } catch(e){
        document.getElementById("founder-added-confirmation").textContent = "Failed"
        console.log(e)
    }
}


/*
1. Allows the founders vesting contract (FounderVesting.sol) to spend tokens (and determines the limit).
2. Allows the founders vesting contract owner to lock tokens in the contract. This is done by transferring 
   tokens from owner's wallet (where the new tokens were minted) to the Founders Vesting contract. 
3. For this function to work properly, the same address needs to have deployed (own) both contracts 
   (TokenGenerator.sol and FounderVesting.sol)
*/
async function lockFounderTokens() {
    const numTokensToLock = document.getElementById("numLockedFounderTokens").value
    const decimals = 18 
    const amountFormatted = ethers.utils.parseUnits(numTokensToLock, decimals);
    founderTokenLockDuration = document.getElementById("founderLockDuration").value

    try{
        //Sets the approval (for the founders vesting contract to spend the new tokens) and sets the spending limit
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
        const approveSpendTx = await tokenContract.connect(signer).approve(foundersContractAddress, amountFormatted)
        const response1 = await approveSpendTx.wait()
        console.log(await response1)
   
        //Locks the new tokens by transferring them to the founder vesting contract
        const foundersContract = new ethers.Contract(foundersContractAddress, foundersContractAbi, provider)
        const lockTokensTx = await foundersContract.connect(signer).lock(amountFormatted, founderTokenLockDuration)
        const response2 = await lockTokensTx.wait()
        console.log(await response2)
        founderLockingDate = new Date().toLocaleString();
    
        const amountLocked = await foundersContract.amount()
        const foundersAddresses = await foundersContract.viewFounders()
        
        document.getElementById("num-founder-tokens-locked").textContent = `Total number of tokens locked: ${amountLocked / 1e18}`
        document.getElementById("date-of-founder-locking").textContent = `Date of locking: ${founderLockingDate}`
        document.getElementById("founder-lockup-duration").textContent = `Total number of days locked: ${founderTokenLockDuration}`
        console.log(`Founders addresses: ${foundersAddresses}`)
    } catch(e){
        document.getElementById("num-founder-tokens-locked").textContent = "Failed"
        console.log(e)
    }   
}

//Allows a founder to check their balance in the founders vesting contract
async function getFounderBalance(){

    try {
        const foundersContract = new ethers.Contract(foundersContractAddress, foundersContractAbi, provider)
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
        const tokenSymbol = await tokenContract.symbol()
        const currentBalance = await foundersContract.getAccountBalance({from: accountAddress})
        console.log(`Your current balance = ${currentBalance} ${tokenSymbol} tokens`)
        document.getElementById("founder-balance").textContent = `Your current balance = ${currentBalance} ${tokenSymbol} tokens`
    } catch(e){
        document.getElementById("founder-balance").textContent = "Failed"
        console.log(e)
    }
    
}


//Allows a founder to withdraw their tokens from the founders vesting contract after the vesting period is over
async function withdrawFounderTokens(){
    const numTokens = document.getElementById("foundersAmount").value
    const decimals = 18
    const numTokensFormatted = ethers.utils.parseUnits(numTokens, decimals)

    try {
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
        const tokenSymbol = await tokenContract.symbol()
        const foundersContract = new ethers.Contract(foundersContractAddress, foundersContractAbi, provider)
        const withdrawTokensTx = await foundersContract.connect(signer).withdraw(numTokensFormatted, {from: accountAddress})
        const response = await withdrawTokensTx.wait()
        console.log(await response)
        document.getElementById("founders-token-withdrawal-confirmation").textContent = `${numTokens} ${tokenSymbol} tokens successfully withdrawn` 
    } catch(e){
        console.log(e)
        document.getElementById("founders-token-withdrawal-confirmation").textContent = `Error: ${e.data.message}` 
    }
    
}

//Sets the founder contract address variable (needed for the presale and withdraw pages of the site)
function getFounderAddress(){
    foundersContractAddress = document.getElementById("founders-contract-address-input").value
    document.getElementById("submit-founder-address-confirmation").textContent = "Founder Contract Address Received"
}



/* ------------------------------------------INVESTORS SECTION----------------------------------------------- */



//Deploys the vesting contract for the investors (InvestorVesting.sol). 
async function deployInvestorsContract(){

    //The bytecode for the investors vesting contract (InvestorVesting.sol) was obtained via Remix compiler
    const investorsContractBytecode = "60806040526000600460006101000a81548160ff02191690831515021790555034801561002b57600080fd5b50604051610f6f380380610f6f833981810160405281019061004d9190610137565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600460016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610164565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610104826100d9565b9050919050565b610114816100f9565b811461011f57600080fd5b50565b6000815190506101318161010b565b92915050565b60006020828403121561014d5761014c6100d4565b5b600061015b84828501610122565b91505092915050565b610dfc806101736000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c80636896fabf116100665780636896fabf146101355780639076f1f914610153578063aa8c217c14610171578063cad4b7941461018f578063fc0c546a146101ab5761009e565b806304554443146100a35780631338736f146100c15780632e1a7d4d146100dd578063557ed1ba146100f957806366d3548814610117575b600080fd5b6100ab6101c9565b6040516100b8919061078d565b60405180910390f35b6100db60048036038101906100d691906107d9565b6101cf565b005b6100f760048036038101906100f29190610819565b61038b565b005b610101610562565b60405161010e919061078d565b60405180910390f35b61011f61056a565b60405161012c9190610936565b60405180910390f35b61013d6105f8565b60405161014a919061078d565b60405180910390f35b61015b61063f565b604051610168919061078d565b60405180910390f35b610179610645565b604051610186919061078d565b60405180910390f35b6101a960048036038101906101a49190610984565b61064b565b005b6101b3610750565b6040516101c09190610a23565b60405180910390f35b60025481565b3373ffffffffffffffffffffffffffffffffffffffff16600460019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461022957600080fd5b600460009054906101000a900460ff1615610279576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161027090610a9b565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd600460019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1630856040518463ffffffff1660e01b81526004016102f893929190610aca565b6020604051808303816000875af1158015610317573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061033b9190610b39565b508160018190555062015180816103529190610b95565b600281905550600254426103669190610bd7565b6003819055506001600460006101000a81548160ff0219169083151502179055505050565b60035442116103cf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103c690610c57565b60405180910390fd5b6000670de0b6b3a7640000826103e59190610ca6565b905080600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015610469576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161046090610d49565b60405180910390fd5b80600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104b89190610d69565b9250508190555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33846040518363ffffffff1660e01b815260040161051a929190610d9d565b6020604051808303816000875af1158015610539573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061055d9190610b39565b505050565b600042905090565b606060068054806020026020016040519081016040528092919081815260200182805480156105ee57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116105a4575b5050505050905090565b6000600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905090565b60035481565b60015481565b3373ffffffffffffffffffffffffffffffffffffffff16600460019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146106a557600080fd5b80600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506006829080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000819050919050565b61078781610774565b82525050565b60006020820190506107a2600083018461077e565b92915050565b600080fd5b6107b681610774565b81146107c157600080fd5b50565b6000813590506107d3816107ad565b92915050565b600080604083850312156107f0576107ef6107a8565b5b60006107fe858286016107c4565b925050602061080f858286016107c4565b9150509250929050565b60006020828403121561082f5761082e6107a8565b5b600061083d848285016107c4565b91505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061089d82610872565b9050919050565b6108ad81610892565b82525050565b60006108bf83836108a4565b60208301905092915050565b6000602082019050919050565b60006108e382610846565b6108ed8185610851565b93506108f883610862565b8060005b8381101561092957815161091088826108b3565b975061091b836108cb565b9250506001810190506108fc565b5085935050505092915050565b6000602082019050818103600083015261095081846108d8565b905092915050565b61096181610892565b811461096c57600080fd5b50565b60008135905061097e81610958565b92915050565b6000806040838503121561099b5761099a6107a8565b5b60006109a98582860161096f565b92505060206109ba858286016107c4565b9150509250929050565b6000819050919050565b60006109e96109e46109df84610872565b6109c4565b610872565b9050919050565b60006109fb826109ce565b9050919050565b6000610a0d826109f0565b9050919050565b610a1d81610a02565b82525050565b6000602082019050610a386000830184610a14565b92915050565b600082825260208201905092915050565b7f546f6b656e73206861766520616c7265616479206265656e206c6f636b656400600082015250565b6000610a85601f83610a3e565b9150610a9082610a4f565b602082019050919050565b60006020820190508181036000830152610ab481610a78565b9050919050565b610ac481610892565b82525050565b6000606082019050610adf6000830186610abb565b610aec6020830185610abb565b610af9604083018461077e565b949350505050565b60008115159050919050565b610b1681610b01565b8114610b2157600080fd5b50565b600081519050610b3381610b0d565b92915050565b600060208284031215610b4f57610b4e6107a8565b5b6000610b5d84828501610b24565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610ba082610774565b9150610bab83610774565b9250828202610bb981610774565b91508282048414831517610bd057610bcf610b66565b5b5092915050565b6000610be282610774565b9150610bed83610774565b9250828201905080821115610c0557610c04610b66565b5b92915050565b7f546f6b656e732068617665206e6f74206265656e20756e6c6f636b6564000000600082015250565b6000610c41601d83610a3e565b9150610c4c82610c0b565b602082019050919050565b60006020820190508181036000830152610c7081610c34565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000610cb182610774565b9150610cbc83610774565b925082610ccc57610ccb610c77565b5b828204905092915050565b7f596f752061726520747279696e6720746f207769746864726177206d6f72652060008201527f746f6b656e73207468616e20796f75206f776e00000000000000000000000000602082015250565b6000610d33603383610a3e565b9150610d3e82610cd7565b604082019050919050565b60006020820190508181036000830152610d6281610d26565b9050919050565b6000610d7482610774565b9150610d7f83610774565b9250828203905081811115610d9757610d96610b66565b5b92915050565b6000604082019050610db26000830185610abb565b610dbf602083018461077e565b939250505056fea2646970667358221220db768cf5ef54d12e8c7814401d653669fdabea306120b70df437442286b343e164736f6c63430008130033"
    
    try {
        const factory = new ethers.ContractFactory(investorsContractAbi, investorsContractBytecode, signer)
        const investorsContract = await factory.deploy(tokenContractAddress)
        const transactionReceipt = await investorsContract.deployTransaction.wait()
        console.log(transactionReceipt)
        investorsContractAddress = transactionReceipt.contractAddress
        document.getElementById("investors-contract-address").textContent = `Investors Vesting Contract Address = ${investorsContractAddress}`
    } catch(e){
        document.getElementById("investors-contract-address").textContent = "Failed"
        console.log(e)
    }

}


/*
Allows the investors vesting contract owner (address which deployed the contract) to: 
    a) add investor addresses (as many as desired) 
    b) determine how many tokens to allocate to each address
*/
async function addInvestor() {
    const tokenAmount = document.getElementById("investorTokenAmount").value
    const investorAddress = document.getElementById("investor_Address").value

    try {
        const investorsContract = new ethers.Contract(investorsContractAddress, investorsContractAbi, provider)
        const addInvestorTx = await investorsContract.connect(signer).addInvestorAddress(investorAddress, tokenAmount)
        const response = await addInvestorTx.wait()
        console.log(await response)
        document.getElementById("investorTokenAmount").value = ""
        document.getElementById("investor_Address").value = ""
        document.getElementById("investor-added-confirmation").textContent = "Investor has been added to the contract"
    } catch(e){
        console.log(e)
        document.getElementById("investor-added-confirmation").textContent = "Failed"
    }
    
}


/*
1. Allows the investors vesting contract (InvestorVesting.sol) to spend tokens (and determines the limit).
2. Allows the investors vesting contract owner to lock tokens in the contract. This is done by transferring 
   tokens from owner's wallet (where new tokens were minted) to the Investors Vesting contract. 
3. For this function to work properly, the same address needs to have deployed (own) both contracts 
   (TokenGenerator.sol and InvestorVesting.sol)
*/
async function lockInvestorTokens() {
    const numTokensToLock = document.getElementById("numLockedInvestorTokens").value
    const decimals = 18
    const amountFormatted = ethers.utils.parseUnits(numTokensToLock, decimals);
    investorTokenLockDuration = document.getElementById("investorLockDuration").value

    try{ 
        //Sets the approval (for the investors vesting contract to spend the new tokens) and sets the spending limit
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
        const approveSpendTx = await tokenContract.connect(signer).approve(investorsContractAddress, amountFormatted)
        const response1 = await approveSpendTx.wait()
        console.log(await response1)
    
        //Locks the new tokens by transferring them to the investor vesting contract
        const investorsContract = new ethers.Contract(investorsContractAddress, investorsContractAbi, provider)
        const lockTokensTx = await investorsContract.connect(signer).lock(amountFormatted, investorTokenLockDuration)
        const response2 = await lockTokensTx.wait()
        console.log(await response2)
        investorLockingDate = new Date().toLocaleString();
    
        const amountLocked = await investorsContract.amount()
        const investorsAddresses = await investorsContract.viewInvestors()
    
        document.getElementById("num-investor-tokens-locked").textContent = `Total number of tokens locked: ${amountLocked / 1e18}`
        document.getElementById("date-of-investor-locking").textContent = `Date of locking: ${investorLockingDate}`
        document.getElementById("investor-lockup-duration").textContent = `Total number of days locked: ${investorTokenLockDuration}`
    
        console.log(`Total number of tokens locked: ${amountLocked / 1e18}`)
        console.log(`Date of locking: ${investorLockingDate}`)
        console.log(`Total number of days locked: ${investorTokenLockDuration}`)
        
        console.log(`Founders addresses: ${investorsAddresses}`)
    } catch(e){
        document.getElementById("num-investor-tokens-locked").textContent = "Failed"
        console.log(e)
    }
}


//Allows an investor to check their balance in the investors vesting contract
async function getInvestorBalance(){
    try{
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
        const investorsContract = new ethers.Contract(investorsContractAddress, investorsContractAbi, provider)
        const tokenSymbol = await tokenContract.symbol()
        const currentBalance = await investorsContract.getAccountBalance({from: accountAddress})
        console.log(`Your current balance = ${currentBalance} ${tokenSymbol} tokens`)
        document.getElementById("investor-balance").textContent = `Your current balance = ${currentBalance} ${tokenSymbol} tokens`
    } catch(e){
        document.getElementById("investor-balance").textContent = "Failed"
        console.log(e)
    }
}


//Allows an investor to withdraw their tokens from the investors vesting contract after the vesting period is over
async function withdrawInvestorTokens(){
    const numTokens = document.getElementById("investorsAmount").value
    const decimals= 18
    const numTokensFormatted = ethers.utils.parseUnits(numTokens, decimals)

    try {
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
        const tokenSymbol = await tokenContract.symbol()
        const investorsContract = new ethers.Contract(investorsContractAddress, investorsContractAbi, provider)
        const withdrawTokensTx = await investorsContract.connect(signer).withdraw(numTokensFormatted, {from: accountAddress})
        const response = await withdrawTokensTx.wait()
        console.log(await response)
        document.getElementById("investors-token-withdrawal-confirmation").textContent = `${numTokens} ${tokenSymbol} tokens successfully withdrawn`
    } catch(e){
        console.log(e)
        document.getElementById("investors-token-withdrawal-confirmation").textContent = `Error: ${e.data.message}`  
    } 
}


//Sets the investor contract address variable (needed for the presale and withdraw pages of the site)
function getInvestorAddress(){
    investorsContractAddress = document.getElementById("investors-contract-address-input").value
    document.getElementById("submit-investor-address-confirmation").textContent = "Investor Contract Address Received"
}



/* ------------------------------------------PRESALE SECTION----------------------------------------------- */


//Deploys the presale contract for the presale buyers (PresaleVesting.sol). 
async function deployPresaleContract(){

    //The bytecode for the presale vesting contract (PresaleVesting.sol) was obtained via Remix compiler
    const presaleContractBytecode = "60806040526000600660006101000a81548160ff0219169083151502179055503480156200002c57600080fd5b5060405162000e8338038062000e83833981810160405281019062000052919062000187565b816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600660016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806004819055505050620001ce565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200011482620000e7565b9050919050565b620001268162000107565b81146200013257600080fd5b50565b60008151905062000146816200011b565b92915050565b6000819050919050565b62000161816200014c565b81146200016d57600080fd5b50565b600081519050620001818162000156565b92915050565b60008060408385031215620001a157620001a0620000e2565b5b6000620001b18582860162000135565b9250506020620001c48582860162000170565b9150509250929050565b610ca580620001de6000396000f3fe60806040526004361061009c5760003560e01c80636896fabf116100645780636896fabf146101745780639076f1f91461019f578063cbdd69b5146101ca578063d0e30db0146101f5578063d8df5dc1146101ff578063fc0c546a1461022a5761009c565b806304554443146100a15780631338736f146100cc5780632e1a7d4d146100f557806338d7bbc71461011e578063557ed1ba14610149575b600080fd5b3480156100ad57600080fd5b506100b6610255565b6040516100c39190610750565b60405180910390f35b3480156100d857600080fd5b506100f360048036038101906100ee919061079c565b61025b565b005b34801561010157600080fd5b5061011c600480360381019061011791906107dc565b61041e565b005b34801561012a57600080fd5b506101336105f5565b6040516101409190610750565b60405180910390f35b34801561015557600080fd5b5061015e6105fb565b60405161016b9190610750565b60405180910390f35b34801561018057600080fd5b50610189610603565b6040516101969190610750565b60405180910390f35b3480156101ab57600080fd5b506101b461064a565b6040516101c19190610750565b60405180910390f35b3480156101d657600080fd5b506101df610650565b6040516101ec9190610750565b60405180910390f35b6101fd610656565b005b34801561020b57600080fd5b5061021461070d565b6040516102219190610750565b60405180910390f35b34801561023657600080fd5b5061023f610713565b60405161024c9190610888565b60405180910390f35b60015481565b3373ffffffffffffffffffffffffffffffffffffffff16600660019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146102b557600080fd5b600660009054906101000a900460ff1615610305576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102fc90610900565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd600660019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1630856040518463ffffffff1660e01b815260040161038493929190610941565b6020604051808303816000875af11580156103a3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103c791906109b0565b50816003819055508160058190555062015180816103e59190610a0c565b600181905550600154426103f99190610a4e565b6002819055506001600660006101000a81548160ff0219169083151502179055505050565b6002544211610462576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161045990610ace565b60405180910390fd5b6000670de0b6b3a7640000826104789190610a0c565b905081600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156104fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104f390610b60565b60405180910390fd5b80600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461054b9190610b80565b9250508190555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff1660e01b81526004016105ad929190610bb4565b6020604051808303816000875af11580156105cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105f091906109b0565b505050565b60055481565b600042905090565b6000600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905090565b60025481565b60045481565b6000600454346106669190610a0c565b90508060055410156106ad576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106a490610c4f565b60405180910390fd5b80600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555080600560008282546107039190610b80565b9250508190555050565b60035481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000819050919050565b61074a81610737565b82525050565b60006020820190506107656000830184610741565b92915050565b600080fd5b61077981610737565b811461078457600080fd5b50565b60008135905061079681610770565b92915050565b600080604083850312156107b3576107b261076b565b5b60006107c185828601610787565b92505060206107d285828601610787565b9150509250929050565b6000602082840312156107f2576107f161076b565b5b600061080084828501610787565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600061084e61084961084484610809565b610829565b610809565b9050919050565b600061086082610833565b9050919050565b600061087282610855565b9050919050565b61088281610867565b82525050565b600060208201905061089d6000830184610879565b92915050565b600082825260208201905092915050565b7f546f6b656e73206861766520616c7265616479206265656e206c6f636b656400600082015250565b60006108ea601f836108a3565b91506108f5826108b4565b602082019050919050565b60006020820190508181036000830152610919816108dd565b9050919050565b600061092b82610809565b9050919050565b61093b81610920565b82525050565b60006060820190506109566000830186610932565b6109636020830185610932565b6109706040830184610741565b949350505050565b60008115159050919050565b61098d81610978565b811461099857600080fd5b50565b6000815190506109aa81610984565b92915050565b6000602082840312156109c6576109c561076b565b5b60006109d48482850161099b565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610a1782610737565b9150610a2283610737565b9250828202610a3081610737565b91508282048414831517610a4757610a466109dd565b5b5092915050565b6000610a5982610737565b9150610a6483610737565b9250828201905080821115610a7c57610a7b6109dd565b5b92915050565b7f546f6b656e732068617665206e6f74206265656e20756e6c6f636b6564000000600082015250565b6000610ab8601d836108a3565b9150610ac382610a82565b602082019050919050565b60006020820190508181036000830152610ae781610aab565b9050919050565b7f596f752061726520747279696e6720746f207769746864726177206d6f72652060008201527f746f6b656e73207468616e20796f75206f776e00000000000000000000000000602082015250565b6000610b4a6033836108a3565b9150610b5582610aee565b604082019050919050565b60006020820190508181036000830152610b7981610b3d565b9050919050565b6000610b8b82610737565b9150610b9683610737565b9250828203905081811115610bae57610bad6109dd565b5b92915050565b6000604082019050610bc96000830185610932565b610bd66020830184610741565b9392505050565b7f4e6f7420656e6f75676820746f6b656e732061726520617661696c61626c652060008201527f666f722074686973207075726368617365000000000000000000000000000000602082015250565b6000610c396031836108a3565b9150610c4482610bdd565b604082019050919050565b60006020820190508181036000830152610c6881610c2c565b905091905056fea2646970667358221220712d458ef40d1e94bbf81f0008b3b170fb9948e0f23f2c4beb0bce7e98405cb464736f6c63430008120033"
    
    const conversionRate = document.getElementById("conversion-rate").value
    try {
        const factory = new ethers.ContractFactory(presaleContractAbi, presaleContractBytecode, signer)
        const presaleContract = await factory.deploy(tokenContractAddress, conversionRate)
        const transactionReceipt = await presaleContract.deployTransaction.wait()
        console.log(transactionReceipt)
        presaleContractAddress = transactionReceipt.contractAddress
        document.getElementById("presale-contract-address").textContent = `Presale Vesting Contract Address = ${presaleContractAddress}`
    } catch(e){
        document.getElementById("presale-contract-address").textContent = "Failed"
        console.log(e)
    }
}

//1. Allows a presale buyer to deposit Eth.  
//2. Tokens are allocated to the buyer based on the amount of ETH deposited
async function purchaseTokens(){
    const amountEth = document.getElementById("eth-deposit-amount").value
    const weiValue = ethers.utils.parseUnits(amountEth, "ether")

    try{
        const presaleContract = new ethers.Contract(presaleContractAddress, presaleContractAbi, provider)
        const purchaseTokensTx = await presaleContract.connect(signer).deposit({from: accountAddress, value: weiValue})
        const response = await purchaseTokensTx.wait()
        console.log(await response)
    
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
        const tokenSymbol = await tokenContract.symbol()
        const currentBalance = await presaleContract.getAccountBalance({from: accountAddress})
        const adjustedBalance = currentBalance / 1e18
        document.getElementById("amount-purchased").textContent = `Congratulations, you purchased ${adjustedBalance} ${tokenSymbol} tokens!`
    } catch(e){
        document.getElementById("amount-purchased").textContent = "Failed"
        console.log(e)
    }
}

/*
1. Allows the presale vesting contract (PresaleVesting.sol) to spend tokens (and determines the limit).
2. Allows the presale vesting contract owner to lock tokens in the contract. This is done by transferring tokens 
   from owner's wallet (where new tokens were minted) to the Presale Vesting contract. 
3. For this function to work properly, the same address needs to have deployed (own) both contracts 
  (TokenGenerator.sol and PresaleVesting.sol)
*/
async function lockPresaleTokens() {
    const numTokensToLock = document.getElementById("numLockedPresaleTokens").value
    const decimals = 18
    const amountFormatted = ethers.utils.parseUnits(numTokensToLock, decimals);
    presaleTokenLockDuration = document.getElementById("presaleLockDuration").value

    try{
        //Sets the approval (for the presale vesting contract to spend the new tokens) and sets the spending limit
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
        const approveSpendTx = await tokenContract.connect(signer).approve(presaleContractAddress, amountFormatted)
        const response1 = await approveSpendTx.wait()
        console.log(await response1)
    
        //Locks the new tokens by transferring them to the presale vesting contract
        const presaleContract = new ethers.Contract(presaleContractAddress, presaleContractAbi, provider)
        const lockTokensTx = await presaleContract.connect(signer).lock(amountFormatted, presaleTokenLockDuration)
        const response2 = await lockTokensTx.wait()
        console.log(await response2)
        presaleLockingDate = new Date().toLocaleString();
        const amountLocked = await presaleContract.lockAmount()
    
        console.log(amountLocked / 1e18)
    
        document.getElementById("num-presale-tokens-locked").textContent = `Total number of tokens locked: ${amountLocked / 1e18}`
        document.getElementById("date-of-presale-locking").textContent = `Date of locking: ${presaleLockingDate}`
        document.getElementById("presale-lockup-duration").textContent = `Total number of days locked: ${presaleTokenLockDuration}`
    } catch(e){
        document.getElementById("num-presale-tokens-locked").textContent = "Failed"
        console.log(e)
    }

}

//Allows a presale buyer to see their token balance
async function getPresaleBalance(){
    try{
        const presaleContract = new ethers.Contract(presaleContractAddress, presaleContractAbi, provider)
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
        const tokenSymbol = await tokenContract.symbol()
        const currentBalance = await presaleContract.getAccountBalance({from: accountAddress})
        console.log(`Your current balance = ${currentBalance / 1e18} ${tokenSymbol} tokens`)
        document.getElementById("presale-balance").textContent = `Your current balance = ${currentBalance / 1e18} ${tokenSymbol} tokens`
    } catch(e){
        document.getElementById("presale-balance").textContent = "Failed"
        console.log(e)
    }
}

//Allows presale buyer to withdraw their tokens from the presale vesting contract after the vesting period is over
async function withdrawPresaleTokens(){
    const numTokens = document.getElementById("presaleAmount").value

    try {
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
        const tokenSymbol = await tokenContract.symbol()
        const presaleContract = new ethers.Contract(presaleContractAddress, presaleContractAbi, provider)
        const withdrawTokensTx = await presaleContract.connect(signer).withdraw(numTokens, {from: accountAddress})
        const response = await withdrawTokensTx.wait()
        console.log(await response)
        document.getElementById("presale-token-withdrawal-confirmation").textContent = `${numTokens} ${tokenSymbol} tokens successfully withdrawn`
    } catch(e){
        console.log(e)
        document.getElementById("presale-token-withdrawal-confirmation").textContent = `Error: ${e.data.message}`
    } 
    
}

//Sets the presale contract address variable (needed for the presale and withdraw pages of the site)
function getPresaleAddress(){
    presaleContractAddress = document.getElementById("presale-contract-address-input").value
    document.getElementById("submit-presale-address-confirmation").textContent = "Presale Contract Address Received"
}

//1. Gets the conversion rate (number of tokens per ETH).
//2. This conversion rate is displayed to the presale buyer at time of purchase 
//   (they need know how many tokens their ETH will purchase). 
async function getConversionRate() {
    
    try{
        const presaleContract = new ethers.Contract(presaleContractAddress, presaleContractAbi, provider)
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
        const tokenSymbol = await tokenContract.symbol()
        const ethConversionRate = await presaleContract.tokensPerEth()
        document.getElementById("tokens-per-eth").textContent = `You will receive = ${ethConversionRate} ${tokenSymbol} tokens for every 1 ETH deposited`
    } catch(e){
        document.getElementById("tokens-per-eth").textContent = "Failed"
        console.log(e)
    }
}


