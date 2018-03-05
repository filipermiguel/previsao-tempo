Forecast.service('WeatherService', ['$http', '$q', function ($http, $q) {

    var urlBaseLocale = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/"
    var urlBaseForecast = "http://apiadvisor.climatempo.com.br/api/v1/";
    var token = "3667d16e44a0502801a92ab976b49d7c";

    this.getStates = function () {
        var deferred = $q.defer();

        $http.get(urlBaseLocale).success(function (data) {
            deferred.resolve(data);
        }).error(function () {
            deferred.resolve(null);
        });

        return deferred.promise;
    };

    this.getCitiesByState = function (stateId) {
        var deferred = $q.defer();

        $http.get(urlBaseLocale + stateId + "/municipios").success(function (data) {
            deferred.resolve(data);
        }).error(function (e) {
            deferred.resolve(null);
        });

        return deferred.promise;
    };

    this.getCityIdByName = function (state, name) {
        var deferred = $q.defer();

        $http.get(urlBaseForecast + "locale/city?name=" + name + "&state=" + state + "&token=" + token).success(function (data) {
            deferred.resolve(data);
        }).error(function (e) {
            deferred.resolve(null);
        });
        
        return deferred.promise;
    };

    this.getForecastByCity = function (id) {
        var deferred = $q.defer();

        $http.get(urlBaseForecast + "forecast/locale/" + id + "/days/15?token=" + token).success(function (data) {
            deferred.resolve(data);
        }).error(function () {
            deferred.resolve(null);
        });

        return deferred.promise;
    };

}]);