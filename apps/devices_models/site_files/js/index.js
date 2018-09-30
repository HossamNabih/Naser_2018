app.controller("devices_models", function ($scope, $http) {

  $scope.device_model = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/devices_models/upload/image', fd, {
      withCredentials: true,
      headers: {
        'Content-Type': undefined
      },
      uploadEventHandlers: {
        progress: function (e) {
          $scope.uploadStatus = "Uploading : " + Math.round((e.loaded * 100 / e.total)) + " %";
          if (e.loaded == e.total) {
            $scope.uploadStatus = "100%";
          }
        }
      },
      transformRequest: angular.identity
    }).then(function (res) {
      if (res.data && res.data.done) {
        $scope.uploadStatus = "File Uploaded";
        $scope.device_model.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

  $scope.loadAll = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/devices_models/all",
      data: {}
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
        select : {id:1 , name : 1}
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
    if (category && category._id) {
      where = {
        'category._id': category._id
      };
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/sub_categories/all",
      data: {
        where: where,
        select : {id:1 , name : 1}
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

  $scope.newDevice_Model = function () {
    $scope.device_model = { image_url: '/images/device_model.png' };
    site.showModal('#addDevice_ModelModal');
  };
  $scope.add = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/devices_models/add",
      data: $scope.device_model
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addDevice_ModelModal');
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

  $scope.edit = function (device_model) {
    $scope.view(device_model);
    $scope.device_model = {};
    site.showModal('#updateDevice_ModelModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/devices_models/update",
      data: $scope.device_model
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateDevice_ModelModal');
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

  $scope.remove = function (device_model) {
    $scope.view(device_model);
    $scope.device_model = {};
    site.showModal('#deleteDevice_ModelModal');
  };

  $scope.view = function (device_model) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/devices_models/view",
      data: { _id: device_model._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.device_model = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (device_model) {
    $scope.view(device_model);
    $scope.device_model = {};
    site.showModal('#viewDevice_ModelModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/devices_models/delete",
      data: { _id: $scope.device_model._id, name: $scope.device_model.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteDevice_ModelModal');
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
  $scope.loadAll();
  $scope.loadCategories();
  $scope.loadSub_Categories();

});
