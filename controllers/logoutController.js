const User = require("../model/User");

const handleLogout = async (req, res) => {
  //client should also delete access token

  const cookies = req.cookies; //get cookies

  //verify if we got cookie and if it has jwt attribute
  if (!cookies?.jwt) {
    return res.sendStatus(201); //Successful no content to send back
  }

  const refreshToken = cookies.jwt;

  //is refreshToken in DB?
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    //when clearing cookie, must have the same params when you have set it
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204); // Successful but no content
  }

  //delete the refresh token in the database
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log("Refresh Token Deleted", result);

  //clears Cookies
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  res.sendStatus(204);
};

module.exports = { handleLogout };
