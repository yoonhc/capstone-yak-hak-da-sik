export default () => ({
    // Port
    port: parseInt(process.env.PORT),
    // Azure
    endpoint: process.env.ENDPOINT,
    azureKey: process.env.AZUREKEY,
    deploymentID: process.env.DEPLOYMENT_ID,
    // DB
    dbHost: process.env.PGHOST,
    dbPort: parseInt(process.env.PGPORT),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    dbName: process.env.PGDATABASE,
});