# NEXUS-AI — Realtime GenAI Customer Support & Voice Operations Platform

<div align="center">

![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248.svg?style=flat\&logo=mongodb\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23000000.svg?style=flat\&logo=express\&logoColor=white)
![React](https://img.shields.io/badge/React%2019-%2320232a.svg?style=flat\&logo=react\&logoColor=%2361DAFB)
![Node.js](https://img.shields.io/badge/Node.js-%23339933.svg?style=flat\&logo=node.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat\&logo=typescript\&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-%23000000.svg?style=flat\&logo=socket.io\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-%2306B6D4.svg?style=flat\&logo=tailwindcss\&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=flat\&logo=google\&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-Cloud-orange?style=flat\&logo=amazonaws\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=flat\&logo=docker\&logoColor=white)

### AI-Powered Realtime Customer Support & Voice Operations Infrastructure

NEXUS-AI is a production-grade GenAI customer support platform built with the MERN stack, Socket.IO, and Google Gemini. The platform enables businesses to deploy intelligent AI support agents capable of handling realtime customer conversations, automated ticket resolution, AI-powered summaries, multilingual assistance, and live operational analytics.

Designed with enterprise-grade architecture principles, the platform combines realtime websocket communication, scalable REST APIs, AI workflow orchestration, and cloud-native deployment infrastructure into a unified SaaS experience.

</div>

---

# Features

## Realtime Customer Support Infrastructure

* Realtime support conversations powered by Socket.IO
* Live support ticket management and session handling
* AI-assisted customer communication workflows
* Typing indicators, read receipts, and delivery acknowledgements
* Multi-session concurrent websocket handling
* Live customer activity and support agent tracking
* Push notifications for unresolved or inactive tickets

---

## AI-Powered Support Workflows

* AI-generated customer responses using Google Gemini
* Streaming AI responses with realtime chunk rendering
* AI ticket summarization and resolution generation
* AI sentiment analysis for customer interactions
* Smart support ticket categorization
* Context-aware AI conversation memory
* Multilingual AI assistance support
* Suggested AI replies for support agents

---

## Voice AI Operations

* Realtime voice-to-text transcription
* AI-powered speech response workflows
* Voice session management
* Live conversation transcript rendering
* AI voice assistant infrastructure
* Speech latency monitoring and analytics
* Voice interaction telemetry dashboard

---

## Analytics & Monitoring Dashboard

* Active support agent tracking
* Open support ticket monitoring
* AI response accuracy metrics
* GenAI token usage analytics
* Realtime websocket connection monitoring
* AI resolution performance graphs
* Support category distribution analytics
* Live system telemetry insights

---

## Authentication & Security

* JWT authentication with protected API routes
* Role-based access control (Admin, Support Agent, Customer)
* OTP-based email verification
* Secure password hashing using bcrypt
* Protected websocket authentication middleware
* Rate limiting and API validation
* Session persistence and refresh workflows

---

## Cloud & Deployment Infrastructure

* Dockerized frontend and backend services
* AWS cloud integration
* S3 media uploads with pre-signed URLs
* Modular backend architecture
* Production-ready environment configuration
* CI/CD friendly deployment structure

---

# Tech Stack

| Layer                   | Technology                                       |
| ----------------------- | ------------------------------------------------ |
| Frontend                | React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend                 | Node.js, Express.js                              |
| Database                | MongoDB (Mongoose)                               |
| Realtime Infrastructure | Socket.IO                                        |
| GenAI                   | Google Gemini API                                |
| Voice AI                | Web Speech API / Whisper API                     |
| Authentication          | JWT, bcrypt                                      |
| Cloud Services          | AWS S3                                           |
| Deployment              | Docker, Docker Compose                           |
| State Management        | Context API                                      |
| Charts & Analytics      | Recharts                                         |

---

# Core Platform Modules

## AI Support Engine

Handles:

* AI-generated replies
* ticket summarization
* multilingual responses
* customer intent classification
* support categorization

---

## Realtime Communication Layer

Powered by Socket.IO:

* live conversations
* typing indicators
* websocket rooms
* online presence
* ticket status synchronization

---

## Voice Operations Engine

Supports:

* speech-to-text workflows
* AI-generated voice responses
* realtime transcript rendering
* voice session telemetry

---

## Analytics & Admin Dashboard

Provides:

* AI token monitoring
* live session analytics
* response latency tracking
* support workload insights
* customer interaction metrics

---

# Architecture Overview

```txt
Frontend (React + Tailwind)
        ↓
Socket.IO Realtime Layer
        ↓
Node.js + Express Backend
        ↓
AI Workflow Orchestration Layer
(Google Gemini APIs)
        ↓
MongoDB Database
        ↓
AWS Cloud Services + Docker Infrastructure
```

---

# Realtime Features

* Concurrent websocket communication
* Live support session handling
* Realtime notifications
* AI streaming responses
* Online/offline agent tracking
* Dynamic ticket synchronization
* Low-latency event broadcasting

---

# AI Workflow Pipeline

```txt
Customer Message
      ↓
Express API / Socket Event
      ↓
AI Context Builder
      ↓
Google Gemini Processing
      ↓
AI Response Generation
      ↓
Realtime Frontend Streaming
      ↓
Conversation & Analytics Storage
```

---

# Planned Enterprise Features

* AI call summarization
* CRM integrations
* AI lead qualification
* Voice call analytics
* AI escalation routing
* Multi-tenant SaaS architecture
* AI workflow automation engine
* Redis caching layer
* Kubernetes deployment support

---

# Project Structure

```txt
nexus-ai/
├── frontend/
├── backend/
├── docker-compose.yml
├── .env.example
├── nginx/
└── docs/
```

---

# Getting Started

## Clone the Repository

```bash
git clone https://github.com/your-username/nexus-ai.git
cd nexus-ai
```

---

## Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_BUCKET_NAME=
FRONTEND_URL=
VITE_API_URL=
```

---

# Run with Docker

```bash
docker compose up --build
```

---

# Local Development

## Backend

```bash
npm run dev
```

## Frontend

```bash
npm run dev
```

---

# Security Design

* JWT-secured REST APIs
* Protected websocket authentication
* Role-based authorization
* Rate limiting middleware
* Secure AI request handling
* Server-side validation
* Protected cloud uploads
* Environment-based secret management

---

# Future Scope

* AI Voice Calling Agents
* Automated KYC Workflows
* Insurance & Healthcare Integrations
* AI-powered call center infrastructure
* Enterprise workflow orchestration
* AI operational intelligence dashboards

---

