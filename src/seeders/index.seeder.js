const { LOG, _ } = require("../utils/common-func");
const AdminModel = require("codian-academy-model/models/admin.model");
const bcrypt = require("bcrypt");
const CourseToolModel = require("codian-academy-model/models/coursetool.model");
const CourseTypeModel = require("codian-academy-model/models/coursetype.model");
const StatusModel = require("codian-academy-model/models/status.model");
const PaymentMethodModel = require("codian-academy-model/models/paymentmethod.model");
const { InitialDatabase } = require("../configs/database");

InitialDatabase()

const data_set = {
    course_tool: [
        { name: "PHP" },
        { name: "Python" },
        { name: "Javascript" },
        { name: "Golang" },
        { name: "Flutter" },
        { name: "React Native" },
        { name: "VueJs" },
        { name: "HTML" },
        { name: "CSS" },
        { name: "Database" },
        { name: "Mysql" },
        { name: "MongoDB" },
    ],
    course_type: [
        { name: "Backend" },
        { name: "Frontend" },
        { name: "Programming" },
        { name: "Marketing" },
        { name: "Sale" },
        { name: "Entertainment" },
        { name: "Music" },
        { name: "Business" },
        { name: "Web Development" },
        { name: "Machine Learning" },
        { name: "Graphics Design" },
        { name: "English" },
        { name: "Photography" },
    ],
    admin: [{ username: "super_admin", password: bcrypt.hashSync("111998tsc", 10), email: "souksavanh.job@gmail.com", is_super_admin: true }],
    status: [
        { name_en: "Pending", name_la: "ລໍຖ້າ", numeric: 1 },
        { name_en: "Purchased", name_la: "ຊື້ແລ້ວ", numeric: 2 },
    ],
    payment_method: [
        { name_en: "Manual Transfer", name_la: "ເງິນສົດຫຼືໂອນ", numeric: 1 },
        { name_en: "Onepay", name_la: "Onepay", numeric: 2 },
        { name_en: "Credit Card", name_la: "Credit Card", numeric: 3 },
    ],
};

const SeedRunner = (model, { data_set, name = "SKILL" }) => {
    model.find().then((found_data) => {
        if (found_data.length < 1) {
            model.create(data_set).then(() => LOG(name + " Seeded"));
        }
    });
};

SeedRunner(AdminModel, { data_set: data_set.admin, name: "Admin" });
SeedRunner(CourseTypeModel, { data_set: data_set.course_type, name: "course_type" });
SeedRunner(CourseToolModel, { data_set: data_set.course_tool, name: "course_tool" });
SeedRunner(StatusModel, { data_set: data_set.status, name: "status" });
SeedRunner(PaymentMethodModel, { data_set: data_set.payment_method, name: "payment_method" });
