"use strict"

const queue = require("data-queue")

function PullQueue(through, opt) {
  if (!opt) opt = {}

  const q = queue()

  return {
    sink: function (read) {
      read(null, function next(end, data) {
        through(end, data, function (end, data) {

          if (typeof data != "undefined") {
            if (opt.sendMany) {
              if (Array.isArray(data)) {
                data.forEach(data => q.append({
                  data
                }))
              } else {
                q.append({
                  data
                })
              }
            } else {
              q.append({
                data
              })
            }
          }
          if (end) {
            q.append({
              end
            })
          } else {
            return read(null, next)
          }
        })
      })
    },
    source: function src(end, cb) {
      if (end) return cb(end)

      q.get((e, d) => {
        if (d.end) return cb(d.end)
        else return cb(null, d.data)
      })
    }
  }
}

module.exports = PullQueue
