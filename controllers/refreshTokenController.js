const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies; //get cookies

  //verify if we got cookie and if it has jwt attribute
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  console.log(cookies, jwt);
  const refreshToken = cookies.jwt; //stores found refreshToken

  //find user that has the same refreshToken
  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
  if (!foundUser) {
    return res.sendStatus(401); // unauthorized
  }

  //evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);

    const roles = Object.values(foundUser.roles); // roles

    const accessToken = jwt.sign(
      {
        //add user roles to token
        UserInfo: {
          username: decoded.message,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
