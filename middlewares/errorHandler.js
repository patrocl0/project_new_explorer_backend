module.exports = (err, req, res, next) => {
  console.error(err); // solo para desarrollo

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "Error interno del servidor" : message,
  });
};
