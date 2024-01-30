const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    //need req and roles if there is none send 401
    if (!req?.roles) return res.sendStatus(401);

    const rolesArray = [...allowedRoles]; //diff roles passed in

    console.log("Role/s needed: ", rolesArray);
    console.log("Roles the user have: ", req.roles); // roles coming in JWT

    const result = req.roles
      .map((role) => rolesArray.includes(role)) //checks if JWT roles are in rolesArray
      .find((val) => val === true); //find the first true

    if (!result) return res.sendStatus(401); //unauthorized
    next();
  };
};

module.exports = verifyRoles;
