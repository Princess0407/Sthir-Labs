package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing a LandRecord
type SmartContract struct {
	contractapi.Contract
}

// LandRecord describes basic details of what makes up a land record on the ledger
type LandRecord struct {
	ULPIN               string `json:"ulpin"`
	OwnerID             string `json:"ownerId"`
	DocumentHash        string `json:"documentHash"`
	BoundaryCoordinates string `json:"boundaryCoordinates"` // Could be JSON string of coordinates
	Status              string `json:"status"`              // e.g., "Active", "InSuccession", "Transferred"
}

// RegisterLand issues a new land record to the world state with given details.
func (s *SmartContract) RegisterLand(ctx contractapi.TransactionContextInterface, ulpin string, ownerID string, documentHash string, boundaryCoordinates string) error {
	exists, err := s.LandRecordExists(ctx, ulpin)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the land record %s already exists", ulpin)
	}

	landRecord := LandRecord{
		ULPIN:               ulpin,
		OwnerID:             ownerID,
		DocumentHash:        documentHash,
		BoundaryCoordinates: boundaryCoordinates,
		Status:              "Active",
	}

	landRecordJSON, err := json.Marshal(landRecord)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(ulpin, landRecordJSON)
}

// ReadLandRecord returns the land record stored in the world state with given id.
func (s *SmartContract) ReadLandRecord(ctx contractapi.TransactionContextInterface, ulpin string) (*LandRecord, error) {
	landRecordJSON, err := ctx.GetStub().GetState(ulpin)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if landRecordJSON == nil {
		return nil, fmt.Errorf("the land record %s does not exist", ulpin)
	}

	var landRecord LandRecord
	err = json.Unmarshal(landRecordJSON, &landRecord)
	if err != nil {
		return nil, err
	}

	return &landRecord, nil
}

// TriggerSuccession updates property ownership to designated heirs based on Hindu Succession Act (2005).
// It accepts a DeathCertificateHash from a verified Oracle and automatically updates property ownership.
func (s *SmartContract) TriggerSuccession(ctx contractapi.TransactionContextInterface, ulpin string, newOwnerIDs []string, deathCertificateHash string) error {
	// In a real implementation, the deathCertificateHash would be verified against an Oracle or external auth provider.
	// For this prototype, we assume it's valid if provided.
	
	landRecord, err := s.ReadLandRecord(ctx, ulpin)
	if err != nil {
		return err
	}
	
	if landRecord.Status != "Active" {
		return fmt.Errorf("land record is not active, current status: %s", landRecord.Status)
	}

	// Hindu Succession Act (2005) principle: daughters have equal rights as sons.
	// We simulate this partition by accepting multiple heirs (newOwnerIDs).
	// Typically, the shares are equally divided among Class I heirs.
	// We will serialize the new owners into a single string for simplicity in the owner field,
	// or in an actual schema, change OwnerID to a list of owners. 
	// For this exercise, we join them as a comma-separated string if multiple.
	var newOwnerStr string
	for i, id := range newOwnerIDs {
		if i > 0 {
			newOwnerStr += ","
		}
		newOwnerStr += id
	}

	landRecord.OwnerID = newOwnerStr
	landRecord.Status = "Transferred - Succession (Act 2005)"
	// In a full implementation we might also store the deathCertificateHash on the record for audit.

	landRecordJSON, err := json.Marshal(landRecord)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(ulpin, landRecordJSON)
}

// LandRecordExists returns true when land record with given ID exists in world state
func (s *SmartContract) LandRecordExists(ctx contractapi.TransactionContextInterface, ulpin string) (bool, error) {
	landRecordJSON, err := ctx.GetStub().GetState(ulpin)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return landRecordJSON != nil, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		log.Panicf("Error creating Sovereign Vault chaincode: %v", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panicf("Error starting Sovereign Vault chaincode: %v", err)
	}
}
