// import Url from 'ur'

export default function(req, res, next) {
  res.spa = true
  next()
}
//
// export default function(req, res, next) {
//   const url = req.originalUrl.split('/')
//
//   if(url[1] === 'admin') {
//     res.spa = true
//
//   }
//   next()
// }

