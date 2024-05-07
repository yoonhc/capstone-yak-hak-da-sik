export default () => ({
    port: parseInt(process.env.PORT),
    endpoint: process.env.ENDPOINT,
    azureKey: process.env.AZUREKEY,
    deploymentID: process.env.DEPLOYMENT_ID,
});