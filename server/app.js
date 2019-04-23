const express = require('express');
const fs = require('fs')
const path = require('path');

const uuid = require('uuid')
var cors = require('cors')
const bodyParser = require('body-parser')
let multer = require('multer');
var upload = multer({})

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));


getFilePath = function (fileId) {
    const dir = app.get('uploads');
    return path.normalize(path.join(dir, fileId));
}

app.get('/radar', function (req, res, next) {
    const filepath = getFilePath(req.query.sheetId);
    console.info(filepath);
    res.sendFile(filepath, undefined, function (err) {
        if (err) {
            console.error(err);
            const error = new Error(err)
            error.httpStatusCode = 400
            return next(error)
        }
    })
})

app.post('/radar', upload.single('myFile'), function (req, res, next) {

    const id = uuid();
    const filepath = getFilePath(id);

    var data = Buffer.from(req.body.myFile);
    if (!data.length) {
        const error = new Error('Empty file')
        error.httpStatusCode = 400
        return next(error)
    }

    fs.open(filepath, 'w', function (err, fd) {
        if (err) {
            console.error(err);
            const error = new Error(err.message)
            error.httpStatusCode = 400
            return next(error)
        }

        fs.write(fd, data, 0, data.length, null, function (err) {
            if (err) {
                console.error(err);
                fs.close(fd, function () {
                    if (err) {
                        console.error(err);
                        const error = new Error(err.message)
                        error.httpStatusCode = 400
                        return next(error)
                    }
                })
                res.send(err);
                return;
            }
            fs.close(fd, function (err) {
                if (err) {
                    console.error(err);
                    const error = new Error(err.message)
                    error.httpStatusCode = 400
                    return next(error)
                }
                console.log('Uploaded: ' + id);
                res.send({id: id})
            });
        })

    });
})

module.exports = app;
