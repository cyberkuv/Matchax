function calcDis(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var rdlt1 = Math.PI * lat1 / 180;
        var rdlt2 = Math.PI * lat2 / 180;
        var dflon = lon1 - lon2;
        var rddflon = Math.PI * dflon / 180;
        var dsn = Math.sin(rdlt1) * Math.sin(rdlt2) + Math.cos(rdlt1) * Math.cos(rdlt2) * Math.cos(rddflon);
        if (dsn > 1) {
            dsn = 1;
        }
        dsn = Math.acos(dsn);
        dsn = dsn * 180 / Math.PI;
        dsn = dsn * 60 * 1.1515;
        if (unit == "K") {
            dsn = dsn * 1.609344;
        }
        if (unit == "N") {
            dsn = dsn * 0.8684;
        }
        return dsn;
    }
}