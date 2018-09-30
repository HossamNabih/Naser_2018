app.controller("facilities_codes", function ($scope, $http) {

  $scope.facility_code = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/facilities_codes/upload/image', fd, {
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
        $scope.facility_code.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

  $scope.loadFacilities_Codes = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/facilities_codes/all",
      data: {
        select : {id:1 , name : 1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.facilities_codes = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };

  $scope.loadAll = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/facilities_codes/all",
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

  $scope.newFacility_Code = function () {
    $scope.error = '';
    $scope.facility_code = { image_url: '/images/facility_code.png' };
    site.showModal('#addFacility_CodeModal');
  };
  $scope.add = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/facilities_codes/add",
      data: $scope.facility_code
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addFacility_CodeModal');
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

  $scope.edit = function (facility_code) {
    $scope.error = '';
    $scope.view(facility_code);
    $scope.facility_code = {};
    site.showModal('#updateFacility_CodeModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/facilities_codes/update",
      data: $scope.facility_code
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateFacility_CodeModal');
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

  $scope.remove = function (facility_code) {
    $scope.view(facility_code);
    $scope.facility_code = {};
    site.showModal('#deleteFacility_CodeModal');
  };

  $scope.view = function (facility_code) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/facilities_codes/view",
      data: { _id: facility_code._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.facility_code = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (facility_code) {
    $scope.view(facility_code);
    $scope.facility_code = {};
    site.showModal('#viewFacility_CodeModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/facilities_codes/delete",
      data: { _id: $scope.facility_code._id, name: $scope.facility_code.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteFacility_CodeModal');
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
  $scope.loadFacilities_Codes();
});
