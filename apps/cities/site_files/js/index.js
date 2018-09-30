app.controller("cities", function ($scope, $http) {

  $scope.city = {};

  $scope.loadGoves = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/goves/all",
      data: {
        select: {
          id: 1,
          name: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.goves = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadAll = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cities/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.newCity = function () {
    $scope.error = '';
    $scope.city = {
      image_url: '/images/city.png'
    };
    site.showModal('#addCityModal');
  };

  $scope.add = function () {

    $scope.error = '';
    const v = site.validated();
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cities/add",
      data: $scope.city
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addCityModal');
          $scope.loadAll();
        } else {
          $scope.error = '##word.error##';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.edit = function (city) {
    $scope.error = '';
    $scope.city = {};
    $scope.view(city);
    site.showModal('#updateCityModal');
  };

  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cities/update",
      data: $scope.city
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateCityModal');
          $scope.loadAll();
        } else {
          $scope.error = '##word.error##';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.remove = function (city) {
    $scope.view(city);
    $scope.city = {};
    site.showModal('#deleteCityModal');
  };

  $scope.view = function (city) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cities/view",
      data: {
        id: city.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.city = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.details = function (city) {
    $scope.view(city);
    $scope.city = {};
    site.showModal('#viewCityModal');
  };

  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cities/delete",
      data: {
        id: $scope.city.id,
        name: $scope.city.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteCityModal');
          $scope.loadAll();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.searchAll = function () {

    let where = {};

    if ($scope.search.gov) {

      where['gov.id'] = $scope.search.gov.id;
      where['name'] = $scope.search.city;
    }

    $scope.loadAll(where);

    site.hideModal('#SearchModal')

  };

  $scope.loadCities = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Cities/all",
      data: {
        select: {
          id: 1,
          name: 1,
          balance: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.cities = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadAll();
  $scope.loadGoves();
  $scope.loadCities();
});