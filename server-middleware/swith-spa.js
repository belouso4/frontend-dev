export default function(req, res, next) {
  res.spa = true

  next()
}

