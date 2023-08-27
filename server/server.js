const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
require("dotenv").config();

app.use(cors());

app.use(express.json());

const uri = process.env.mongodb; //used to connect to the prefered db

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000,
});

app.use(express.json()); // Middleware to parse JSON requests

//connect to the client created above
client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");

    //used to connect to the specifie database
    const db = client.db("loginSignupProject");
    const userCollections = db.collection("users"); //stores the data from the specified collection

    //post operation for signup
    app.post(
      "/signup",
      [
        //.not() is used to negate the validation rule that follows it
        check("username", "Please enter a valid username").not().isEmpty(), //here by using the .not().isEmpty() we determine that the given email id is not empty
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
          min: 6,
        }),
      ],
      async function (req, res) {
        console.log("signup");

        const errors = validationResult(req); //used to store the validation result obtained from the above check method

        //if the errors are not empty then this code block will be executed where it will set the status to 400 and return a message containing the errors
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
          });
        }

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        try {
          //used if the there is any other user containing the same email
          let newUser = await userCollections.findOne({
            email,
          });

          //if the user already exists then it will return with status 400 and a message conatining "user already exists"
          if (newUser) {
            return res.status(400).json({
              msg: "user already exists",
            });
          }

          //used to cerate a hashed passwor containing the password in hash format of the specified length here it is 10
          const hashedPassword = await bcrypt.hash(password, 10);

          //use to insert the user data to the database
          newUser = userCollections.insertOne({
            username: username,
            password: hashedPassword,
            email: email,
          });

          //a payload ontins the data of an api response in our case we are returning the user containing its id
          const payload = {
            user: {
              id: newUser.id,
            },
          };

          //jwt.sign() is a pre defined method or function provie by jsonwebtoken for creaing a json web token
          /* 
            the jwt token consists of 3 fields -: 
            1. header
            2. payload
            3. signature

            here we have not provide any header as the jwt provies a efault header
            "randomString" is used to generate the random token value
          */
          jwt.sign(
            payload,
            "randomString",
            {
              expiresIn: 10000, //this ensures that the token will expire after 10000 seconds
            },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({
                token,
              });
            }
          );
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error registering user" });
        }
      }
    );

    app.post(
      "/login",
      [
        check("email", "Please enter a valid emaild").isEmail(),
        check("password", "Enter a valid password").isLength({
          min: 6,
        }),
      ],
      async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
          });
        }

        const { email, password } = req.body;

        try {
          let user = await userCollections.findOne({
            email,
          });

          //check if the user is present or not if the user is not present then return with status 400 and with a message "User not exists"
          if (!user) {
            return res.status(400).json({
              msg: "User not exists",
            });
          }

          //if the user exists then check if the passwor matches or not
          const isMatch = await bcrypt.compare(password, user.password); // here we have use the bcrypt.compare() method to compare two passwords as the password are store using bcrypt

          console.log("login");

          if (!isMatch) {
            return res.status(400).json({
              msg: "Incorrect password",
            });
          }

          const payload = {
            user: {
              id: user.id,
            },
          };

          jwt.sign(
            payload,
            "randomString",
            {
              expiresIn: 3600,
            },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({
                token,
              });
            }
          );
        } catch (error) {
          console.log(error);
          res.status(500).json({
            msg: "Server error",
          });
        }
      }
    );

    const listener = app.listen(8888, function () {
      console.log("Listening on port " + listener.address().port);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

