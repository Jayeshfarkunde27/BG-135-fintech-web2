const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin with default configuration.
// By default, it will use application default credentials when deployed.
admin.initializeApp();
const db = admin.firestore();

const app = express();
// Enable CORS for all routes and origins
app.use(cors({ origin: true }));
app.use(express.json());

// Users Collection Reference
const usersCollection = 'users';

// Middleware to protect routes with Firebase Auth
const authenticate = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    // Optionally allow unauthenticated access for demo, or reject it:
    // return res.status(403).send({ error: "Unauthorized" });
    // For this project, we'll enforce authentication
    return res.status(403).send({ error: "Unauthorized" });
  }

  const idToken = req.headers.authorization.split("Bearer ")[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
  } catch (error) {
    console.error("Error verifying auth token", error);
    res.status(403).send({ error: "Unauthorized" });
  }
};

// 1. Create a new user
app.post("/users", authenticate, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).send({ error: "Name and email are required" });
    }
    
    // Add document to Firestore
    const docRef = await db.collection(usersCollection).add({
      name,
      email,
      phone: phone || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).send({ id: docRef.id, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// 2. Get all users
app.get("/users", authenticate, async (req, res) => {
  try {
    const snapshot = await db.collection(usersCollection).get();
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).send(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// 3. Get a single user by ID
app.get("/users/:id", authenticate, async (req, res) => {
  try {
    const doc = await db.collection(usersCollection).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// 4. Update a user
app.put("/users/:id", authenticate, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userRef = db.collection(usersCollection).doc(req.params.id);
    
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).send({ error: "User not found" });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await userRef.update(updates);
    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// 5. Delete a user
app.delete("/users/:id", authenticate, async (req, res) => {
  try {
    const userRef = db.collection(usersCollection).doc(req.params.id);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).send({ error: "User not found" });
    }
    
    await userRef.delete();
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Expose the Express API as a single Cloud Function
// Access via URL /api/users
exports.api = functions.https.onRequest(app);
