# GrubGo Food Delivery Application

## Contributors

- IT22352330 W R V A Malith Gihan
- IT22000644 M N Dikkumbura
- IT22347794 D J Shenal
- IT22051448 Christy Kingsley

## 🧩 Services

- **Auth Service**
- **User Service**
- **Restaurant Service**
- **Payment Service**
- **Order Service**
- **Delivery Service**
- **Notification Service**
- **Map Service**
- **Review Service**

### 🧰 Backend & Runtime

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) [Node.js](https://nodejs.org/) (Recommended: Latest LTS)
- ![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) [Express.js](https://expressjs.com/)

### 🖥 Frontend

- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) [React](https://reactjs.org/)
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) [Vite](https://vitejs.dev/)

### 📦 Package Manager

- ![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white) [npm](https://www.npmjs.com/)
- ![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=flat&logo=yarn&logoColor=white) [Yarn](https://yarnpkg.com/) (Optional)

### 🐳 Containerization

- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) [Docker](https://www.docker.com/)

### ☸️ Kubernetes & Deployment

- ![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white) [Kubernetes](https://kubernetes.io/)
- ![Kustomize](https://img.shields.io/badge/Kustomize-7B42BC?style=flat&logo=kustomize&logoColor=white) [Kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/)
- ![Minikube](https://img.shields.io/badge/Minikube-8A42F2?style=flat&logo=minikube&logoColor=white) [Minikube](https://minikube.sigs.k8s.io/docs/start/)

### 📨 Messaging & Database

- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) [MongoDB](https://www.mongodb.com/)
- ![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat&logo=rabbitmq&logoColor=white) [RabbitMQ](https://www.rabbitmq.com/)

## 🚀 Frontend Setup (React + Vite)

### Prerequisites

- Node.js (v19+)
- npm or yarn

### Steps

1. Navigate to the frontend directory:

   ```bash
   npm install
    # or
   yarn install

   ```

2. Install dependencies:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. The frontend should now be running at:
   ```bash
   http://localhost:5173
   ```

## 🧱 Kubernetes Deployment using Kustomize

### Prerequisites

- Kubectl
- Kustomize
- Minikube

1. Start Minikube:

   ```bash
   minikube start
   ```

2. Navigate to the Kubernetes base directory:

   ```bash
   cd k8s/base
   ```

3. Navigate to the Kubernetes base directory:

   ```bash
   cd k8s/base
   ```

4. Navigate to the Kubernetes base directory:

   ```bash
   kubectl apply -k .
   ```

5. To expose the ingress controller and allow external access to the services, run:

   ```bash
   minikube tunnel
   ```
