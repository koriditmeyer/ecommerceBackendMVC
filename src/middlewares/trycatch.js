export default function tryCatch(controller) {
  return (req, res, next) => {
    controller(req, res, next).catch(next);
  };
}
