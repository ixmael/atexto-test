const path = require('path');
const express = require('express');
var multer  = require('multer');
const app = express();

var upload = multer({ dest: 'uploads/' })

app.use(express.static(path.resolve('build')));

app.post('/upload', upload.single('file'), function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join('build', 'index.html'));
});

app.listen(process.env.PORT || 8080);
