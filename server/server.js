const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./userSchema");
require('dotenv').config();

app.use(cors());

app.use(express.json());

const uri = process.env.mongodb; //used to connect to the prefered db


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000,
});

app.use(express.json()); // Middleware to parse JSON requests

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
    const db = client.db("loginSignupProject");
    const userCollections = db.collection("users");

    app.post("/signUp", async function (req, res) {
      try {
        console.log("signup");
        const { email, password, username } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        userCollections.insertOne({
          username: username,
          password: hashedPassword,
          email: email,
        });

        res.status(201).redirect("/login");
      } catch (error) {
        console.error(error);

        if (error.code === 11000 && error.keyPattern.username === 1) {
            // Unique constraint violation for username
            return res.status(400).json({ message: "Username already exists" });
          } else if (error.code === 11000 && error.keyPattern.email === 1) {
            // Unique constraint violation for email
            return res.status(400).json({ message: "Email already exists" });
          }
      
          res.status(500).json({ message: "Error registering user" });
      }
    });

    app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        const data = {
          username: email,
          password: password,
        };

        console.log("login");
        console.log(data);

        // const userCollections = db.collection("loginSignupProject");
        const user = await userCollections.findOne({ email: data.username });

        if (!user) {
          return console.log("User not found");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          // req.session.user = user;
          res.status(200).json({ message: "Login successful" });
          console.log("approved");
        } else {
          res.status(500).json({ message: "Error logging in" });
          console.log("not approved");
        }
      } catch (error) {
        console.log(error);
      }
    });

    const listener = app.listen(8888, function () {
      console.log("Listening on port " + listener.address().port);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
