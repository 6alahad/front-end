const express = require("express");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `img_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/register", (req, res) => {
  const user = req.body;

  let users = [];
  if (fs.existsSync("users.json")) {
    const data = fs.readFileSync("users.json", "utf8");
    users = JSON.parse(data);
  }

  const nameExists = users.some(u => u.name === user.name);
  if (nameExists) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const emailExists = users.some(u => u.email === user.email);
  if (emailExists) {
    return res.status(400).json({ error: "Email is already registered" });
  }

  user.images = [];

  users.push(user);
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2), "utf8");

  res.status(200).json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (!fs.existsSync("users.json")) {
    return res.status(400).json({ error: "No users found" });
  }

  const data = fs.readFileSync("users.json", "utf8");
  const users = JSON.parse(data);

  const user = users.find(u => u.name === name);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  if (user.password !== password) {
    return res.status(400).json({ error: "Incorrect password" });
  }

  res.status(200).json({ message: "Login successful" });
});

app.post("/upload-image", upload.single("image"), (req, res) => {
  const { userName } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!fs.existsSync("users.json")) {
    return res.status(400).json({ error: "No users found" });
  }

  const users = JSON.parse(fs.readFileSync("users.json", "utf8"));

  const user = users.find(u => u.name === userName);
  if (!user) {
    fs.unlinkSync(file.path);
    return res.status(400).json({ error: "User not found" });
  }

  user.images = user.images || [];
  user.images.push(file.filename);

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2), "utf8");

  res.status(200).json({ message: "Image uploaded", filename: file.filename });
});

app.get("/profile/:userName", (req, res) => {
  const userName = req.params.userName;

  if (!fs.existsSync("users.json")) {
    return res.status(400).json({ error: "No users found" });
  }

  const users = JSON.parse(fs.readFileSync("users.json", "utf8"));

  const user = users.find(u => u.name === userName);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const images = (user.images || []).map(filename => `${req.protocol}://${req.get('host')}/uploads/${filename}`);

  res.status(200).json({
    name: user.name,
    email: user.email,
    images
  });
});

app.post("/delete-image", (req, res) => {
  const { userName, fileName } = req.body;

  if (!userName || !fileName) {
    return res.status(400).json({ error: "Missing userName or fileName" });
  }

  if (!fs.existsSync("users.json")) {
    return res.status(400).json({ error: "No users found" });
  }

  const users = JSON.parse(fs.readFileSync("users.json", "utf8"));
  const user = users.find(u => u.name === userName);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  if (!user.images || !user.images.includes(fileName)) {
    return res.status(400).json({ error: "Image not found in user's images" });
  }

  const filePath = path.join(__dirname, "uploads", fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  user.images = user.images.filter(img => img !== fileName);

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2), "utf8");

  res.status(200).json({ message: "Image deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
