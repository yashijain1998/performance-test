const perforamceEnv = process.env.PERFORMANCE_ENV || 'qa';

const envConfig = require(`./${perforamceEnv}.json`);

module.exports = envConfig;