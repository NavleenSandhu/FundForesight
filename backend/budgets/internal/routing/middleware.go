package routing

import (
    "log"
    "net/http"
    "time"
)

// ResponseWriterWrapper is a custom wrapper to capture the status code and response size.
type ResponseWriterWrapper struct {
    http.ResponseWriter
    StatusCode   int
    ResponseSize int
}

// WriteHeader captures the status code
func (rw *ResponseWriterWrapper) WriteHeader(statusCode int) {
    rw.StatusCode = statusCode
    rw.ResponseWriter.WriteHeader(statusCode)
}

// Write captures the response size
func (rw *ResponseWriterWrapper) Write(b []byte) (int, error) {
    size, err := rw.ResponseWriter.Write(b)
    rw.ResponseSize += size
    return size, err
}

// LoggingMiddleware logs detailed information about each incoming HTTP request and response.
func LoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()

        // Wrap the ResponseWriter
        wrappedWriter := &ResponseWriterWrapper{ResponseWriter: w, StatusCode: http.StatusOK}

        // Log request details
        log.Printf("Started %s %s from %s User-Agent: %s",
            r.Method, r.RequestURI, r.RemoteAddr, r.Header.Get("User-Agent"))

        // Call the next handler
        next.ServeHTTP(wrappedWriter, r)

        // Log response details
        log.Printf("Completed %s %s with status %d, response size %d bytes in %v",
            r.Method, r.RequestURI, wrappedWriter.StatusCode, wrappedWriter.ResponseSize, time.Since(start))
    })
}
