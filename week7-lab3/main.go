package main

import (
	"fmt"
	"os"

	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func getEnv(key, dafaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return dafaultValue
}

var db *sql.DB

func initDB() {
	var err error
	host := getEnv("DB_HOST", "")
	name := getEnv("DB_NAME", "")
	user := getEnv("DB_USER", "")
	password := getEnv("DB_PASSWORD", "")
	port := getEnv("DB_PORT", "")

	conSt := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable ", host, port, user, password, name)
	fmt.Println(conSt)

	db, err = sql.Open("postgres", conSt)
	if err != nil {
		log.Fatal("falled to open database", err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatal("failed to connect to database", err)
	}
	log.Println("successfully connected to database")
}
func main() {
	initDB()
}
