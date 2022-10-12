/**
 * Path to proto file
 * */
const PATH = __dirname + '/protos/logger.proto';
/**
 * gRCP definitions
 * */
const _ = require('lodash');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
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
/**
 * Logger definition & client
 * */
const logger = protoDescriptor.logger;
const client = new logger.Logger(
    'architectural-logger-hexagonal' + ':' + '7080',
    //'localhost' + ':' + 7080,
    grpc.credentials.createInsecure());

/**
 * Function to debug logging
 * */
function runLogDebug(message, callback) {
    client.logDebug(getLoggerRequest(message), featureCallback(callback));
}

/**
 * Function to info logging
 * */
function runLogInfo(message, callback) {
    client.logInfo(getLoggerRequest(message), featureCallback(callback));
}

/**
 * Function to warn logging
 * */
function runLogWarn(message, callback) {
    client.logWarn(getLoggerRequest(message), featureCallback(callback));
}

/**
 * Function to error logging
 * */
function runLogError(message, callback) {
    client.logError(getLoggerRequest(message), featureCallback(callback));
}

/**
 * Function to create callback
 * */
function featureCallback(callback) {
    return _.after(1, callback);
}

/**
 * Function to prepare message object
 * */
function getLoggerRequest(message) {
    return {
        serviceName: 'Frontend',
        message: message
    };
}

/**
 * Function's exports
 * */
exports.runLogDebug = runLogDebug;
exports.runLogInfo = runLogInfo;
exports.runLogWarn = runLogWarn;
exports.runLogError = runLogError;