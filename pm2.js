const cmd = require("child_process");

if (process.argv.length < 6) {
    console.log(`
        Failed: Invalid Command
        Ex: Node <app path> <app name> 5000 6 n
        --> 5000 is your start from number app port
        --> 6 is number of instance
    `);
} else {
    const app_name = process.argv[2];
    const port = parseInt(process.argv[3]);
    const number_of_instance = parseInt(process.argv[4]);
    const enable_port = process.argv[5];

    if (!port) {
        console.log(`Invalid PORT of ${port}`);
    } else if (!number_of_instance) {
        console.log(`Invalid Instance number of ${number_of_instance}`);
    } else {
        let start_port = port + number_of_instance;
        console.log(start_port);
        for (let instance_port = port; instance_port < start_port; instance_port++) {
            cmd.execSync(`pm2 start --name ${app_name}${instance_port} npm -- start ${instance_port}`);
            if (enable_port === "y") {
                cmd.execSync(`ufw allow ${instance_port}`);
            }
        }
    }
}
