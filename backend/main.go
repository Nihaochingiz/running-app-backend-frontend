package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/hello", corsMiddleware(handleHello))

	// Start the server
	http.ListenAndServe(":8000", nil)
}

// CORS middleware to handle CORS preflight requests
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// handleHello handles the /hello endpoint
func handleHello(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		fmt.Fprintln(w, "Hello")
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
