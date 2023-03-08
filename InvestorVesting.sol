// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.7.3/token/ERC20/IERC20.sol";

contract InvestorVesting {

    IERC20 public token;
    uint256 public amount;
    uint256 public lockDuration;
    uint256 public endLocking; 
    bool locked = false; 
    address owner;

    //1. This mapping maps whitelisted investors to their token balance.
    //2. This array captures the addresses of all the investors.
    mapping(address => uint) balance;
    address[] investors; 

    //1. This constructor passes in the contract address of the newly minted token to be vested.
    //2. It also sets the owner to be the address that deployed the InvestorVesting contract.
    constructor (address _token){
        token = IERC20(_token); 
        owner = msg.sender; 
    }

    //1. This modifier restricts certain functions to the address that deployed the InvestorVesting contract.
    modifier onlyOwner(){
        require(owner == msg.sender);
        _;
    }

    //1. This function allows the contract owner to add investor addresses (a whitelist), along with 
    //   with how many tokens each investor gets. 
    function addInvestorAddress(address _investor, uint _amount) external onlyOwner {
         balance[_investor] = _amount;
         investors.push(_investor); 
    }


    /*
      1. To use this function, first the token contract needs to allow the InvestorVesting contract to spend 
         (for the transferFrom function to work)
      2. The "owner" address needs to be the one that holds all the newly minted tokens. When the lock function is called, 
         it transfers tokens from the wallet of the minter (owner) to the InvestorVesting contract. 
      3. When calling this function, the "owner" needs to determine beforehand a) how many tokens go to the investors and 
         b) how long the tokens are to be locked (locking tokens can only be done once)
    */
    function lock(uint256 _amount, uint256 _expiry) external onlyOwner {
        require(!locked, "Tokens have already been locked"); 
        token.transferFrom(owner, address(this), _amount); 
        amount = _amount;
        lockDuration = _expiry * 1 days;
        endLocking = block.timestamp + lockDuration; 
        locked = true; 
    }

 
    /*
      1. A whitelisted investor needs to enter the amount of withdrawal desired (non-whitelisted investors 
          won't have any balance to withdraw).
      2. The whitelisted investor balance needs to be greater than or equal to the withdrawal amount.
      3. The tokens need to have been unlocked before they can be withdrawn.
    */
    function withdraw(uint _amount) external {
        require(block.timestamp > endLocking, "Tokens have not been unlocked");

        uint adjustedAmount = _amount / 1e18;
        require(balance[msg.sender] >= adjustedAmount, "You are trying to withdraw more tokens than you own"); 
        balance[msg.sender] -= adjustedAmount; 
        token.transfer(msg.sender, _amount); 
    }


    //This function returns the balance of the whitelisted investor calling the function.
    function getAccountBalance() external view returns (uint){
        return balance[msg.sender]; 
    }

    //This function returns an array containing the addresses of all the investors.
    function viewInvestors() external view returns (address[] memory){
        return investors; 
    }

    //This function returns the current block height as a timestamp.
    function getTime() external view returns (uint256) {
        return block.timestamp;
    }

}





