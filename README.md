# pull-queue
Pull stream with queue

## API
`queue(through)` - Returns a duplex stream with built-in-queue

## Example
```js
queue(function(end, data, cb) {
  if (end) return cb(end)
  if (validateData(data)) cb(null, data) //will send that data
  else cb() //will not send anything
})
```

## FAQ
Q: Why a duplex?

A: Because otherwise we would have to return null for some reads which causes trouble

Q: Why not pull-through?

A: See Q#1
