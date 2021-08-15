const Catcher = require("../middlewares/async");
const { Res, _ } = require("../utils/common-func");
const CourseModel = require("codian-academy-model/models/course.model");
const VideoModel = require("codian-academy-model/models/coursevideo.model");
const VideoFunc = require("../func/video.func");
const Constant = require("../configs/constant");
const Mongo = require("../utils/mongo-query");
const AwsFunc = require("../func/aws.func");

const VideoController = {
  list: Catcher(async (req, res) => {
    const resp = new Res(res);
    const select = req.query.select || "desc last_watch_time video_time title episode video_path full_video_path snipped_file"
    const found_video = await Mongo.find(VideoModel, { condition: { course_id: req.body.course_id }, paginate: { paginate: req.query }, select })
    return resp.success({ data: found_video });
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
    
    
    
    req.body.video_path = upload_video.file_name
    req.body.video_max_size = upload_video.video_info.height
    req.body.video_time = upload_video.video_info.duration_sec
    req.body.full_video_path = upload_video.path
    req.body.thumbnail = upload_video.thumbnail
    
    let new_course_video
    try {
      new_course_video = await VideoModel.create(req.body)
    } catch (error) {
      upload_video.delete_cb()
      throw new Error(error)
    }
    
    
    const aws_path = Constant.video_path.aws_path + req.body.course_id + "/" + new_course_video._id + "/"
    VideoFunc.resize({ path: path, video_height: upload_video.video_info.height, file_name: upload_video.file_name, aws_path })
    upload_video.thumbnail_to_aws(aws_path)

    // const file = fs.readFileSync(upload_video.path)
    AwsFunc.uploadFile({ path: aws_path, file: files.video, file_name: upload_video.file_name })

    return resp.success({ data: new_course_video });
  }),
  update: Catcher(async (req, res) => {
    const resp = new Res(res);


    const video_id = req.body.video_id
    const found_video = await Mongo.findById(VideoModel, { _id: video_id })

    const file = req.files

    if (_.isFile(file, "snipped_file")) {
      const path = Constant.file_path.video_snipped + video_id + "/"
      const snipped_file = await AwsFunc.uploadFile({ origin_filename: true, path, file: file.snipped_file, return_only_name: true })
      req.body.snipped_file = [{ path, name: snipped_file }]
    }

    found_video.set(req.body)
    await found_video.save()
    return resp.success({ data: found_video });
  }),
  remove: Catcher(async (req, res) => {
    const resp = new Res(res);
    const video_id = req.params._id
    Mongo.remove(VideoModel, { _id: video_id })
    return resp.success({});
  }),
};

module.exports = VideoController;
