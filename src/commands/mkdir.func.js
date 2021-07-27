const { LOG, Mkdir } = require("../utils/common-func");
const METHOD = "Function";
const FILE_TYPE = ".func.js";
let WRITE_PATH = "./src/func/";
const READ_FILE = WRITE_PATH + "example.func.js";

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
