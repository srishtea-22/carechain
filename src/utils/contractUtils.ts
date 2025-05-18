// import Web3 from "web3";
// import CareChainContract from "../../build/contracts/CareChain.json";

// let web3: Web3;
// let contract: any;

// export const loadContract = async () => {
//   if ((window as any).ethereum) {
//     web3 = new Web3((window as any).ethereum);
//     await (window as any).ethereum.enable();
//     const accounts = await web3.eth.getAccounts();
//     const networkId = await web3.eth.net.getId();
//     // const deployed = (CareChainContract.networks as any)[networkId];
//     const deployed = (CareChainContract.networks as any)[networkId.toString()];

//     contract = new web3.eth.Contract(CareChainContract.abi, deployed.address);
//     return { web3, account: accounts[0], contract };
//   } else {
//     alert("Install MetaMask");
//     return null;
//   }
// };
//upr run ho rha hau






import Web3 from "web3";
import CareChainContract from "../../build/contracts/CareChain.json";
import BloodDonationContract from "../../build/contracts/BloodDonation.json";

let web3: Web3;
let careChainContract: any;
let bloodDonationContract: any;

export const loadContract = async () => {
  if ((window as any).ethereum) {
    web3 = new Web3((window as any).ethereum);
    await (window as any).ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();

    // Load main CareChain contract (existing functionality)
    const careChainDeployed = (CareChainContract.networks as any)[networkId.toString()];
    careChainContract = new web3.eth.Contract(CareChainContract.abi, careChainDeployed.address);

    // Load BloodDonation contract (new functionality)
    const bloodDonationDeployed = (BloodDonationContract.networks as any)[networkId.toString()];
    bloodDonationContract = new web3.eth.Contract(BloodDonationContract.abi, bloodDonationDeployed.address);

    return { 
      web3, 
      account: accounts[0], 
      contract: careChainContract, // Maintain backward compatibility
      donationContract: bloodDonationContract // New addition
    };
  } else {
    alert("Install MetaMask");
    return null;
  }
};

// Existing functions (unchanged)
export const getMedicalRecords = async (patientAddress: string) => {
//   const { contract, account } = await loadContract();
const data = await loadContract();
if (!data) {
  // Handle error (show message to user)
  return;
}
const { contract, account } = data;
  return await contract.methods.getPatientRecords(patientAddress).call({ from: account });
};

export const addMedicalRecord = async (
  patientAddress: string,
  symptoms: string,
  allergies: string,
  bloodGroup: string,
  prescription: string
) => {
//   const { contract, account } = await loadContract();
const data = await loadContract();
if (!data) {
  // Handle error (show message to user)
  return;
}
const { contract, account } = data;
  return await contract.methods
    .addMedicalRecord(patientAddress, symptoms, allergies, bloodGroup, prescription)
    .send({ from: account });
};

// New donation functions
export const registerAsDonor = async (bloodType: string) => {
//   const { donationContract, account } = await loadContract();
const data = await loadContract();
if (!data) {
  // Handle error (show message to user)
  return;
}
const { donationContract, account } = data;
  return await donationContract.methods
    .registerDonor(bloodType)
    .send({ from: account });
};

export const findMatchingDonors = async (bloodType: string) => {
//   const { donationContract } = await loadContract();
const data = await loadContract();
if (!data) {
  // Handle error (show message to user)
  return;
}
const { donationContract } = data;
  const donors = await donationContract.methods
    .findDonors(bloodType)
    .call();
//   return donors.filter(addr => addr !== '0x0000000000000000000000000000000000000000');
return donors.filter((addr: string) => addr !== '0x0000000000000000000000000000000000000000');
};

// Helper function for components that only need donation contract
// export const loadDonationContract = async () => {
//   const data = await loadContract();
//   return { 
//     contract: data.donationContract, 
//     account: data.account 
//   };
// };
export const loadDonationContract = async (): Promise<{ contract: any; account: string } | null> => {
  const data = await loadContract();
  if (!data) {
    console.error("Failed to load contracts");
    return null;
  }
  return { 
    contract: data.donationContract, 
    account: data.account 
  };
};




