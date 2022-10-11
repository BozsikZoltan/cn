const PATH = __dirname + '/../protos/logger.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(
    PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const logger = protoDescriptor.logger;

function logDebug(call, callback) {
    callback(null, performDebugLogging(call.request));
}

function logInfo(call, callback) {
    callback(null, performInfoLogging(call.request));
}

function logWarn(call, callback) {
    callback(null, performWarnLogging(call.request));
}

function logError(call, callback) {
    callback(null, performErrorLogging(call.request));
}

function performDebugLogging(loggerRequest) {
    console.debug(formatMessage(loggerRequest))
    return true;
}

function performInfoLogging(loggerRequest) {
    console.info(formatMessage(loggerRequest))
    return true;
}

function performWarnLogging(loggerRequest) {
    console.warn(formatMessage(loggerRequest))
    return true;
}

function performErrorLogging(loggerRequest) {
    console.error(formatMessage(loggerRequest))
    return true;
}

function formatMessage(loggerRequest) {
    return loggerRequest.serviceName + ': ' + loggerRequest.message
}

function getServer() {
    const server = new grpc.Server();
    server.addService(logger.Logger.service, {
        logDebug: logDebug,
        logInfo: logInfo,
        logWarn: logWarn,
        logError: logError
    });
    return server;
}

const loggerServer = getServer();
loggerServer.bindAsync('localhost:7080', grpc.ServerCredentials.createInsecure(), () => {
    loggerServer.start();
});
exports.getServer = getServer;