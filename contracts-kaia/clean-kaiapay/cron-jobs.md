 cron-job.org Logo

CONTENTS:
Creating cron jobs
REST API
Introduction
Limitations
Requests
API Methods
Listing Cron Jobs
Retrieving Cron Job Details
Creating a Cron Job
Updating a Cron Job
Deleting a Cron Job
Retrieving the Job Execution History
Retrieving Job Execution History Item Details
Data Types
 REST API View page source
REST API

Introduction

cron-job.org provides an API which enables users to programatically create, update, delete and view cron jobs. The API provides a REST-like interface with API-key based authorization and JSON request and response payload. Given this, the API should be easily usable from virtually any programming language.

Limitations

In order to prevent abuse of our service, we enforce a daily usage limit. By default, this limit is 100 requests per day, but can be increased upon request. For sustaining members, a higher limit of 5,000 requests per day applies.

Apart from the daily request limit, individual rate limits might apply depending on the specific API call made. Those limits are mentioned in the documentation of the specific API method.

Requests

Endpoint

The API endpoint is reachable via HTTPS at:

https://api.cron-job.org/
Authentication

All requests to the API must be authenticated via an API key supplied in the Authorization bearer token header. API keys can be retrieved/generated in the cron-job.org Console at “Settings”. An example header could look like:

Authorization: Bearer zaX78aqKJuIH4l4RX6njoqADn77MQNJJ
Access via a specific API key might be restricted to certain IP addresses, if configured in the Console. In this case, requests from non-allowlisted IP addresses will be rejected with an HTTP error code of 403.

Warning

API keys are secrets, just like a password. They allow access to your cron-job.org account via the API and should always be treated confidentially. We highly recommend to also enable the IP address restriction whenever possible.
Content Type

In case a request requires a payload, it must be JSON-encoded and the Content-Type header must be set to application/json. In case the Content-Type header is missing or contains a different value, the request payload will be ignored.

HTTP Status Codes

The following status codes can be returned by the API:

Status code
Description
200
OK: Request succeeded
400
Bad request: Invalid request / invalid input data
401
Unauthorized: Invalid API key
403
Forbidden: API key cannot be used from this origin
404
Not found: The requested resource could not be found
409
Conflict, e.g. because a resource already exists
429
API key quota, resource quota or rate limit exceeded
500
Internal server error
Examples

Example request via curl:

curl -X PATCH \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer zaX78aqKJuIH4l4RX6njoqADn77MQNJJ' \
     -d '{"job":{"enabled":true}}' \
     https://api.cron-job.org/jobs/12345
Example request via Python:

import json
import requests

ENDPOINT = 'https://api.cron-job.org'

headers = {
    'Authorization': 'Bearer zaX78aqKJuIH4l4RX6njoqADn77MQNJJ',
    'Content-Type': 'application/json'
}
payload = {
    'job': {
        'enabled': True
    }
}

result = requests.patch(ENDPOINT + '/jobs/12345', headers=headers, data=json.dumps(payload))
print(result.json())
API Methods

Listing Cron Jobs

List all jobs in this account:

GET /jobs
Input Object

None.

Output Object

Key
Type
Description
jobs
array of Job
List of jobs present in the account
someFailed
boolean
true in case some jobs could not be retrieved because of internal errors and the list might be incomplete, otherwise false
curl Example

curl -X GET \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer zaX78aqKJuIH4l4RX6njoqADn77MQNJJ' \
     https://api.cron-job.org/jobs
Response Example

{
    "jobs": [
        {
            "jobId": 12345,
            "enabled": true,
            "title": "Example Job",
            "saveResponses": false,
            "url": "https:\/\/example.com\/",
            "lastStatus": 0,
            "lastDuration": 0,
            "lastExecution": 0,
            "nextExecution": 1640187240,
            "type": 0,
            "requestTimeout": 300,
            "redirectSuccess": false,
            "folderId": 0,
            "schedule": {
                "timezone": "Europe/Berlin",
                "expiresAt": 0,
                "hours": [
                    -1
                ],
                "mdays": [
                    -1
                ],
                "minutes": [
                    0,
                    15,
                    30,
                    45
                ],
                "months": [
                    -1
                ],
                "wdays": [
                    -1
                ]
            },
            "requestMethod": 0
        }
    ],
    "someFailed": false
}
Rate Limit

Max. 5 requests per second.

Retrieving Cron Job Details

Retrieve detailed information for a specific cron job identified by its jobId:

GET /jobs/<jobId>
Input Object

None.

Output Object

Key
Type
Description
jobDetails
array of DetailedJob
Job details
curl Example

curl -X GET \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer zaX78aqKJuIH4l4RX6njoqADn77MQNJJ' \
     https://api.cron-job.org/jobs/12345
Response Example

{
    "jobDetails": {
        "jobId": 12345,
        "enabled": true,
        "title": "Example Job",
        "saveResponses": false,
        "url": "https:\/\/example.com\/",
        "lastStatus": 0,
        "lastDuration": 0,
        "lastExecution": 0,
        "nextExecution": 1640189160,
        "auth": {
            "enable": false,
            "user": "",
            "password": ""
        },
        "notification": {
            "onFailure": false,
            "onSuccess": false,
            "onDisable": false
        },
        "extendedData": {
            "headers": {
                "X-Foo": "Bar"
            },
            "body": "Hello World!"
        },
        "type": 0,
        "requestTimeout": 300,
        "redirectSuccess": false,
        "folderId": 0,
        "schedule": {
            "timezone": "Europe/Berlin",
            "expiresAt": 0,
            "hours": [
                -1
            ],
            "mdays": [
                -1
            ],
            "minutes": [
                0,
                15,
                30,
                45
            ],
            "months": [
                -1
            ],
            "wdays": [
                -1
            ]
        },
        "requestMethod": 0
    }
}
Rate Limit

Max. 5 requests per second.

Creating a Cron Job

Creating a new cron job:

PUT /jobs
Input Object

Key
Type
Description
job
DetailedJob
Job (only the url field is mandatory)
Output Object

Key
Type
Description
jobId
int
Identifier of the created job
curl Example

curl -X PUT \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer zaX78aqKJuIH4l4RX6njoqADn77MQNJJ' \
     -d '{"job":{"url":"https://example.com","enabled":true,"saveResponses":true,"schedule":{"timezone":"Europe/Berlin","expiresAt":0,"hours":[-1],"mdays":[-1],"minutes":[-1],"months":[-1],"wdays":[-1]}}}' \
     https://api.cron-job.org/jobs
Response Example

{
    "jobId": 12345
}
Rate Limit

Max. 1 request per second and 5 requests per minute.

Updating a Cron Job

Updating a cron job identified by its jobId:

PATCH /jobs/<jobId>
Input Object

Key
Type
Description
job
DetailedJob
Job delta (only include changed fields - unchanged fields can be left out)
Output Object

Empty object.

curl Example

curl -X PATCH \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer zaX78aqKJuIH4l4RX6njoqADn77MQNJJ' \
     -d '{"job":{"enabled":true}}' \
     https://api.cron-job.org/jobs/12345
Response Example

{}
Rate Limit

Max. 5 requests per second.

Deleting a Cron Job

Deleting a cron job identified by its jobId:

DELETE /jobs/<jobId>
Input Object

None.

Output Object

Empty object.

curl Example

curl -X DELETE \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer zaX78aqKJuIH4l4RX6njoqADn77MQNJJ' \
     https://api.cron-job.org/jobs/12345
Response Example

{}
Rate Limit

Max. 5 requests per second.

Retrieving the Job Execution History

Retrieve the execution history for a specific cron job identified by its jobId:

GET /jobs/<jobId>/history
Input Object

None.

Output Object

Key
Type
Description
history
array of HistoryItem
The last execution history items
predictions
array of int
Unix timestamps (in seconds) of the predicted next executions (up to 3)
Please note that the headers and body fields of the HistoryItem objects will not be populated. In order to retrieve headers and body, see Retrieving Job Execution History Item Details.

curl Example

curl -X GET \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer zaX78aqKJuIH4l4RX6njoqADn77MQNJJ' \
     https://api.cron-job.org/jobs/12345/history
Response Example

{
    "history": [
        {
            "jobLogId": 4946,
            "jobId": 12345,
            "identifier": "12345-22-11-4946",
            "date": 1640189711,
            "datePlanned": 1640189700,
            "jitter": 11257,
            "url": "http:\/\/example.com\/",
            "duration": 239,
            "status": 1,
            "statusText": "OK",
            "httpStatus": 200,
            "headers": null,
            "body": null,
            "stats": {
                "nameLookup": 1003,
                "connect": 85516,
                "appConnect": 0,
                "preTransfer": 85548,
                "startTransfer": 238112,
                "total": 238129
            }
        }
    ],
    "predictions": [
        1640190600,
        1640191500,
        1640192400
    ]
}
Rate Limit

Max. 5 requests per second.

Retrieving Job Execution History Item Details

Retrieve details for a specific history item identified by its identifier for a specific cron job identified by its jobId:

GET /jobs/<jobId>/history/<identifier>
Input Object

None.

Output Object

Key
Type
Description
jobHistoryDetails
HistoryItem
History item
curl Example

curl -X GET \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer zaX78aqKJuIH4l4RX6njoqADn77MQNJJ' \
     https://api.cron-job.org/jobs/12345/history/12345-22-11-4946
Response Example

{
    "jobHistoryDetails": {
        "jobLogId": 4946,
        "jobId": 12345,
        "identifier": "12345-22-11-4946",
        "date": 1640189711,
        "datePlanned": 1640189700,
        "jitter": 11257,
        "url": "http:\/\/example.com\/",
        "duration": 239,
        "status": 1,
        "statusText": "OK",
        "httpStatus": 200,
        "headers": "Accept-Ranges: bytes\r\nCache-Control: max-age=604800\r\nContent-Type: text\/html; charset=UTF-8...\r\n\r\n",
        "body": "<!doctype html>\n<html>\n<head>\n    <title>Example Domain<\/title>...\n",
        "stats": {
            "nameLookup": 1003,
            "connect": 85516,
            "appConnect": 0,
            "preTransfer": 85548,
            "startTransfer": 238112,
            "total": 238129
        }
    }
}
Rate Limit

Max. 5 requests per second.

Data Types

Job

The Job object represents a cron job.

Key
Type
Description
Default *
jobId
int
Job identifier (read only; ignored during job creation or update)
(auto-assigned)
enabled
boolean
Whether the job is enabled (i.e. being executed) or not
false
title
string
Job title
(empty)
saveResponses
boolean
Whether to save job response header/body or not
false
url
string
Job URL
(mandatory)
lastStatus
JobStatus
Last execution status (read only)
0 (Unknown / not executed yet)
lastDuration
int
Last execution duration in milliseconds (read only)
-
lastExecution
int
Unix timestamp of last execution (in seconds; read only)
-
nextExecution
int
Unix timestamp of predicted next execution (in seconds), null if no prediction available (read only)
-
type
JobType
Job type (read only)
0 (Default job)
requestTimeout
int
Job timeout in seconds
-1 (i.e. use default timeout)
redirectSuccess
boolean
Whether to treat 3xx HTTP redirect status codes as success or not
false
folderId
int
The identifier of the folder this job resides in
0 (root folder)
schedule
JobSchedule
Job schedule
{}
requestMethod
RequestMethod
HTTP request method
0 (GET)
* Value when field is omitted while creating a job.

DetailedJob

The DetailedJob object represents a cron job with detailed settings. It consists of all members of the Job object plus the following additional fields.

Key
Type
Description
auth
JobAuth
HTTP authentication settings
notification
JobNotificationSettings
Notification settings
extendedData
JobExtendedData
Extended request data
JobAuth

The JobAuth object represents HTTP (basic) authentication settings for a job.

Key
Type
Description
Default *
enable
boolean
Whether to enable HTTP basic authentication or not.
false
user
string
HTTP basic auth username
(empty)
password
string
HTTP basic auth password
(empty)
* Value when field is omitted while creating a job.

JobNotificationSettings

The JobNotificationSettings specifies notification settings for a job.

Key
Type
Description
Default *
onFailure
boolean
Whether to send a notification on job failure or not.
false
onSuccess
boolean
Whether to send a notification when the job succeeds after a prior failure or not.
false
onDisable
boolean
Whether to send a notification when the job has been disabled automatically or not.
false
* Value when field is omitted while creating a job.

JobExtendedData

The JobExtendedData holds extended request data for a job.

Key
Type
Description
Default *
headers
dictionary
Request headers (key-value dictionary)
{}
body
string
Request body data
(empty)
* Value when field is omitted while creating a job.

JobStatus

Value
Description
0
Unknown / not executed yet
1
OK
2
Failed (DNS error)
3
Failed (could not connect to host)
4
Failed (HTTP error)
5
Failed (timeout)
6
Failed (too much response data)
7
Failed (invalid URL)
8
Failed (internal errors)
9
Failed (unknown reason)
JobType

Value
Description
0
Default job
1
Monitoring job (used in a status monitor)
JobSchedule

The JobSchedule object represents the execution schedule of a job.

Key
Type
Description
Default *
timezone
string
Schedule time zone (see here for a list of supported values)
UTC
expiresAt
int
Date/time (in job’s time zone) after which the job expires, i.e. after which it is not scheduled anymore (format: YYYYMMDDhhmmss, 0 = does not expire)
0
hours
array of int
Hours in which to execute the job (0-23; [-1] = every hour)
[]
mdays
array of int
Days of month in which to execute the job (1-31; [-1] = every day of month)
[]
minutes
array of int
Minutes in which to execute the job (0-59; [-1] = every minute)
[]
months
array of int
Months in which to execute the job (1-12; [-1] = every month)
[]
wdays
array of int
Days of week in which to execute the job (0=Sunday - 6=Saturday; [-1] = every day of week)
[]
* Value when field is omitted while creating a job.

RequestMethod

Value
Description
0
GET
1
POST
2
OPTIONS
3
HEAD
4
PUT
5
DELETE
6
TRACE
7
CONNECT
8
PATCH
HistoryItem

The HistoryItem object represents a job history log entry corresponding to one execution of the job.

Key
Type
Description
jobId
int
Identifier of the associated cron job
identifier
string
Identifier of the history item
date
int
Unix timestamp (in seconds) of the actual execution
datePlanned
int
Unix timestamp (in seconds) of the planned/ideal execution
jitter
int
Scheduling jitter in milliseconds
url
string
Job URL at time of execution
duration
int
Actual job duration in milliseconds
status
JobStatus
Status of execution
statusText
string
Detailed job status Description
httpStatus
int
HTTP status code returned by the host, if any
headers
string or null
Raw response headers returned by the host (null if unavailable)
body
string or null
Raw response body returned by the host (null if unavailable)
stats
HistoryItemStats
Additional timing information for this request
HistoryItemStats

The HistoryItemStats object contains additional timing information for a job execution history item.

Key
Type
Description
nameLookup
int
Time from transfer start until name lookups completed (in microseconds)
connect
int
Time from transfer start until socket connect completed (in microseconds)
appConnect
int
Time from transfer start until SSL handshake completed (n microseconds) - 0 if not using SSL
preTransfer
int
Time from transfer start until beginning of data transfer (in microseconds)
startTransfer
int
Time from transfer start until the first response byte is received (in microseconds)
total
int
Total transfer time (in microseconds)
© Copyright 2024-2025, cron-job.org.

Built with Sphinx using a theme provided by Read the Docs.