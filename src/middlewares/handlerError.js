export function handlerError(error, req, res, next) {
  console.log(error.message);
  if (error.message === "not found") {
    res.status(404);
  } else if (error.message === "not found") {
    res.status(404);
  } else {
    res.status(500);
  }
  if (error.code === 11000) {
    res.json({
      status: "error",
      message: `Email ${error.keyValue.email} is already in use.`,
    });
  } else {
    res.json({
      status: "error",
      message: error.message,
    });
  }
}
