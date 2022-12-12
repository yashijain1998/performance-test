const { exec } = require('child_process');
const { getToken } = require('./userToken');

const run = async () => {
    const token = await getToken();
    exec(`npm test --token=${token}`, (err) => {
        if (err) {
          console.error(`exec error: ${err}`);
          return;
        }
      });
}
run();