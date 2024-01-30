const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LISTS = require("../../config/roles_list");

router
  .route("/")
  .get(verifyRoles(ROLES_LISTS.Admin), userController.getAllUsers)
  .post(verifyRoles(ROLES_LISTS.Admin), userController.deleteUser);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LISTS.Admin), userController.getUser);

module.exports = router;
