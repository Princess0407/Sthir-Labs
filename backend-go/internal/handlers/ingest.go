package handlers

import (
	"backend-go/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateLandRecord handles the POST request to save a new record
func CreateLandRecord(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input models.LandRecord

		// 1. Bind the incoming JSON to our struct
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// 2. Save the record into the database
		if err := db.Create(&input).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save record"})
			return
		}

		// 3. Return success
		c.JSON(http.StatusOK, gin.H{"message": "Record ingested successfully", "ulpin": input.ULPIN})
	}
}
