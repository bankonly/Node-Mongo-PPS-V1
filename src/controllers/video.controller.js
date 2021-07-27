const Catcher = require("../middlewares/async");
const { Res, _ } = require("../utils/common-func");
const CourseModel = require("codian-academy-model/models/course.model");
const VideoModel = require("codian-academy-model/models/coursevideo.model");
const VideoFunc = require("../func/video.func");
const Constant = require("../configs/constant");
const Mongo = require("../utils/mongo-query");


const VideoController = {
  list: Catcher(async (req, res) => {
    const resp = new Res(res);
    return resp.success({});
  }),
  get: Catcher(async (req, res) => {
    const resp = new Res(res);


    return resp.success({});
  }),
  create: Catcher(async (req, res) => {
    const resp = new Res(res);

    const files = req.files

    await Mongo.findById(CourseModel, { _id: req.body.course_id })

    if (!_.isFile(files, "video")) throw new Error(`400::video is requried`)

    const path = Constant.video_path.save + req.body.course_id + "/"
    const upload_video = await VideoFunc.save({ file: files.video, path })

    VideoFunc.resize({ path: path, video_height: upload_video.video_info.height, file_name: upload_video.file_name })

    req.body.video_path = upload_video.file_name
    req.body.video_max_size = upload_video.video_info.height
    req.body.video_time = upload_video.video_info.duration_sec
    req.body.full_video_path = upload_video.path

    let new_course_video
    try {
      new_course_video = await VideoModel.create(req.body)
    } catch (error) {
      upload_video.delete_cb()
      throw new Error(error)
    }

    return resp.success({ data: new_course_video });
  }),
  update: Catcher(async (req, res) => {
    const resp = new Res(res);
    return resp.success({});
  }),
  remove: Catcher(async (req, res) => {
    const resp = new Res(res);
    return resp.success({});
  }),
};

module.exports = VideoController;