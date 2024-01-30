const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeeController");
//const verifyJWT = require("../../middleware/verifyJWT");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LISTS = require("../../config/roles_list");

router
  .route("/")
  //.get(verifyJWT, employeesController.getAllEmployee) protect specific route
  .get(employeesController.getAllEmployee)
  .post(
    verifyRoles(ROLES_LISTS.Admin, ROLES_LISTS.Editor),
    employeesController.createEmployees
  )
  .put(
    verifyRoles(ROLES_LISTS.Admin, ROLES_LISTS.Editor),
    employeesController.updateEmployees
  )
  .delete(verifyRoles(ROLES_LISTS.Admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
