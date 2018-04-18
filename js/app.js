var myApp = angular.module("myApp", ["ngRoute"]);

myApp.config([
  "$routeProvider",
  function($routeProvider) {
    $routeProvider
      .when("/home", {
        templateUrl: "views/home.html",
        controller: "filmController"
      })
      .when("/result", {
        templateUrl: "views/result.html",
        controller: "resultController"
      })
      .otherwise({
        redirectTo: "/home"
      });
  }
]);

/* myApp.controller("MyController", function MyController($scope, $http) {
  $http({
    method: "get",
    url: "/js/data.json"
  }).then(
    function(response) {
      console.log(response, "res");
      $scope.larare = response.data;
    },
    function(error) {
      console.log(error, "can not get data.");
    }
  );
}); */

myApp.controller("filmController", function filmController(
  $scope,
  $http,
  $location
) {
  // Här körs funktionen search när jag tryckt på Sök knappen
  $scope.search = function() {
    // Hämtar namnet på filmen
    var title = $scope.movieTitle;
    // Ändrar sidan till resultat.html och lägger till movieTitle: namnet på filmen, uppe i adressfältet för att kunna skicka namnet på filmen in i nästa controller
    $location.path("/result").search({ movieTitle: title });
  };
});

myApp.controller("resultController", function resultController (
  $scope,
  $http,
  $routeParams,
  $window
) {

  $scope.getData = function(movieTitle) {
    // Skapar anslutningen till api:et och lägger till variabeln som användaren angett i inputfältet
    $http
      .get("http://www.omdbapi.com/?t=" + movieTitle + "&apikey=526345a6")
      .then(function(response) {
        var data = response.data;

        // Om ingen film är hittad
        if (data.Error) {
          alert("Film inte funnen, går tillbaka till startsidan");
          $window.location.href = 'http://webbkurs.ei.hv.se/~lajo0010/webbapp/';
        }

        // Loppar igenom datan i api:et för att kolla om det inte finns data på det jag vill visa
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            let element = data[key];
            if (element === "N/A") {
              data[key] = "Inget hittat";
              if (key === "Poster") {
                $scope.post = "Ingen poster hittad.";
              }
            }
            $scope.url = data;
          }
        }

        // Kollar om det finns något i Ratings arrayen
        if (data.Ratings.length === 0) {
          $scope.rate = "Ingen utmärkelse/er hittad";
        }
        console.log(data);
      });
  };

  $scope.backToHome = function () {
    $window.location.href = 'http://webbkurs.ei.hv.se/~lajo0010/webbapp/';
  }
  
  // Här hämtar jag titel på filmen som jag lagrat i adressfältet
  var movieTitle = $routeParams["movieTitle"];
  // Kallar på getData funktionen med titel som parameter
  $scope.getData(movieTitle);

});
