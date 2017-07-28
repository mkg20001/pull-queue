const EE = require("events").EventEmitter

function PullQueue(through, opt) {
  let ee = new EE()
  let q = []
  if (!opt) opt = {}

  function unleak() {
    ee.removeAllListeners("err")
    ee.removeAllListeners("data")
  }

  return {
    sink: function (read) {
      read(null, function next(end, data) {
        through(end, data, function (end, data) {
          if (end) {
            ee.emit("err", end)
            return end
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
          return read(null, next)
        })
      })
    },
    source: function src(end, cb) {
      if (end) return cb(end)

      unleak()

      function doSend() {
        unleak()
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
