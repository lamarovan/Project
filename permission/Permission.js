function authRole(req, res, next) {
  const ass = req.body.assignee;
  const user = req.body.user;
  const owner = req.body.owner;
  // console.log("user", user.email);
  // console.log("ass:", ass);
  // console.log("owner:", owner);
  if (owner === user || ass === user || ass === "") {
    return next();
  }
}

module.exports = { authRole };
