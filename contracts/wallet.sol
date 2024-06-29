// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Wallet {
    mapping(address => uint) Wallets;

    function retirer(address payable _to, uint _amount) external {
        require(_amount <= Wallets[msg.sender], "Solde Insuffisant");
        Wallets[msg.sender] -= _amount; // Déduire le montant au lieu de réinitialiser
        _to.transfer(_amount);
    }

    
    function getBalance() external view returns (uint) {
        return Wallets[msg.sender];
    }

    receive() external payable {
        
    }

    fallback() external payable {}
}
