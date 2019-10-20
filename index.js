//@ts-check
const port = 80;
//FILE SYSTEM
const fs = require("fs");
//EXPRESS
const express = require("express");
const app = express();
//EXPRESS: BODY-PARSER
const jsonParser = require("body-parser").json();
//EXPRESS: FILE-UPLOAD
const multer = require("multer");
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./shared/transferSpace/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: multerStorage });

//EXPRESS INITIALIZATION
//Use "Client" directory to serve static content
app.use(express.static("./shared"));
//Start express server on port 80
app.listen(port);
console.log(`Express server status: Ready, listening on port ${port}`);

//EXTENSIONS LIBRARY INITIALIZATION
const extensionsLibrary = JSON.parse(fs.readFileSync("./registry/extensions_library.json", "utf-8"));
const audioExtensions = Object.keys(extensionsLibrary.audioExtensions);
const imageExtensions = Object.keys(extensionsLibrary.imageExtensions);
const videoExtensions = Object.keys(extensionsLibrary.videoExtensions);
const containerExtensions = Object.keys(extensionsLibrary.containerExtensions);
const textExtensions = Object.keys(extensionsLibrary.textExtensions);

//EXPRESS ROUTING
app.route("/")
    .all((request, response) => {
        response.sendFile("./shared/index.html");
    });

app.route("/file/retrieve/itemPaths")
    .post(jsonParser, (request, response) => {
        const fullRelativeDirectoryPath = `./shared/transferSpace/${request.body.subDirectoryPath}`;
        if (!fs.existsSync(fullRelativeDirectoryPath)) {
            response.json({
                status: false,
                error: "Directory does not exist"
            });
        } if (fs.statSync(fullRelativeDirectoryPath).isFile()) {
            response.json({
                status: false,
                error: "Found a file at directory path"
            });
        } else {
            const itemNames = fs.readdirSync(fullRelativeDirectoryPath);
            const directoryData = [];
            const fileData = [];
            for (const itemName of itemNames) {
                const stats = fs.statSync(`${fullRelativeDirectoryPath}/${itemName}`);
                if (stats.isDirectory()) {
                    const directoryDatum = {
                        //A "/" will be appended to every directory name
                        name: itemName + "/"
                    };
                    directoryData.push(directoryDatum);
                } else {
                    const fileExtension = itemName.slice(itemName.lastIndexOf(".")).toLowerCase();
                    const fileDatum = {
                        name: itemName,
                        size: stats.size,
                        fileType: null,
                        fileExtensionCategory: null,
                        fileExtension: fileExtension
                    };
                    if (audioExtensions.includes(fileExtension)) {
                        fileDatum.fileType = extensionsLibrary.audioExtensions[fileExtension].fileType;
                        fileDatum.fileExtensionCategory = "audioExtensions";
                    } else if (imageExtensions.includes(fileExtension)) {
                        fileDatum.fileType = extensionsLibrary.imageExtensions[fileExtension].fileType;
                        fileDatum.fileExtensionCategory = "imageExtensions";
                    } else if (videoExtensions.includes(fileExtension)) {
                        fileDatum.fileType = extensionsLibrary.videoExtensions[fileExtension].fileType;
                        fileDatum.fileExtensionCategory = "videoExtensions";
                    } else if (containerExtensions.includes(fileExtension)) {
                        fileDatum.fileType = extensionsLibrary.containerExtensions[fileExtension].fileType;
                        fileDatum.fileExtensionCategory = "containerExtensions";
                    } else if (textExtensions.includes(fileExtension)) {
                        fileDatum.fileType = extensionsLibrary.textExtensions[fileExtension].fileType;
                        fileDatum.fileExtensionCategory = "textExtensions";
                    } else {
                        fileDatum.fileType = extensionsLibrary.unknownExtensions.unknownExtension.fileType;
                        fileDatum.fileExtensionCategory = "unknownExtensions";
                        fileDatum.fileExtension = "unknownExtension";
                    }
                    fileData.push(fileDatum);
                }
            }
            response.json({
                status: true,
                extensionsLibrary: extensionsLibrary,
                directoryData: directoryData,
                fileData: fileData
            });
        }

    });

app.route("/file/create")
    .post(upload.fields([{name: "fileData"}]), (request, response) => {
        response.json({
            status: true
        });
    });