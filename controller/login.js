// const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

// controller for register
exports.registerUser = async (req, res) => {
  // validate req
  try {
    if (!req.body) {
      res.status(406).json({ err: "You have to fill the registration form" });
      return;
    }

    let { password, passwordCheck, username } = req.body;

    if (!password || !passwordCheck)
      return res.status(406).json({ err: "Not all fields have been entered" });
    if (password.length < 8)
      return res
        .status(406)
        .json({ err: "The password must be at least 8 character" });
    if (password !== passwordCheck)
      return res.status(406).json({ err: "Password didnt match" });

    // hashing password
    // const hash = await bcrypt.hashSync(password, 10);

    // using doc structure
    const newUser = new User({
      password,
      username,
    });

    newUser
      .save(newUser)
      .then((register) => {
        res.json(register);
      })
      .catch((error) => {
        res.status(406).json({
          err: error.message || "Something went wrong while registration",
        });
      });
  } catch (error) {
    res.status(500).json({ err: error.message || "Error while registration" });
  }
};

// controller for login
exports.login = async (req, res) => {
  try {
    // validate req
    if (!req.body) {
      res
        .status(406)
        .json({ err: "You have to fill the username and password" });
      return;
    }

    // get user data
    const { username, password } = req.body;

    // validation
    if (!username || !password)
      return res.status(406).json({ err: "Not all fields have entered" });

    // const user = "$2b$10$m/vSRfU93aD2WSRsHQ32YOHF10b9JvXHSDsD3jSmfr/nHGqxEdlEC";
    const user = await User.findOne({ username, password });
    if (!user)
      return res.status(406).json({ err: "Username atau Password salah..!" });
    // compare password
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return res.status(406).json({ err: "Invalid Credential" });
    if (password !== user.password) {
      return res.status(406).json({ err: "Invalid Credential" });
    }

    // create jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ err: error.message || "Error while Login" });
  }
};
