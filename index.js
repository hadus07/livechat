const fs = require('fs')
const path = require('path')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = process.env.PORT || 3000

app.get('/', (_req, res) => {
	res.sendFile(join('/index.html'))
})

io.on('connection', socket => {
	handleReadFile(socket)

	socket.on('message', data => {
		fs.appendFile(join('input.txt'), `${data}\n`, err => {
			if (err) {
				console.log(err)
			}
		})
	})

	fs.watch(join('input.txt'), 'utf-8', (eventType, fileName) => {
		if (eventType === 'change' && fileName === 'input.txt') {
			handleReadFile(socket)
		}
	})
})

http.listen(port, () => {
	console.log(`Listening on port ${port}`)
})

function join(p) {
	return path.join(__dirname, p)
}
function handleReadFile(socket) {
	fs.readFile(join('input.txt'), 'utf-8', (err, data) => {
		if (err) { console.log(err) }
		socket.emit('news', data)
	})
}