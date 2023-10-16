import { DateTime } from 'luxon'

export default function formatTime(time) {
  let date = DateTime.fromISO(time)
  let dateDiff = date.day - DateTime.now().day
  let created_at_full = date.toLocaleString({
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h24',
  })
  let created_week_at =
    date.toLocaleString({
      weekday: 'long',
    }) +
    ' at ' +
    date.toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h24' })

  let created_yesterday_at = 'Yesterday at ' + date.toLocaleString(DateTime.TIME_24_SIMPLE)
  let created_at_time = date.toRelative()

  return dateDiff < -6
    ? created_at_full
    : dateDiff < -1
    ? created_week_at
    : dateDiff == -1
    ? created_yesterday_at
    : date.diffNow('seconds').seconds > -1 ? 'now' : created_at_time
}
