app.controller("devices_names", function ($scope, $http) {

  $scope.device_name = {};

  $scope.loadAll = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/devices_names/all",
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

  $scope.loadCategories = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/categories/all",
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
          $scope.categories = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.loadSub_Categories = function (category) {
    var where = {};
    if (typeof category === 'string') {
      category = JSON.parse(category);
    } else {
      category = category || {};
    }
    if (category && category.id) {
      where = {
        'category.id': category.id
      };
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/sub_categories/all",
      data: {
        where: where,
        select: {
          id: 1,
          name: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.sub_categories = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.newDevice_Name = function () {
    $scope.error = '';
    $scope.device_name = {
      image_url: '/images/device_name.png'
    };
    site.showModal('#addDevice_NameModal');
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
      url: "/api/devices_names/add",
      data: $scope.device_name
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addDevice_NameModal');
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

  $scope.edit = function (device_name) {
    $scope.error = '';
    $scope.view(device_name);
    $scope.device_name = {};
    site.showModal('#updateDevice_NameModal');
  };

  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/devices_names/update",
      data: $scope.device_name
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateDevice_NameModal');
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

  $scope.remove = function (device_name) {
    $scope.view(device_name);
    $scope.device_name = {};
    site.showModal('#deleteDevice_NameModal');
  };

  $scope.view = function (device_name) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/devices_names/view",
      data: {
        id: device_name.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.device_name = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.details = function (device_name) {
    $scope.view(device_name);
    $scope.device_name = {};
    site.showModal('#viewDevice_NameModal');
  };

  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/devices_names/delete",
      data: {
        id: $scope.device_name.id,
        name: $scope.device_name.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteDevice_NameModal');
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

  $scope.loadDevices_names = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Devices_names/all",
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
          $scope.devices_names = response.data.list;
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

    if ($scope.search.category) {
      where['category.id'] = $scope.search.category.id;
    }
    if ($scope.search.sub_category) {
      where['sub_category.id'] = $scope.search.sub_category.id;


      where['name'] = $scope.search.device_names;
    }
    $scope.loadAll(where);

    site.hideModal('#SearchModal')

  };

  $scope.loadAll();
  $scope.loadCategories();
  $scope.loadSub_Categories();
  $scope.loadDevices_names();
});