const User = require("../model/User");
const bcrypt = require("bcrypt");

//install bcrypt for password
const handleNewUser = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  //check for duplicate username in the database
  const duplicate = await User.findOne({ username: user }).exec();

  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    //encrypt password
    const hashedPsw = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await User.create({
      username: user,
      roles: { User: 2001 },
      password: hashedPsw,
    });

    console.log(result);

    res.status(201).json({ success: `New User has been createad ${user}` });
  } catch (err) {
    res.status(500).json({ message: err.message }); //500 server error
  }
};

module.exports = { handleNewUser };
