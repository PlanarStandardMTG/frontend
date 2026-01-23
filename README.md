# Planar Standard Frontend
This repository contains the frontend code for the Planar Standard project. It is built using modern web technologies to provide a seamless user experience.

## Features
- Responsive design for various devices
- User-friendly interface
- Integration with backend services

## Backend API Endpoints
### Authentication
- Register: `POST /api/auth/register`
  - Request Body:
    - `email`: string
    - `password`: string
  - Response:
    - `userId`: string
    - `email`: string
- Login: `POST /api/auth/login`
  - Request Body:
    - `email`: string
    - `password`: string
  - Response:
    - `token`: string
- Get User Profile: `GET /api/users/me`
  - Headers:
    - `Authorization`: Bearer token
  - Response:
    - `userId`: string
