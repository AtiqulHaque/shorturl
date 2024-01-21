
const RESPONSE_VALIDATION_ERROR = "validation-error";
const RESPONSE_SUCCESS = "success";
const RESPONSE_EMPTY = "empty";
const RESPONSE_ERROR = "error";

const TYPE_OF_UNDEFINED         = "undefined";

const REDIS_COUNT               = "count";
const REDIS_KEY_SPLIT           = "split";
const REDIS_KEY_ACTUAL_KEYWORD  = "actual_keyword";
const REDIS_KEY_MAPPING         = "mapping";
const REDIS_KEY_STATUS          = "status";

const UPDATE_QUEUE = "update_keyword";
const UPDATE_JOB   = "update_keyword";

const INSERT_QUEUE = "insert_keyword";
const INSERT_JOB   = "insert_keyword";

const STATS_QUEUE = "url_stats_queue";
const STATS_JOB   = "stats_job";

const REJECT_FOR_SPLIT = 0;
const ACCEPT_FOR_SPLIT = 1;
const CACHE_EXPIRE_TIME = 10800;
const CACHE_MEMORY_SIZE = (1.8 * 1024);


module.exports = {
  RESPONSE_VALIDATION_ERROR,
  RESPONSE_SUCCESS,
  REDIS_COUNT,
  UPDATE_QUEUE,
  UPDATE_JOB,
  INSERT_QUEUE,
  INSERT_JOB,
  REDIS_KEY_MAPPING,
  REDIS_KEY_SPLIT,
  REDIS_KEY_ACTUAL_KEYWORD,
  RESPONSE_ERROR,
  TYPE_OF_UNDEFINED,
  REJECT_FOR_SPLIT,
  ACCEPT_FOR_SPLIT,
  REDIS_KEY_STATUS,
  RESPONSE_EMPTY,
  CACHE_EXPIRE_TIME,
  CACHE_MEMORY_SIZE,
  STATS_QUEUE,
  STATS_JOB
}

