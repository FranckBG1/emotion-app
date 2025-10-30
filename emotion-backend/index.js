// === index.js ===
const express = require("express");
const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

// ✅ CORS pour autoriser les appels depuis ton frontend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ✅ Initialisation Firestore
const firestore = new Firestore({
  projectId: "orientation-app-475716",
  databaseId: "orientation-app-database",
});
const collection = firestore.collection("emotions");

// ✅ Vérification que le frontend existe
const FRONTEND_DIR = path.join(__dirname, "../emotion-frontend");
if (!fs.existsSync(FRONTEND_DIR)) {
  console.error("❌ FRONTEND_DIR introuvable :", FRONTEND_DIR);
  process.exit(1); // Bloque le démarrage si frontend absent
}

// ✅ Vérification du dossier models (face-api.js)
const MODEL_DIR = path.join(FRONTEND_DIR, "models");
if (!fs.existsSync(MODEL_DIR)) {
  console.error("❌ Dossier models introuvable :", MODEL_DIR);
  process.exit(1); // Bloque le démarrage si models absent
}

// ✅ Servir le frontend (HTML + JS + models)
app.use(express.static(FRONTEND_DIR));

// Route principale
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// ✅ Route POST pour recevoir et enregistrer les émotions
app.post("/api/emotions", async (req, res) => {
  const { user_id, session_id, mood, confidence, timestamp } = req.body;

  if (!user_id || !session_id || !mood || !confidence || !timestamp) {
    return res.status(400).json({ error: "Champs manquants ou invalides" });
  }

  try {
    await collection.add({
      user_id,
      session_id,
      mood,
      confidence,
      timestamp,
      received_at: new Date().toISOString(),
    });

    console.log("📥 Enregistrement Firestore :", req.body);
    res.status(200).json({ message: "Émotion enregistrée avec succès" });
  } catch (error) {
    console.error("❌ Erreur Firestore :", error);
    res.status(500).json({ error: "Erreur serveur lors de l’enregistrement" });
  }
});

// ✅ Lancement du serveur
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur port ${PORT}`);
});
