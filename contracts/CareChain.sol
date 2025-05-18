// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract CareChain {
//     enum Role { None, Doctor, Patient }

//     struct Doctor {
//         string referenceId;
//         string name;
//         string speciality;
//         string degree;
//         uint experience;
//         bool exists;
//     }

//     struct MedicalRecord {
//         string symptoms;
//         string allergies;
//         string bloodGroup;
//         string prescription;
//         address doctor;
//     }

//     mapping(address => Role) public roles;
//     mapping(address => Doctor) public doctors;
//     mapping(address => MedicalRecord[]) public records;

//     modifier onlyDoctor() {
//         require(roles[msg.sender] == Role.Doctor, "Only doctors allowed");
//         _;
//     }

//     modifier onlyPatient() {
//         require(roles[msg.sender] == Role.Patient, "Only patients allowed");
//         _;
//     }

//     function registerDoctor(
//         string memory _refId,
//         string memory _name,
//         string memory _speciality,
//         string memory _degree,
//         uint _experience
//     ) public {
//         require(roles[msg.sender] == Role.None, "Already registered");
//         doctors[msg.sender] = Doctor(_refId, _name, _speciality, _degree, _experience, true);
//         roles[msg.sender] = Role.Doctor;
//     }

//     function registerPatient() public {
//         require(roles[msg.sender] == Role.None, "Already registered");
//         roles[msg.sender] = Role.Patient;
//     }

//     function addMedicalRecord(
//         address _patient,
//         string memory _symptoms,
//         string memory _allergies,
//         string memory _bloodGroup,
//         string memory _prescription
//     ) public onlyDoctor {
//         require(roles[_patient] == Role.Patient, "Not a valid patient");
//         records[_patient].push(MedicalRecord(_symptoms, _allergies, _bloodGroup, _prescription, msg.sender));
//     }

//     function getMyRecords() public view onlyPatient returns (MedicalRecord[] memory) {
//         return records[msg.sender];
//     }

//     function getPatientRecords(address _patient) public view onlyDoctor returns (MedicalRecord[] memory) {
//         require(roles[_patient] == Role.Patient, "Not a valid patient");
//         return records[_patient];
//     }

//     function getDoctorProfile(address _doctor) public view returns (Doctor memory) {
//         return doctors[_doctor];
//     }

//     function getRole(address _user) public view returns (Role) {
//         return roles[_user];
//     }
// }



//run kr rha niche wala
// pragma solidity ^0.8.0;

// contract CareChain {
//     struct MedicalRecord {
//         string symptoms;
//         string allergies;
//         string bloodGroup;
//         string prescription;
//         address doctor;
//     }

//     mapping(address => MedicalRecord[]) private records;

//     address public admin;

//     constructor() {
//         admin = msg.sender;
//     }

//     modifier onlyDoctor() {
//         // You can expand this with a proper doctor registry
//         require(msg.sender != address(0), "Invalid doctor");
//         _;
//     }

//     function addMedicalRecord(
//         address patient,
//         string memory symptoms,
//         string memory allergies,
//         string memory bloodGroup,
//         string memory prescription
//     ) public onlyDoctor {
//         records[patient].push(
//             MedicalRecord(symptoms, allergies, bloodGroup, prescription, msg.sender)
//         );
//     }

//     function getMyRecords() public view returns (MedicalRecord[] memory) {
//         return records[msg.sender];
//     }

//     function getPatientRecords(address patient) public view returns (MedicalRecord[] memory) {
//         return records[patient];
//     }
// }
// run kr rha upr wala


pragma solidity ^0.8.0;

contract CareChain {
    struct MedicalRecord {
        string symptoms;
        string allergies;
        string bloodGroup;
        string prescription;
        address doctor;
    }

    struct Doctor {
        string referenceId;
        string name;
        string speciality;
        string degree;
        string experience;
        bool isRegistered;
    }

    mapping(address => MedicalRecord[]) private records;
    mapping(address => Doctor) public doctors;

    address public admin;

    event DoctorRegistered(address indexed doctorAddress, string name);
    event MedicalRecordAdded(address indexed patient, address indexed doctor);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyDoctor() {
        require(doctors[msg.sender].isRegistered, "Only registered doctors can perform this action");
        _;
    }

    function registerDoctor(
        string memory referenceId,
        string memory name,
        string memory speciality,
        string memory degree,
        string memory experience
    ) public {
        require(!doctors[msg.sender].isRegistered, "Doctor already registered");
        
        doctors[msg.sender] = Doctor({
            referenceId: referenceId,
            name: name,
            speciality: speciality,
            degree: degree,
            experience: experience,
            isRegistered: true
        });

        emit DoctorRegistered(msg.sender, name);
    }

    function addMedicalRecord(
        address patient,
        string memory symptoms,
        string memory allergies,
        string memory bloodGroup,
        string memory prescription
    ) public onlyDoctor {
        records[patient].push(
            MedicalRecord(symptoms, allergies, bloodGroup, prescription, msg.sender)
        );
        emit MedicalRecordAdded(patient, msg.sender);
    }

    function getMyRecords() public view returns (MedicalRecord[] memory) {
        return records[msg.sender];
    }

    function getPatientRecords(address patient) public view returns (MedicalRecord[] memory) {
        return records[patient];
    }

    function isDoctorRegistered(address doctor) public view returns (bool) {
        return doctors[doctor].isRegistered;
    }
}