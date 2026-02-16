import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const DEFAULT_TZ = 'Asia/Seoul';

/**
 * 현재 UTC Unix ms
 */
export function nowUnixMs(): number {
    return dayjs().valueOf();
}

/**
 * 현재 UTC Unix seconds
 */
export function nowUnixSec(): number {
    return dayjs().unix();
}

/**
 * 현재 UTC ISO 문자열
 */
export function nowUtcIso(): string {
    return dayjs().utc().toISOString();
}

/**
 * 지정 타임존 ISO
 */
export function nowIso(tz: string = DEFAULT_TZ): string {
    return dayjs().tz(tz).format();
}

export function format(
    date: dayjs.ConfigType,
    pattern: string,
    tz: string = DEFAULT_TZ
): string {
    return dayjs(date).tz(tz).format(pattern);
}

export function toUnixMs(date: dayjs.ConfigType): number {
    return dayjs(date).valueOf();
}

export function toUnixSec(date: dayjs.ConfigType): number {
    return dayjs(date).unix();
}

export function addMinutes(date: dayjs.ConfigType, minutes: number) {
    return dayjs(date).add(minutes, 'minute');
}

export function addHours(date: dayjs.ConfigType, hours: number) {
    return dayjs(date).add(hours, 'hour');
}

export function addDays(date: dayjs.ConfigType, days: number) {
    return dayjs(date).add(days, 'day');
}

export function diffMs(from: dayjs.ConfigType, to: dayjs.ConfigType): number {
    return dayjs(to).diff(dayjs(from));
}

/**
 * 특정 시각이 현재보다 과거인지
 */
export function isExpired(date: dayjs.ConfigType): boolean {
    return dayjs(date).isBefore(dayjs());
}

/**
 * 특정 분 단위로 floor (ex: 15분 단위 interval)
 */
export function floorToMinutes(date: dayjs.ConfigType, unit: number) {
    const d = dayjs(date);
    const minute = Math.floor(d.minute() / unit) * unit;
    return d.minute(minute).second(0).millisecond(0);
}

/**
 * 분 단위 interval 키 생성 (Kafka job key 용)
 */
export function intervalKey(date: dayjs.ConfigType, unit: number) {
    return floorToMinutes(date, unit).format('YYYYMMDDHHmm');
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function timeBasedId(): string {
    return dayjs().format('YYYYMMDDHHmmssSSS');
}

export function isWithinMinutes(
    date: dayjs.ConfigType,
    minutes: number
): boolean {
    return dayjs().diff(dayjs(date), 'minute') <= minutes;
}
