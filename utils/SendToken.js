exports.SendToken = (employee, statuscode, res) => {
  const token = employee.getjwttoken();

  const option = {
    exipres: new Date(Date.now() + process.env.COOKIE_EXIPRES + 24 * 60 * 1000),
    httpOnly: true,
    secure: true,
  };
  res
    .status(statuscode)
    .cookie("token", token, option)
    .json({ sucess: true, id: employee._id, token });
};
