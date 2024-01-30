const User = require("../model/User");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No Users Recorded" });

  res.json(users);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "User Id required" });

  const user = await User.findOne({ _id: req.body.id }).exec();

  if (!user) return res.status(204).json({ message: "No ID matches" });

  const result = await user.deleteOne();
  res.json(result);
};

const getUser = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "ID required" });

  const user = await User.findOne({ _id: id }).exec();

  if (!user) return res.status(204).json({ message: "No ID match" });
  res.json(user);
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
};
