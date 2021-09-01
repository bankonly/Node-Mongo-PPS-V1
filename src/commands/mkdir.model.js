const { LOG, Mkdir } = require("../utils/common-func");
const METHOD = "Model";
const FILE_TYPE = ".model.js";
let WRITE_PATH = "../../../Codian-Academy-Model/models/"
const READ_FILE = WRITE_PATH + "example.model.js";

try {
    Mkdir({
        read_file: READ_FILE,
        write_path: WRITE_PATH,
        file_type: FILE_TYPE,
        method: METHOD,
    });
} catch (error) {
    LOG(error.message);
}