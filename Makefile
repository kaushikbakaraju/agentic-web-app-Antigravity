.PHONY: setup test test-frontend test-backend dev-frontend dev-backend build clean

setup:
	@echo "Setting up dependencies..."
	cd frontend && npm install
	cd backend && ./mvnw clean compile

test: test-frontend test-backend

test-frontend:
	@echo "Running frontend tests..."
	cd frontend && npm run test

test-backend:
	@echo "Running backend tests..."
	cd backend && ./mvnw clean test

dev-frontend:
	@echo "Starting frontend dev server..."
	cd frontend && npm run dev

dev-backend:
	@echo "Starting backend server..."
	cd backend && ./mvnw spring-boot:run

build:
	@echo "Building application..."
	cd frontend && npm run build
	cd backend && ./mvnw clean package

clean:
	@echo "Cleaning up build directories..."
	rm -rf frontend/dist
	cd backend && ./mvnw clean
