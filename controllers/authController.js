const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: "Username and Password is required" });
  }

  //checks first if user exist before checking the password
  const foundUser = await User.findOne({ username: user }).exec();

  if (!foundUser) {
    return res.sendStatus(401); // unauthorized
  }

  //evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles);

    //create JWT
    //do not pass password becuase it is available to all if they got acess to the token
    //username is advisable to pass
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" } //refresh token must have a longer expiry time
    );

    //save refresh token in database, so it allows us to invalidate the refresh token when user logouts before expiration

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log("Refresh Token Saved", result);

    //cookie can vulnerable to js
    //but setting it to http only, it is not available in js
    //it is much secured than storing in local storage
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      //secure: true, //the cookie will not work in thunderclient if this is true but it is required in working chrome
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.json({ accessToken }); //must store accessToken in memory
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
