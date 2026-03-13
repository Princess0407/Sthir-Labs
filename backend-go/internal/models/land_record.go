package models

import (
	"time"
)

// LandRecord is the blueprint for the "Single Version of Truth"
type LandRecord struct {
	ID                 uint      `gorm:"primaryKey" json:"id"`
	ULPIN              string    `gorm:"uniqueIndex;type:varchar(14)" json:"ulpin"` // 14-digit Unique Land Parcel ID
	OwnerName          string    `json:"owner_name"`
	IsOwnerAlive       bool      `gorm:"default:true" json:"is_owner_alive"`              // Vital for Succession Automation
	Coordinates        string    `gorm:"type:geometry(Geometry,4326)" json:"coordinates"` // PostGIS Spatial Data
	DocumentHash       string    `json:"document_hash"`                                   // SHA-256 fingerprint for Blockchain
	VerificationStatus string    `gorm:"default:'Pending'" json:"verification_status"`    // Clean, Discrepancy, or Litigated
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}
