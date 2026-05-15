// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
import security_advisories_fileshare.file_storage;

import ballerina/http;
import ballerina/log;

@display {
    label: "Security Advisories File Share Backend",
    id: "security-advisories/files-backend"
}
@http:ServiceConfig {
    cors: {
        allowOrigins: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            // Local dev when mapping patches.wso2.com → 127.0.0.1 (see README).
            "http://patches.wso2.com:3000"
        ],
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowCredentials: true,
        allowHeaders: ["x-jwt-assertion", "Authorization", "Content-Type"],
        exposeHeaders: [],
        maxAge: 84900
    }
}
service / on new http:Listener(9090) {

    function init() {
        error? fsHealth = file_storage:healthCheck();
        if fsHealth is error {
            log:printError("Startup failed: File storage health check failed", fsHealth);
            panic fsHealth;
        }
    }

    resource function get health() returns http:Ok|http:ServiceUnavailable {
        error? fileStorageHealth = file_storage:healthCheck();
        if fileStorageHealth is error {
            string customError = "Health check failed: File storage unavailable";
            log:printError(customError, fileStorageHealth);
            return <http:ServiceUnavailable>{
                body: {
                    status: "unhealthy",
                    message: customError
                }
            };
        }

        return <http:Ok>{
            body: {
                status: "healthy",
                message: MSG_SERVICE_HEALTHY,
                dependencies: {
                    fileStorage: "healthy"
                }
            }
        };
    }

    # Stream file bytes from Azure File Share (used by the SPA for PDF advisory links).
    resource function get file(string path) returns http:Response|
    http:BadRequest|http:InternalServerError {
        if !path.matches(re `${ALLOWED_PATH_PATTERN}`) {
            log:printError(string `Invalid path format: ${path}`);
            return <http:BadRequest>{
                body: {message: ERR_MSG_INVALID_PATH}
            };
        }

        byte[]|error fileBytes = file_storage:downloadFile(path);
        if fileBytes is error {
            log:printError(string `Failed to download file: ${path}`, fileBytes);
            return <http:InternalServerError>{body: {message: ERR_MSG_DOWNLOAD_SECURITY_ADVISORY}};
        }

        string contentType = file_storage:getContentType(path);
        string fileName = file_storage:getFileName(path);
        http:Response response = new;
        response.setPayload(fileBytes);
        response.setHeader("Content-Type", contentType);
        response.setHeader("Content-Disposition", string `inline; filename="${fileName}"`);
        return response;
    }
}
