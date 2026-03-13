package main

import (
	"fmt"
	"log"

	"backend-go/internal/handlers" // Added this
	"backend-go/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "host=localhost user=admin password=your_secure_password dbname=land_records port=5432 sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database: ", err)
	}

	fmt.Println("🚀 Database connection successful!")

	err = db.AutoMigrate(&models.LandRecord{})
	if err != nil {
		log.Fatal("Migration failed: ", err)
	}

	r := gin.Default()

	// --- NEW STUFF BELOW ---

	// Route for ingesting a new land record
	// We pass the 'db' variable so the handler can use it
	r.POST("/records", handlers.CreateLandRecord(db))

	// --- NEW STUFF ABOVE ---

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "online"})
	})

	fmt.Println("📡 Server starting on port 8080...")
	r.Run(":8080")
}
