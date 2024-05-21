export default () => ({
    // Port
    port: parseInt(process.env.PORT),
    // Azure
    endpoint: process.env.ENDPOINT,
    azureKey: process.env.AZUREKEY,
    deploymentID: process.env.DEPLOYMENT_ID,
    // DB
    dbHost: process.env.DB_HOST,
    dbPort: parseInt(process.env.DB_PORT),
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    dbName: process.env.DB_NAME,
});