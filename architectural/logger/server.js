const PATH = __dirname + '/../protos/logger.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
/**
 * Loads the proto file
 * */
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

/**
 * Debug logging callback function.
 * */
function logDebug(call, callback) {
    callback(null, performDebugLogging(call.request));
}

/**
 * Info logging callback function.
 * */
function logInfo(call, callback) {
    callback(null, performInfoLogging(call.request));
}

/**
 * Warn logging callback function.
 * */
function logWarn(call, callback) {
    callback(null, performWarnLogging(call.request));
}

/**
 * Error logging callback function.
 * */
function logError(call, callback) {
    callback(null, performErrorLogging(call.request));
}

/**
 * Debug logging function.
 * */
function performDebugLogging(loggerRequest) {
    console.debug(formatMessage(loggerRequest))
    return true;
}

/**
 * Info logging function.
 * */
function performInfoLogging(loggerRequest) {
    console.info(formatMessage(loggerRequest))
    return true;
}

/**
 * Warn logging function.
 * */
function performWarnLogging(loggerRequest) {
    console.warn(formatMessage(loggerRequest))
    return true;
}

/**
 * Error logging function.
 * */
function performErrorLogging(loggerRequest) {
    console.error(formatMessage(loggerRequest))
    return true;
}

/**
 * Message formatter function.
 * */
function formatMessage(loggerRequest) {
    return loggerRequest.serviceName + ': ' + loggerRequest.message
}

/**
 * Publishes the server's functions.
 * */
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

/**
 * Creates the server.
 * */
const loggerServer = getServer();
loggerServer.bindAsync('localhost:7080', grpc.ServerCredentials.createInsecure(), () => {
    loggerServer.start();
});

exports.getServer = getServer;