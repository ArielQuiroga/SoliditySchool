// SPDX-License-Identifier:MIT
pragma solidity >=0.8.2 <0.9.0;

import "./utils/erc20Mintable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract faucet is Ownable {
  uint public timeToDeliver = 1 hours;
  uint public amountPerDeliver = 1000;
  
  mapping(address => bool) public tokensCanBeMint;
  mapping(address => bool) public tokensBlance;
  mapping(address => uint) public toDeliver;
  mapping(address user => mapping(address token => uint lastClaim)) public claims;

  constructor(address token) {
    tokensCanBeMint[token] = true;
  }

  function addMintableToken(address token) public {
    tokensCanBeMint[token] = true;
  }

  function addBalanceToken(address token, uint amount) public {
    tokensBlance[token] = true;
    ERC20(token).transferFrom(msg.sender, address(this), amount);
  }

  function claim(erc20Mintable token) public {
    require(claims[msg.sender][address(token)] < block.timestamp);
    uint amount = 1000 * 10 ** token.decimals();
    
    if(tokensBlance[address(token)]){
      require(token.balanceOf(address(this)) >= amount);
      token.transfer(msg.sender, amount);      
    }else{
      token.mint(msg.sender, amount);
    }

    claims[msg.sender][address(token)] = block.timestamp + timeToDeliver;
  }


}