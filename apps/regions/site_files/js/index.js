app.controller("regions", function ($scope, $http) {

  $scope.region = {};

 


  $scope.loadAll = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/regions/all",
      data: {where : where}
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

  $scope.newRegion = function () {
    $scope.error = '';
    $scope.region = { image_url: '/images/region.png' };
    site.showModal('#addRegionModal');
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
      url: "/api/regions/add",
      data: $scope.region
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addRegionModal');
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

  $scope.edit = function (region) {
    $scope.error = '';
    $scope.region = {};
    $scope.view(region);
    site.showModal('#updateRegionModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/regions/update",
      data: $scope.region
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateRegionModal');
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

  $scope.remove = function (region) {
    $scope.view(region);
    $scope.region = {};
    site.showModal('#deleteRegionModal');
  };

  $scope.view = function (region) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/regions/view",
      data: { id: region.id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.region = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (region) {
    $scope.view(region);
    $scope.region = {};
    site.showModal('#viewRegionModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/regions/delete",
      data: { id: $scope.region.id, name: $scope.region.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteRegionModal');
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
  $scope.loadRegions = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Regions/all",
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
          $scope.regions = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  
  $scope.searchAll = function () {
    
    let where = {};

    if ($scope.search.name) {
     
      where['name'] = $scope.search.name;
    }

    $scope.loadAll(where);
    
    site.hideModal('#SearchModal')

  };

  $scope.loadAll();
  $scope.loadAll();

});
