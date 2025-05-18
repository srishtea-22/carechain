// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BloodDonation {
    struct Donor {
        string bloodType; // "A+", "O-", etc.
        bool isAvailable;
        uint lastDonation; // timestamp
    }
    
    mapping(address => Donor) public donors;
    address[] public donorList;
    
    event DonorRegistered(address donor, string bloodType);
    
    function registerDonor(string memory bloodType) public {
        require(bytes(bloodType).length > 0, "Blood type required");
        donors[msg.sender] = Donor(bloodType, true, 0);
        donorList.push(msg.sender);
        emit DonorRegistered(msg.sender, bloodType);
    }
    
    function findDonors(string memory neededType) public view returns (address[] memory) {
        address[] memory tempMatches = new address[](donorList.length);
        uint matchCount = 0;
        
        for(uint i = 0; i < donorList.length; i++) {
            address donorAddr = donorList[i];
            if(keccak256(bytes(donors[donorAddr].bloodType)) == keccak256(bytes(neededType)) 
               && donors[donorAddr].isAvailable) {
                tempMatches[matchCount] = donorAddr;
                matchCount++;
            }
        }
        
        address[] memory matches = new address[](matchCount);
        for(uint i = 0; i < matchCount; i++) {
            matches[i] = tempMatches[i];
        }
        
        return matches;
    }
}