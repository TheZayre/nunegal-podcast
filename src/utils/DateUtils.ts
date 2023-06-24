export function getTime(seconds) {

    if (seconds?.indexOf(':') < 0) {
        var hour = Math.floor(seconds / 3600) as any;
        hour = (hour < 10) ? '0' + hour : hour;
        var minute = Math.floor((seconds / 60) % 60) as any;
        minute = (minute < 10) ? '0' + minute : minute;
        var second = seconds % 60 as any;
        second = (second < 10) ? '0' + second : second;
        return hour + ':' + minute + ':' + second;

    }
    return seconds;
}

export function moreOldThanADay(date) {
    var fechaInicio = new Date(date).getTime();
    var fechaFin = new Date().getTime();
    if ((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24) >= 1) {
        return true;
    }
    else return false;

}