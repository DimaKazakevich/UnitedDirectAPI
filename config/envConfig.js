module.exports = {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_USERNAME: process.env.DB_USERNAME,
    SALT_ROUNDS: +process.env.SALT_ROUNDS,
    AUTHORIZATION_SCHEMA: process.env.AUTHORIZATION_SCHEMA
};