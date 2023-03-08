// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.7.3/token/ERC20/IERC20.sol";

contract PresaleVesting {

    IERC20 public token;
    uint256 public lockDuration;
    uint256 public endLocking; 
    uint256 public lockAmount; 
    uint256 public tokensPerEth; 
    uint256 public availableTokenSupply; 
    bool locked = false; 
    address owner;

    //1. This mapping maps presale buyers their token balance.
    //2. This array captures the addresses of all the presale buyers.
    mapping(address => uint) balance;
    address[] presaleBuyers; 

    //1. The constructor passes in the contract address of the newly minted token to be vested.
    //2. It sets the owner to be the address that deployed PresaleVesting contract.
    //3. It determines the conversion rate (how many tokens can be purchased for 1 ETH). 
    constructor (address _token, uint _tokensPerEth){
        token = IERC20(_token); 
        owner = msg.sender; 
        tokensPerEth = _tokensPerEth; 
    }

    //1. This modifier restricts certain functions to the address that deployed the PresaleVesting contract. 
    modifier onlyOwner(){
        require(owner == msg.sender);
        _;
    }


    //1. The buyer can deposit Eth and is credited with appropriate amount of tokens. 
    //2. The available token supply is decremented accordingly.
    //3. The function reverts if there are no longer enough tokens available for the amount of ETH sent.
    function deposit() external payable {
        uint amountTokens = msg.value * tokensPerEth;
        require(availableTokenSupply >= amountTokens, "Not enough tokens are available for this purchase");  
        balance[msg.sender] = amountTokens;
        availableTokenSupply -= amountTokens; 
    }


    /*
      1. To use this function, first the token contract needs to allow the PresaleVesting contract to spend 
         (for the transferFrom function to work).
      2. The "owner" address needs to be the one that holds all the newly minted tokens. When the lock function is called, 
         it transfers tokens from the wallet of the minter (owner) to the PresaleVesting contract. 
      3. When calling this function, the "owner" needs to determine beforehand a) how many tokens are availble for the presale and 
         b) how long the tokens are to be locked (locking tokens can only be done once).
    */
    function lock(uint256 _amount, uint256 _expiry) external onlyOwner {
        require(!locked, "Tokens have already been locked"); 
        token.transferFrom(owner, address(this), _amount); 
        lockAmount = _amount;
        availableTokenSupply = _amount; 
        lockDuration = _expiry * 1 days;
        endLocking = block.timestamp + lockDuration; 
        locked = true; 
    }

     /*
      1. The presale buyer needs to enter how many tokens they wish to withdraw (non-presale buyers 
         won't have any balance to withdraw).
      2. The presale buyer's balance needs to be greater than or equal to the withdrawal amount.
      3. The tokens need to have been unlocked before they can be withdrawn.
    */
    function withdraw(uint _amount) external {
        require(block.timestamp > endLocking, "Tokens have not been unlocked");

        uint adjustedAmount = _amount * 1e18;
        require(balance[msg.sender] >= _amount, "You are trying to withdraw more tokens than you own"); 
        balance[msg.sender] -= adjustedAmount; 
        token.transfer(msg.sender, adjustedAmount); 
    }


    //This function returns the balance of the presale buyer calling the function.
    function getAccountBalance() external view returns (uint){
        return balance[msg.sender]; 
    }

    //This function returns the current block height as a timestamp.
    function getTime() external view returns (uint256) {
        return block.timestamp;
    }

}