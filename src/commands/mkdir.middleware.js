const { LOG, Mkdir } = require("../utils/common-func");
const METHOD = "Middleware";
const FILE_TYPE = ".middleware.js";
let WRITE_PATH = "./src/middlewares/";
const READ_FILE = WRITE_PATH + "example.middleware.js";

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
