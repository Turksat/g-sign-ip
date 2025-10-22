// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatentRegistryV3 {
    enum Status { Registered, Granted, NotGranted }

    struct Patent {
        address createdBy;
        string applicationNumber;
        string title;
        string description;
        string ipfsHash;
        Status status;
    }

    uint256 public patentCount = 0;

    mapping(uint256 => Patent) public patents;
    mapping(string => uint256) private appNoToId;
    mapping(string => bool) public isAppNoUsed;

    event PatentRegistered(uint256 indexed patentId, address indexed createdBy, string applicationNumber);
    event PatentGranted(uint256 indexed patentId);
    event PatentRejected(uint256 indexed patentId);

    // ✅ Yeni: Status kodu dışarıdan alınıyor
    function registerPatent(
        address createdBy,
        string memory applicationNumber,
        string memory title,
        string memory description,
        string memory ipfsHash,
        uint8 statusCode
    ) public returns (uint256) {
        require(!isAppNoUsed[applicationNumber], "Already registered");
        require(statusCode <= uint8(Status.NotGranted), "Invalid status code");

        Status status = Status(statusCode);

        patentCount++;
        patents[patentCount] = Patent(createdBy, applicationNumber, title, description, ipfsHash, status);
        appNoToId[applicationNumber] = patentCount;
        isAppNoUsed[applicationNumber] = true;

        emit PatentRegistered(patentCount, createdBy, applicationNumber);
        return patentCount;
    }

    function grantPatentByAppNo(string memory appNo) public {
        uint256 id = appNoToId[appNo];
        require(id != 0, "Patent not found");
        require(patents[id].status == Status.Registered, "Must be Registered");

        patents[id].status = Status.Granted;
        emit PatentGranted(id);
    }

    function rejectPatentByAppNo(string memory appNo) public {
        uint256 id = appNoToId[appNo];
        require(id != 0, "Patent not found");
        require(patents[id].status == Status.Registered, "Must be Registered");

        patents[id].status = Status.NotGranted;
        emit PatentRejected(id);
    }

    function getPatentIdByAppNo(string memory appNo) public view returns (uint256) {
        uint256 id = appNoToId[appNo];
        require(id != 0, "Patent not found");
        return id;
    }

    function getPatentById(uint256 id) public view returns (
        address createdBy,
        string memory applicationNumber,
        string memory title,
        string memory description,
        string memory ipfsHash,
        Status status
    ) {
        require(id != 0 && id <= patentCount, "Invalid ID");
        Patent memory p = patents[id];
        return (p.createdBy, p.applicationNumber, p.title, p.description, p.ipfsHash, p.status);
    }
}
b