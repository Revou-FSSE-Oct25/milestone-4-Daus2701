[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/PzCCy7VV)
# 🏦 RevoBank API (NestJS + Prisma)

A simple banking backend system built with **NestJS**, **Prisma**, and **JWT Authentication**.
Supports user management, account operations, and transactions.

---

## 🚀 Features

* 🔐 Authentication (Register, Login, JWT)
* 👤 User Management (CRUD)
* 🏦 Account Management
* 💰 Deposit & Transfer
* 🔁 Transaction Logging
* 📄 Swagger API Documentation

---

## 🛠 Tech Stack

* NestJS
* Prisma ORM
* PostgreSQL / SQLite
* JWT Authentication
* Swagger

---

## 📦 Installation

```bash
npm install
```

---

## ⚙️ Setup

1. Setup `.env`

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret"
```

2. Run Prisma

```bash
npx prisma migrate dev
```

3. Start server

```bash
npm run start:dev
```

---

## 📘 API Documentation

Swagger UI:

```
http://localhost:3000/api
```

---

## 🔐 Authentication Flow

1. Register user
2. Login → get `access_token`
3. Use token in requests:

```
Authorization: Bearer <token>
```

---

## 🧪 Example Flow

### 1. Register

```json
POST /auth/register
{
  "email": "user@mail.com",
  "password": "123456",
  "firstName": "John",
  "lastName": "Doe"
}
```

---

### 2. Login

```json
POST /auth/login
{
  "email": "user@mail.com",
  "password": "123456"
}
```

---

### 3. Create Account

```json
POST /accounts
{
  "userId": "USER_ID"
}
```

---

### 4. Deposit

```json
POST /accounts/deposit
{
  "accountId": "ACCOUNT_ID",
  "amount": 100
}
```

---

### 5. Transfer

```json
POST /accounts/transfer
{
  "fromId": "ACCOUNT_1",
  "toId": "ACCOUNT_2",
  "amount": 50
}
```

---

## 🗂 Project Structure

```
src/
 ├── auth/
 ├── user/
 ├── account/
 ├── prisma/
```

---

## 🧠 Notes

* Transactions are handled using Prisma `$transaction`
* Balance is updated atomically
* Role-based access (ADMIN / CUSTOMER) supported

---

## ✅ Status

✔ Authentication
✔ User CRUD
✔ Account & Transaction
✔ Swagger Documentation

---

## 👨‍💻 Author

Subarqah Firdhaus Hardiansyah
