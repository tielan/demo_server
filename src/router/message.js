const compressing = require('compressing');
const multer = require('multer');
const express = require('express');
const fileManager = require('../fileManager');

const router = express.Router();
var upload = multer({ dest: 'upload_tmp/' });
function splitFileName(text) {
    var pattern = /\.{1}[a-z]{1,}$/;
    if (pattern.exec(text) !== null) {
        return (text.slice(0, pattern.exec(text).index));
    } else {
        return text;
    }
}
var messageRouter = function () {
    router.all('/upload', upload.any(), (req, res) => {
        var targetDir = 'html/app/' + splitFileName(req.files[0].originalname);
        var resObj = { code: 1, message: "" };
        compressing.zip.uncompress(req.files[0].path, targetDir + '/img')
            .then(() => {
                fileManager.copy("app_temp", targetDir)
                fileManager.listFile(targetDir + '/img').then((imgs) => {
                    if (imgs && imgs.length > 0) {//上传成功
                        fileManager.writeFile(targetDir + "/js/file.js", "window.files = " + JSON.stringify(imgs))
                        console.log('success');
                        resObj.code = 0;
                        resObj.message = "ok"
                        res.json(resObj)
                    } else {
                        fileManager.delFile(targetDir);
                        console.log('empty');
                        resObj.code = 2;
                        resObj.message = "empty 文件夹未空或文件目录不符"
                        res.json(resObj)
                    }
                });
            })
            .catch(err => {
                console.error(err);
                resObj.message = JSON.stringify(err)
                res.json(resObj)
            });
    })
    router.get("/list", (req, res) => {
        var resObj = { code: 0, message: "" };
        fileManager.listDir('html/app').then((apps) => {
            console.log(apps)
            resObj.data = apps;
            res.json(resObj)
        });
    })
    router.get("/del", (req, res) => {
        var resObj = { code: 0, message: "" };
        var name = req.query.name;
        if (name) {
            if (name.indexOf(".") == -1 && name.indexOf("/") == -1) {
                fileManager.delFile('html/app/' + name);
            } else {
                req.message = "非法路径"
            }
        }
        res.json(resObj)
    })
    return router;
}
module.exports = messageRouter