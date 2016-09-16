/*
    Copyright 2015 IBM Corp.
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
var exec = require("cordova/exec");

var success = function(message) {
    console.log("MFPLogger: Success: " + message);
};
var failure = function(message) {
    console.log("MFPLogger: Failure: " + message);
};

/**
 *
 * @param name
 * @constructor
 */
var Logger = function (name){
    this.name = name; // instance variable
};

Logger.prototype = function(){
    /**
     *
     * @param message
     */
    var debug = function (message) {
        cordova.exec(success, failure, "MFPLogger", "debug", [this.name, message]);
    };
    /**
     *
     * @param message
     */
    var info = function (message) {
        cordova.exec(success, failure, "MFPLogger", "info", [this.name, message]);
    };
    /**
     *
     * @param message
     */
    var error = function (message) {
        cordova.exec(success, failure, "MFPLogger", "error", [this.name, message]);
    };
    /**
     *
     * @param message
     */
    var fatal = function (message) {
        cordova.exec(success, failure, "MFPLogger", "fatal", [this.name, message]);
    };
    /**
     *
     * @param message
     */
    var warn = function (message) {
        cordova.exec(success, failure, "MFPLogger", "warn", [this.name, message]);
    };
    /**
     *
     * @returns {*}
     */
    var getName = function () {
        return this.name;
    };

    return {
        debug : debug,
        info : info,
        error : error,
        fatal : fatal,
        warn : warn,
        getName : getName
    };
}();

var MFPLogger = (function () {
    var instances = {};

    /**
     * Private Method for creating logger instances
     * @param name
     * @returns {Logger}
     */
    function createInstance(name) {
        var logger = new Logger(name);
        return logger;
    }

    function boolWrap(callback, result) {
        /*   For now, it seems that Java cannot 
         return boolean values to their callbacks.
         So we intercept the callback, check if it's a string
         and convert the result to a boolean.
        */ 
        if(typeof(result) == "string") {
            result = (result === "true");
        }
        callback(result);
    }

    return {
        /**
         *  Returns a named Logger Instance
         * @param name - the name for the logger
         * @returns {*} a Logger instance
         */
        getInstance: function (name) {
            if (!instances[name]) {
                instances[name] = createInstance(name);
            }
            return instances[name];
        },
        /**
         * Gets the current setting for determining if log data should be saved persistently
         * @param {Boolean} enabled - Boolean used to indicate whether the log data must be saved persistently
         */
        storeLogs : function (enabled) {
            cordova.exec(boolWrap.bind(null, success), failure, "MFPLogger", "storeLogs", [enabled]);
        },
        /**
         * Gets the current setting for the maximum storage size threshold
         * @param success - single parameter receives Integer indicating the maximum storage size threshold
         * @param failure
         */
        getMaxLogStoreSize : function (success, failure) {
            cordova.exec(success , failure, "MFPLogger", "getMaxLogStoreSize", []);
        },
        /**
         * Sets the maximum size of the local persistent storage for queuing log data.
         * When the maximum storage size is reached, no more data is queued. This content of the storage is sent to a server.
         * @param {integer} intSize
         */
        setMaxLogStoreSize : function (intSize) {
            cordova.exec(success , failure, "MFPLogger", "setMaxLogStoreSize", [intSize]);
        },
        /** Determines if logs are currently being store
         * @param success - single parameter receives Integer indicating the maximum storage size threshold
         * @param failure
         */
        isStoringLogs : function(success, failure){
            cordova.exec(success , failure, "MFPLogger", "isStoringLogs", []);
        },
        /**
         * Enable displaying all Bluemix Mobile Services SDK debug logs in Logcat. By default, no debug messages are displayed.
         * @param enabled Determines whether to display Bluemix Mobile Services SDK debug logs in Logcat.
         */
        setSDKDebugLoggingEnabled : function (enabled) {
            cordova.exec(boolWrap(null, success), failure, "MFPLogger", "setSDKDebugLoggingEnabled", [enabled]);
        },
        /** Check if displaying all Bluemix Mobile Services SDK debug logs in Logcat is enabled.
         * @param success - single parameter receives Integer indicating the maximum storage size threshold
         * @param failure
         */
        isSDKDebugLoggingEnabled : function (success, failure ) {
            cordova.exec(success , failure, "MFPLogger", "isSDKDebugLoggingEnabled", []);
        },
        /**
         * Gets the currently configured Log Level
         * @param success callback receives  {integer} indicating Log Level
         * @param failure
         */
        getLogLevel : function (success, failure) {
            cordova.exec(success , failure, "MFPLogger", "getLogLevel", []);
        },
        /**
         * Sets the level from which log messages must be saved and printed.
         * For example, passing MFPLogger.INFO logs INFO, WARN, and ERROR.

         * @param { integer or symbolic level definde below} logLevel
         */
        setLogLevel : function (logLevel) {
            cordova.exec(success , failure, "MFPLogger", "setLogLevel", [logLevel]);
        },
        /**
         * Indicates that an uncaught exception was detected.
         * The indicator is cleared on successful send.
         * @param success callback receives Boolean that indicates an uncaught exception was detected (true) or not (false)
         * @param failure
         */
        isUncaughtExceptionDetected : function (success, failure) {
            cordova.exec(success , failure, "MFPLogger", "isUncaughtExceptionDetected", []);
        },
        /**
         * Sends the log file when the log store exists and is not empty.
         * If the send fails, the local store is preserved. If the send succeeds, the local store is deleted.
         * @param success callback
         * @param failure callback
         */
        send : function (success, failure) {
            cordova.exec(success , failure, "MFPLogger", "send", []);
        }
    };
})();

/** Trace level */
MFPLogger.FATAL = "FATAL";
MFPLogger.ERROR = "ERROR";
MFPLogger.WARN  = "WARN";
MFPLogger.INFO  = "INFO";
MFPLogger.DEBUG = "DEBUG";

module.exports = MFPLogger;