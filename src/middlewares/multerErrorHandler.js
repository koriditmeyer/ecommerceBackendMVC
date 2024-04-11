
// Wrap Multer with a custom middleware to handle errors
export function multerErrorHandler(multerUpload) {
  return function (req, res, next) {
    try {
        multerUpload(req, res, function(err) {
            if(err) res.status(400).json({status: 'error', message: "special "+err.message})
            else next()
        })
    } catch (error) {
        //console.log(error.message);
        next(error)
    }
  };
}
