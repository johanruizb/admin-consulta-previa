import dayjs from "dayjs";

function getTimeout(startTime, minDuration) {
    const duration = dayjs().diff(startTime, "millisecond");
    const timeout = Math.max(0, minDuration - duration);

    return timeout;
}

export default getTimeout;
