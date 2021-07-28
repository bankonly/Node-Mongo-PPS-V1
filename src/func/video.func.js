const _ = require("ssv-utils")
const FileUpload = require("ssv-file-upload");
const Constant = require("../configs/constant");
const ffmpeg = require("fluent-ffmpeg")
const cmd = require("child_process")

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
    "1280": "1280:720",
    "720": "854:480",
    "640": "640:360",
    "426": "426:240",
}

const video_size_arr = Object.keys(video_size)


const VideoFunc = {
    /* 
        1. Upload Video First
        2. Delete of pre_save if error else move to video
        3. Check video time limit 10minute ,max resolution is 1080 ,minimum is 360
    */
    save: async ({ file, path }) => {
        let path_to_file
        try {
            const file_name = FileUpload.uploadImage({ path: path, fileType: "mp4", originalName: false, file: file })
            if (!file_name.status) throw new Error(`400::${file_name.msg}`)
            const name = file_name.data
            path_to_file = path + name

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
            }

            return { video_info, delete_cb, file_name: name, path: path_to_file }
        } catch (error) {
            if (path_to_file) {
                cmd.execSync("rm -rf " + path_to_file)
            }
            throw new Error(error.message)
        }
    },
    resize: ({ path, video_height, file_name }) => {
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
                if (height <= video_height) {
                    cmd.exec(`ffmpeg -i ${full_path} -vf scale=${video_size[height]} -preset slow -crf 18 ${path}${height}-${file_name}`, { detached: true })
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}


module.exports = VideoFunc