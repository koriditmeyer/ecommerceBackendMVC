export function removeEmptyFields(req, res, next) {
    Object.keys(req.body).forEach(key => {
        //console.log(req.body[key] === '' )
      if (req.body[key] === '' || req.body[key] === null || (Array.isArray(req.body[key]) && req.body[key].length === 0)) {
        delete req.body[key];
      }
    });
    next();
  }