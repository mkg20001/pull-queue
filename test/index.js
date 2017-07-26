"use strict"

const sinon = require("sinon")
const chai = require("chai")
chai.use(require("sinon-chai"))
chai.should()
const expect = chai.expect
const assert = require("assert")
const pull = require("pull-stream")
const queue = require("..")

describe("pull-queue", () => {
  describe("examples", () => {

    it("should split the string of words", () => {
      let r = []
      pull(
        pull.values(["hello,world", "what", "this,is,a,test,"]),
        queue(function (end, data, cb) { //this will transfer a stream of comma seperated items into single words
          if (end) return cb(end)
          cb(null, data.split(","))
        }, {
          sendMany: true
        }),
        pull.drain(d => r.push(d))
      )
      assert.deepEqual(r, ["hello", "world", "what", "this", "is", "a", "test", ""])
    })

    it("should only allow valid data", () => {
      let r = []
      pull(
        pull.values(["3245", "3522", "0xFF", "abc", "qqf", "554", "303", "@"]),
        queue(function (end, data, cb) { //this will only allow valid data to pass through
          if (end) return cb(end)
          if (data.match(/^[0-9]+$/)) cb(null, data) //will send that data
          else cb() //will not send anything
        }),
        pull.drain(d => r.push(d))
      )
      assert.deepEqual(r, ["3245", "3522", "554", "303"])
    })

  })

  describe("functionality", () => {
    it("should send non-arrays in sendMany as usual", () => {
      let r = []
      pull(
        pull.values(["1", "2", "3"]),
        queue(function (end, data, cb) { //this will only allow valid data to pass through
          cb(null, data)
        }, {
          sendMany: true
        }),
        pull.drain(d => r.push(d))
      )
      assert.deepEqual(r, ["1", "2", "3"])
    })
  })
})
