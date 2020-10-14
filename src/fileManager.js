const { rejects } = require('assert')
const fs = require('fs')
const { resolve } = require('path')
const path = require('path')

function copy(from, to) {
    const fromPath = path.resolve(from)
    const toPath = path.resolve(to)
    fs.access(toPath, function (err) {
        if (err) {
            fs.mkdirSync(toPath)
        }
    })
    fs.readdir(fromPath, function (err, paths) {
        if (err) {
            console.log(err)
            return
        }
        paths.forEach(function (item) {
            const newFromPath = fromPath + '/' + item
            const newToPath = path.resolve(toPath + '/' + item)
            fs.stat(newFromPath, function (err, stat) {
                if (err) return
                if (stat.isFile()) {
                    copyFile(newFromPath, newToPath)
                    console.log(newToPath)
                }
                if (stat.isDirectory()) {
                    copy(newFromPath, newToPath)
                }
            })
        })
    })
}

function copyFile(from, to) {
    fs.copyFileSync(from, to, function (err) {
        if (err) {
            console.log(err)
            return
        }
    })
}

function listFile(pathName) {
    return new Promise((resolve, reject) => {
        var dirs = [];
        fs.readdir(pathName, function (err, files) {
            var dirs = [];
            (function iterator(i) {
                if (i == files.length) {
                    resolve(dirs);
                    return;
                }
                fs.stat(path.join(pathName, files[i]), function (err, data) {
                    if (data.isFile()) {
                        dirs.push(files[i]);
                    }
                    iterator(i + 1);
                });
            })(0);
        });
    })
}


function listDir(pathName) {
    return new Promise((resolve, reject) => {
        var dirs = [];
        fs.readdir(pathName, function (err, files) {
            var dirs = [];
            (function iterator(i) {
                if (i == files.length) {
                    resolve(dirs);
                    return;
                }
                fs.stat(path.join(pathName, files[i]), function (err, data) {
                    if (data.isDirectory()) {
                        dirs.push({
                            name: files[i],
                            ctime: data.ctimeMs,
                        });
                    }
                    iterator(i + 1);
                });
            })(0);
        });
    })
}

function writeFile(filePath, str) {
    fs.writeFile(filePath, str, function (error) {
        if (error) {
            console.log(error)
            console.log(filePath + '写入失败')
        } else {
            console.log(filePath + '写入成功了')
        }
    });
}

function delFile(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
module.exports = { copy, listFile,listDir, writeFile, delFile };