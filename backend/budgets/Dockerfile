# Use the official Go image as a builder
FROM golang:latest

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files first
COPY go.mod .
COPY go.sum .

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the entire project to the working directory
COPY . .

# Build the Go app
RUN go build -o api cmd/api/main.go

# Expose port 6500 (or your desired port)
EXPOSE 6500

# Command to run the executable
CMD ["./api"]
