const root_path = __dirname + "/../../../";
const process_root_path = __dirname + "/../../../";

const Constant = {
    image_path: {
        instructor_profile: "instructor/img/",
        instructor_cover_img: "instructor/cover/",
        course_thumbnail: "courses-thumbnail/"
    },
    video_path: {
        save: root_path + "video/",
        pre_save: root_path + "pre_video/",
        aws_path: "video/",
    },
    file_path: {
        video_snipped: "video-snipped-files/"
    },
    process_path: {
        resize_to_aws: process_root_path + process.env.PROCESS_RESIZE
    }
};

module.exports = Constant;
