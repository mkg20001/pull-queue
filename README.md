# pull-queue
Pull stream with queue

## API
`queue(through, options)` - Returns a duplex stream with built-in-queue

### Options
`sendMany`: If true will treat arrays as multiple items

## Examples
```js
queue(function(end, data, cb) { //this will only allow valid data to pass through
  if (end) return cb(end)
  if (validateData(data)) cb(null, data) //will send that data
  else cb() //will not send anything
})
```

```js
queue(function(end, data, cb) { //this will transfer a stream of comma seperated items into single words
  if (end) return cb(end)
  cb(null, data.split(","))
}, { sendMany: true })
```

## FAQ
Q: Why a duplex?

A: Because otherwise we would have to return null for some reads which causes trouble

Q: Why not pull-through?

A: See Q#1
