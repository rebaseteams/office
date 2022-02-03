import { Handler, Router } from 'express';
import { DOMParser as Dom } from 'xmldom';
import fs from 'fs';
import http from 'http';
const xpath = require('xpath');

class WopiRoutes {
    private static instance: WopiRoutes;
    private static router: Router;
    constructor(app: Router) {
        if (!WopiRoutes.instance) {
            WopiRoutes.router = Router();
            app.use('/wopi', WopiRoutes.router);
            WopiRoutes.router.get('/collabora', this.getWopiClient);
            WopiRoutes.router.post('/file', this.createFile);
            WopiRoutes.router.get('/files', this.getFiles);
            WopiRoutes.router.get('/files/:fileId', this.checkFileInfo);
            WopiRoutes.router.get('/files/:fileId/contents', this.getFileContent);
            WopiRoutes.router.post('/files/:fileId/contents', this.saveFileContent);
        } else return WopiRoutes.instance;
    }

    private getFiles : Handler = (req, res) => {
        if(fs.existsSync(`${__dirname}/files`)) {
            const files = fs.readdirSync(`${__dirname}/files`);
            res.send(files);
        } else res.sendStatus(404);
    }

    private createFile: Handler = (req, res) => {
        const { name } = req.query;
        if(fs.existsSync(`${__dirname}/files`)) {
            fs.writeFileSync(`${__dirname}/files/${name}.txt`, '');
        } else {
            fs.mkdirSync(`${__dirname}/files`)
        }
        res.send('File Created');
    }

    private getWopiClient: Handler = (req, res) => {
        var collaboraOnlineHost = 'http://172.17.0.1:9980';
        var data = '';
        http.get(collaboraOnlineHost + '/hosting/discovery', function (response) {
            response.on('data', function (chunk) { data += chunk.toString(); });
            response.on('end', function () {
                var doc = new Dom().parseFromString(data);
                var mimeType = 'text/plain';
                var nodes = xpath.select("/wopi-discovery/net-zone/app[@name='" + mimeType + "']/action", doc);
                var onlineUrl = nodes[0].getAttribute('urlsrc');
                res.json({
                    url: onlineUrl,
                    token: 'test2'
                });
            });
            response.on('error', function (err) {
                res.status(404).send('Request error: ' + err);
                console.log('Request error: ' + err.message);
            });
        });
    };

    private checkFileInfo: Handler = (req, res) => {
        const name = req.params.fileId;
        if(fs.existsSync(`${__dirname}/files/${name}`)) {
            res.json({
                BaseFileName: 'abc.txt',
                UserId: 1,
                UserCanWrite: true
            });
        } else res.status(404).send('File not found');
    };

    private getFileContent: Handler = (req, res) => {
        if (req.query.access_token == "test2") {
            const name = req.params.fileId;
            if(fs.existsSync(`${__dirname}/files/${name}`)) {
                var fileContent = fs.readFileSync(`${__dirname}/files/${name}`);
                res.send(fileContent);
            } else res.status(404).send('File not found');
        } else res.sendStatus(401);
    };

    private saveFileContent: Handler = (req, res) => {
        console.log(req.query);
        console.log('wopi PutFile endpoint');
        if (req.body) {
            const name = req.params.fileId;
            if(fs.existsSync(`${__dirname}/files/${name}`)) {
                fs.writeFileSync(`${__dirname}/files/${name}`, req.body);
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        } else {
            console.log('Not possible to get the file content.');
            res.sendStatus(404);
        }
    };
}

export default WopiRoutes;