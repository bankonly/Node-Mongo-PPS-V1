const _ = require("ssv-utils")
const FileUpload = require("ssv-file-upload");
const Constant = require("../configs/constant");
const ffmpeg = require("fluent-ffmpeg")
const cmd = require("child_process");

const MAX_VIDEO_DURATION_MINUTE = parseInt(process.env.MAX_VIDEO_DURATION_MINUTE) || false
const MIN_HEIGHT_DIMENSION = parseInt(process.env.MIN_HEIGHT_DIMENSION) || false
const MAX_HEIGHT_DIMENSION = parseInt(process.env.MAX_HEIGHT_DIMENSION) || false


const get_video_info = async (path) => {
    const video_info = await new Promise((res, rej) => {
        return ffmpeg.ffprobe(path, (err, data) => {
            if (err) throw new Error(err)
            res(data)
        });
    })
    const height = video_info.streams[0].height
    const width = video_info.streams[0].width
    const duration_sec = parseInt(video_info.streams[0].duration)
    const duration_min = duration_sec / 60
    return { height, width, duration_sec, duration_min }
}

const video_size = {
    "1080": "1920:1080",
    "720": "1280:720",
    "426": "854:480",
    "360": "640:360"
}

const video_size_arr = Object.keys(video_size)


const VideoFunc = {
    /* 
    1. Upload Video First
    2. Delete of pre_save if error else move to video
    3. Check video time limit 10 minute , max resolution is 1080 ,minimum is 360
    */
    save: async ({ file, path, aws_path }) => {
        let path_to_file
        let thumbnail
        try {
            const file_name = FileUpload.uploadImage({ path: path, originalName: false, file: file })
            if (!file_name.status) throw new Error(`400::${file_name.msg}`)
            const name = file_name.data
            path_to_file = path + name


            const name_with_out_type = name.split(".")[0]
            thumbnail = path + name_with_out_type + ".jpg"

            function thumbnail_to_aws(aws_path) {
                console.log(`cd ${Constant.process_path.resize_to_aws} && node upload-resize-video.js ${thumbnail} ${aws_path} ${name_with_out_type + ".jpg"}`)
                cmd.exec(`ffmpeg -i ${path_to_file} -vframes 1 -an -ss 30 ${thumbnail} && cd ${Constant.process_path.resize_to_aws} && node upload-resize-video.js ${thumbnail} ${aws_path} ${name_with_out_type + ".jpg"}`, { detached: true })
            }

            const video_info = await get_video_info(path_to_file);

            if (video_info.duration_min > MAX_VIDEO_DURATION_MINUTE) {
                throw new Error(`400::maximum duration is 15 minute`)
            }

            if (video_info.height < MIN_HEIGHT_DIMENSION) {
                throw new Error(`400::your video dimension is too small, minimum quality is 360 pixel`)
            }

            if (video_info.height > MAX_HEIGHT_DIMENSION) {
                throw new Error(`400::your video dimension is too big, maximum quality is 1080 pixel`)
            }


            function delete_cb() {
                cmd.execSync("rm -rf " + path_to_file)
                cmd.execSync("rm -rf " + thumbnail)
            }

            return { video_info, delete_cb, file_name: name, path: path_to_file, thumbnail_to_aws }
        } catch (error) {
            if (path_to_file) {
                cmd.execSync("rm -rf " + path_to_file)
            }
            if (thumbnail) {
                cmd.execSync("rm -rf " + thumbnail)
            }
            throw new Error(error.message)
        }
    },
    resize: ({ path, video_height, file_name, aws_path }) => {
        // 1080
        // ffmpeg -i video.mov -vf scale=1920:1080 -preset slow -crf 18 output.mp4

        // 720
        // ffmpeg -i video.mov -vf scale=1280:720 -preset slow -crf 18 output720.mp4

        // 480
        // ffmpeg -i video.mov -vf scale=854:480 -preset slow -crf 18 output480.mp4

        // 360
        // ffmpeg -i video.mov -vf scale=640:360 -preset slow -crf 18 output360.mp4

        // 240
        // ffmpeg -i video.mov -vf scale=426:240 -preset slow -crf 18 output240.mp4
        try {

            const full_path = path + file_name
            for (let index = 0; index < video_size_arr.length; index++) {
                const height = video_size_arr[index];
                if (height < video_height) {
                    console.log(`cd ${Constant.process_path.resize_to_aws} && node upload-resize-video.js ${full_path} ${aws_path} ${height}-${file_name}`)
                    cmd.exec(`ffmpeg -i ${full_path} -filter:v scale=${video_size[height]}:-2 ${path}${height}-${file_name} && cd ${Constant.process_path.resize_to_aws} && node upload-resize-video.js ${full_path} ${aws_path} ${height}-${file_name}`, { detached: true })
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}


module.exports = VideoFunc