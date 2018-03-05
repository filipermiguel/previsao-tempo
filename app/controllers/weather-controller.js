Forecast.controller('WeatherController', function ($scope, $filter, WeatherService, localStorageService) {

    $scope.forecastIcons = [];
    var isLoadBlumenau = false;
    var isLoadingPage = true;

    $scope.loadStates = function () {
        var cacheState = localStorageService.get('state');
        var cacheCity = localStorageService.get('city');

        WeatherService.getStates().then(function (states) {
            $scope.states = states;

            if (!cacheState) {
                $scope.state = $filter('filter')($scope.states, { nome: 'Santa Catarina' }, true)[0];
                $scope.onSelectState($scope.state.id);
                isLoadBlumenau = true;
            } else {
                $scope.state = $filter('filter')($scope.states, { nome: cacheState.nome }, true)[0];
                $scope.onSelectState($scope.state.id);
            }
        });
    }

    $scope.onSelectState = function (stateId) {
        var cacheCity = localStorageService.get('city');

        localStorageService.set('state', $scope.state);
        if (!$scope.state) {
            $scope.forecast = null;
            $scope.loading = false;
            $scope.city = null;
            $scope.cities = null;
        }
        WeatherService.getCitiesByState(stateId).then(function (cities) {
            $scope.cities = cities;

            if (!cacheCity) {
                if (isLoadBlumenau) {
                    $scope.city = $filter('filter')($scope.cities, { nome: 'Blumenau' }, true)[0];
                    $scope.onSelectCity();
                    $scope.consultForecast();
                }
            } else {
                if (isLoadingPage) {
                    $scope.city = $filter('filter')($scope.cities, { nome: cacheCity.nome }, true)[0];
                    $scope.onSelectCity();
                    $scope.consultForecast();
                    isLoadingPage = false;
                }
            }
        });
    }

    $scope.onSelectCity = function () {
        localStorageService.set('city', $scope.city);
        if (!$scope.city) {
            $scope.forecast = null;
            $scope.loading = false;
        }
    }

    $scope.consultForecast = function () {
        if ($scope.state && $scope.city) {
            WeatherService.getCityIdByName($scope.city.microrregiao.mesorregiao.UF.sigla, $scope.city.nome).then(function (cityInfo) {
                WeatherService.getForecastByCity(cityInfo[0].id).then(function (data) {
                    $scope.forecast = data;
                    $scope.loading = true;

                    var maxDayOfWeek = null;
                    var minDayOfWeek = null;

                    var maxTemperature = -100;
                    var minTemperature = 100;

                    var firstWeekendDay = true;
                    $scope.hasWeekend = false;
                    $scope.goodForecast = false;

                    //Função retorna 15 dias, então temos que filtrar aqui mesmo
                    for (i = 0; i < 5; i++) {
                        if (data.data[i].temperature.min < minTemperature) {
                            minTemperature = data.data[i].temperature.min;
                            minDayOfWeek = data.data[i];
                        }
                        if (data.data[i].temperature.max > maxTemperature) {
                            maxTemperature = data.data[i].temperature.max;
                            maxDayOfWeek = data.data[i];
                        }
                        var day = new Date(data.data[i].date + ' 00:00');
                        if ((day.getDay() == 0 || day.getDay() == 6) && firstWeekendDay) {
                            $scope.hasWeekend = true;

                            if (data.data[i].temperature.max >= 25) {
                                $scope.goodForecast = true;
                            }
                        }
                        if (data.data[i].rain.probability > 80) {
                            $scope.forecastIcons[i] = "img/sunny.svg";
                        } else if (data.data[i].rain.probability > 60) {
                            $scope.forecastIcons[i] = "img/mostlycloudy.svg";
                        } else {
                            $scope.forecastIcons[i] = "img/sunny.svg";
                        }
                    }

                    $scope.maxDayOfWeek = maxDayOfWeek;
                    $scope.minDayOfWeek = minDayOfWeek;

                    renderGraph();
                });
            });
        } else {
            $scope.msg = "Informar a cidade e estado para consultar a previsão";
            $('#myModal').modal('show');
        }
    }

    renderGraph = function () {
        var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas);

        var areaChartData = {
            labels: [$scope.forecast.data[0].date_br, $scope.forecast.data[1].date_br, $scope.forecast.data[2].date_br, $scope.forecast.data[3].date_br, $scope.forecast.data[4].date_br],
            datasets: [
                {
                    fillColor: "rgba(210, 214, 222, 1)",
                    strokeColor: "rgba(210, 214, 222, 1)",
                    pointColor: "rgba(210, 214, 222, 1)",
                    pointStrokeColor: "#c1c7d1",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [$scope.forecast.data[0].temperature.max, $scope.forecast.data[1].temperature.max, $scope.forecast.data[2].temperature.max, $scope.forecast.data[3].temperature.max, $scope.forecast.data[4].temperature.max] //Temperatura Máxima
                },
                {
                    fillColor: "green",
                    strokeColor: "rgba(60,141,188,0.8)",
                    pointColor: "darkgreen",
                    pointStrokeColor: "rgba(60,141,188,1)",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "green",
                    data: [$scope.forecast.data[0].temperature.min, $scope.forecast.data[1].temperature.min, $scope.forecast.data[2].temperature.min, $scope.forecast.data[3].temperature.min, $scope.forecast.data[4].temperature.min] //Temperatura Mínima
                }
            ]
        };

        var areaChartOptions = {
            //Boolean - If we should show the scale at all
            showScale: true,
            //Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,
            //String - Colour of the grid lines
            scaleGridLineColor: "rgba(0,0,0,.05)",
            //Number - Width of the grid lines
            scaleGridLineWidth: 1,
            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,
            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: true,
            //Boolean - Whether the line is curved between points
            bezierCurve: true,
            //Number - Tension of the bezier curve between points
            bezierCurveTension: 0.3,
            //Boolean - Whether to show a dot for each point
            pointDot: true,
            //Number - Radius of each point dot in pixels
            pointDotRadius: 4,
            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth: 1,
            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius: 20,
            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,
            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,
            //Boolean - Whether to fill the dataset with a color
            datasetFill: true,
            //String - A legend template
            legendTemplate: "<ul class='chart-legend'><li><span style='background-color: #c1c7d1'></span>label1</li><li><span style='background-color: #3b8bba'></span>label1</li></ul>",
            //legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
            //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
            maintainAspectRatio: true,
            //Boolean - whether to make the chart responsive to window resizing
            responsive: true
        };
        //Create the line chart
        areaChart.Line(areaChartData, areaChartOptions);
    }

})