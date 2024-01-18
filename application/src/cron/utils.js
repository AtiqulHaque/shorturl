const DEFAULT_MISSING_VALUES_FOR_FIELDS = {
  minute: 0,
  hour: 0,
  dayOfMonth: 1,
  month: 1,
  dayOfWeek: 0,
};

const fieldOrder = ["minute", "hour", "dayOfMonth", "month", "dayOfWeek"];

module.exports.convertToCronExpression = (schedule) => {
  const transformedSchedule = {...schedule};

  let oneFieldAlreadySet = false;
  for (const fieldName of fieldOrder) {
    if (transformedSchedule[fieldName] === undefined) {
      if (!oneFieldAlreadySet) {
        transformedSchedule[fieldName] =
          DEFAULT_MISSING_VALUES_FOR_FIELDS[fieldName];
      } else {
        transformedSchedule[fieldName] = "*";
      }
    } else {
      oneFieldAlreadySet = true;
    }
  }

  let {minute, hour, dayOfMonth, month, dayOfWeek} = transformedSchedule;

  return `0 ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
};
