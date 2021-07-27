const VideoController = require("../controllers/Video.controller");

const http = require("express").Router();

http.get("/video/list", VideoController.list);
http.get("/video/list/:_id", VideoController.get);
http.post("/video", VideoController.create);
http.put("/video/:_id", VideoController.update);
http.delete("/video/:_id", VideoController.remove);

const VideoRouter = http;
module.exports = VideoRouter;
