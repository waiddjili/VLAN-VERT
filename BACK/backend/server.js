const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Autorise seulement votre frontend local
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://walid23:123@cluster0.ubtxv.mongodb.net/VLAN';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// VLAN Schema & Model
const Vlan = require('./models/Vlan');

// Fonction pour exécuter un script Python
function runPythonScript(action, vlanId, vlanName = '') {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'vlan_operations.py');
    const command = `python "${scriptPath}" ${action} ${vlanId} "${vlanName}"`;
    console.log('Executing command:', command);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur lors de l'exécution du script : ${error.message}`);
        reject(`Erreur d'exécution : ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Erreur dans le script Python : ${stderr}`);
        reject(`Erreur dans le script : ${stderr}`);
        return;
      }
      console.log(`Script exécuté avec succès : ${stdout}`);
      resolve(stdout);
    });
  });
}

// API Routes

// 1. Ajouter un VLAN
app.post('/vlans', async (req, res) => {
  const { name, vlanId } = req.body;

  if (!name || !vlanId) {
    return res.status(400).json({ message: 'Name and vlanId are required.' });
  }

  try {
    const newVlan = new Vlan({ name, vlanId });
    await newVlan.save();

    const pythonResponse = await runPythonScript('add', vlanId, name);

    res.status(201).json({ message: 'VLAN ajouté avec succès.', vlan: newVlan, output: pythonResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du VLAN.', error });
  }
});

// 2. Obtenir tous les VLANs
app.get('/vlans', async (req, res) => {
  try {
    const vlans = await Vlan.find();
    res.status(200).json(vlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des VLANs.', error });
  }
});

// 3. Modifier un VLAN
app.put('/vlans/:id', async (req, res) => {
  const { id } = req.params;
  const { name, vlanId } = req.body;

  if (!name || !vlanId) {
    return res.status(400).json({ message: 'Name and vlanId are required.' });
  }

  try {
    const vlan = await Vlan.findByIdAndUpdate(id, { name, vlanId }, { new: true });
    if (!vlan) return res.status(404).json({ message: 'VLAN non trouvé.' });

    const pythonResponse = await runPythonScript('modify', vlanId, name);

    res.status(200).json({ message: 'VLAN modifié avec succès.', vlan, output: pythonResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la modification du VLAN.', error });
  }
});

// 4. Supprimer un VLAN
app.delete('/vlans/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const vlan = await Vlan.findByIdAndDelete(id);
    if (!vlan) return res.status(404).json({ message: 'VLAN non trouvé.' });

    const pythonResponse = await runPythonScript('delete', vlan.vlanId);

    res.status(200).json({ message: 'VLAN supprimé avec succès.', vlan, output: pythonResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression du VLAN.', error });
  }
});

// Middleware de log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "FRONT", "public")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "FRONT", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
