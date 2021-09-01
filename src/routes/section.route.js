const SectionController = require("../controllers/section.controller");

const http = require("express").Router();

http.get("/section/list/:_id", SectionController.get);
http.post("/section", SectionController.create);
http.post("/section/:_id", SectionController.update);
http.delete("/section/:_id", SectionController.remove);

const SectionRouter = http;
module.exports = SectionRouter;