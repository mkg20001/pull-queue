const EE = require("events").EventEmitter

function PullQueue(through, opt) {
  let ee = new EE()
  let q = []
  if (!opt) opt = {}
  return {
    sink: function (read) {
      read(null, function next(end, data) {
        through(end, data, function (end, data) {
          if (end) {
            ee.emit("err", end)
            return read(end)
          }
          if (data) {
            if (opt.sendMany) {
              if (Array.isArray(data)) {
                q = q.concat(data)
                if (data.length) ee.emit("data")
              } else {
                q.push(data)
                ee.emit("data")                
              }
            } else {
              q.push(data)
              ee.emit("data")
            }
          }
        })
      })
    },
    source: function src(end, cb) {
      if (end) return cb(end)

      function doSend() {
        cb(null, q.shift())
      }
      if (q.length) return doSend()
      else {
        ee.once("data", doSend)
        ee.once("err", e => src(e, cb))
      }
    }
  }
}

module.exports = PullQueue
