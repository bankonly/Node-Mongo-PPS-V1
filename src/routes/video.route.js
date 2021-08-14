const VideoController = require("../controllers/video.controller");

const http = require("express").Router();

http.post("/video/list", VideoController.list);
http.get("/video/list/:_id", VideoController.get);
http.post("/video", VideoController.create);
http.post("/video/edit", VideoController.update);
http.delete("/video/:_id", VideoController.remove);

const VideoRouter = http;
module.exports = VideoRouter;
