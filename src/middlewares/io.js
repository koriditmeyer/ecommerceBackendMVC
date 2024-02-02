function ioMiddleware(name,data){
    return (req, res, next) => {
    if (req.addedProduct) {
      req["io"].emit(name, data); // Emitting a message to all connected clients
    }
    next(); // Pass control to the next middleware
  }
}