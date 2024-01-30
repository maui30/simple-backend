//CRUD
const Employee = require("../model/Employee");

const getAllEmployee = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) return res.status(204).json({ message: "No employees" });

  res.json(employees);
};

const createEmployees = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname)
    return res
      .status(400)
      .json({ message: "First and Last names are required" });

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployees = async (req, res) => {
  //check first if there is an id requested
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID parameter is needed" });

  //searched for the employee number
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  //check if id exists
  if (!employee) {
    return res
      .status(201)
      .json({ message: `Employee ID ${req.body.id} does not match any` });
  }

  //updates the employee
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  const result = await employee.save();

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  //check if id is given
  if (!req?.body?.id)
    return res.status(400).json({ message: "Employee ID is required" });

  //search for the employee with same id
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  //check if there is a match
  if (!employee) {
    return res
      .status(204)
      .json({ message: `Employee ID ${req.body.id} does not match any` });
  }

  const result = await employee.deleteOne();
  res.json(result);
};

const getEmployee = async (req, res) => {
  //check if id is given
  if (!req?.params?.id)
    //params is used because it will get it through the url
    return res.status(400).json({ message: "Employee ID is required" });

  const employee = await Employee.findOne({ _id: req.params.id });

  //check if there is a match
  if (!employee) {
    return res
      .status(204)
      .json({ message: `Employee ID ${req.params.id} does not match any` });
  }

  res.json(employee);
};

module.exports = {
  getAllEmployee,
  createEmployees,
  updateEmployees,
  deleteEmployee,
  getEmployee,
};
