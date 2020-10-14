const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const logger = require('morgan');
const messageRouter = require('./src/router/message')  //  引入路由

function starApp() {

    app.use(logger('dev'));
    app.use(bodyParser.json());// 添加json解析
    app.use(express.static(path.join(process.cwd(), 'html')));
    app.use("/message", messageRouter());


    var server = http.createServer(app);
    server.listen(4001);
    server.on('error', onError);
    server.on('listening', () => {
        var addr = server.address();
        var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        console.log('Listening on ' + bind);
    });
    console.log(process.cwd())
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        var bind = 3004;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                break;
            default:
                throw error;
        }
        console.error("ERROR！ERROR！ERROR！")
        process.openStdin();
    }
}
starApp();
