package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func connect() (*sql.DB, error) {
	bin, err := os.ReadFile("/run/secrets/db-password")
	if err != nil {
		return nil, err
	}
	return sql.Open("postgres", fmt.Sprintf("postgres://postgres:%s@db:5432/example?sslmode=disable", string(bin)))
}

type RunningStatistic struct {
	ID        int       `json:"id"`
	Date      string    `json:"date"`
	Distance  string    `json:"distance"`
	Time      string    `json:"time"`
	CreatedAt time.Time `json:"created_at"`
}

type Response struct {
	Statistics []RunningStatistic `json:"statistics"`
}

func pingHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "Hello from running app")
}

// CORS middleware to handle CORS preflight requests
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func runningStatsHandler(w http.ResponseWriter, r *http.Request) {
	db, err := connect()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, date, distance, time, created_at FROM running_statistics")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close() // Close rows after we are done with them

	var stats []RunningStatistic
	for rows.Next() {
		var stat RunningStatistic
		if err = rows.Scan(&stat.ID, &stat.Date, &stat.Distance, &stat.Time, &stat.CreatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		stats = append(stats, stat)
	}

	response := Response{Statistics: stats}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Add remaining handlers (createRunningStat, deleteRunningStat, getRunningStat, updateRunningStat) below...

func main() {
	log.Print("Prepare db...")
	if err := prepare(); err != nil {
		log.Fatal(err)
	}

	log.Print("Listening on :8000")
	r := mux.NewRouter()
	r.Use(corsMiddleware)

	r.HandleFunc("/running-statistics", runningStatsHandler).Methods("GET")
	r.HandleFunc("/ping", pingHandler).Methods("GET")
	// Add remaining handlers (create, update, delete, get) here as per your initial code...

	log.Fatal(http.ListenAndServe(":8000", r))
}

func prepare() error {
	db, err := connect()
	if err != nil {
		return err
	}
	defer db.Close()

	for i := 0; i < 60; i++ {
		if err := db.Ping(); err == nil {
			break
		}
		time.Sleep(time.Second)
	}

	if _, err := db.Exec("DROP TABLE IF EXISTS running_statistics"); err != nil {
		return err
	}

	if _, err := db.Exec(`CREATE TABLE IF NOT EXISTS running_statistics (
		id SERIAL PRIMARY KEY,
		date VARCHAR(10),
		distance VARCHAR(10),
		time VARCHAR(10),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`); err != nil {
		return err
	}

	// Insert 10 test records
	_, err = db.Exec(`
		INSERT INTO running_statistics (date, distance, time) VALUES
		('2024-01-01', '5km', '00:25:00'),
		('2024-01-02', '10km', '00:50:00'),
		('2024-01-03', '7km', '00:35:00'),
		('2024-01-04', '12km', '01:00:00'),
		('2024-01-05', '8km', '00:40:00'),
		('2024-01-06', '15km', '01:15:00'),
		('2024-01-07', '3km', '00:15:00'),
		('2024-01-08', '21km', '01:45:00'),
		('2024-01-09', '5km', '00:28:00'),
		('2024-01-10', '10km', '00:55:00');
	`)
	if err != nil {
			log.Fatal(err)
		}

	fmt.Println("Records inserted successfully! 🎉📈")
	return nil
}
