app.controller("subledgers", function ($scope, $http) {

  $scope.subledgers = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/subledgers/upload/image', fd, {
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
        $scope.subledgers.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

 
  $scope.loadAll = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/subledgers/all",
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

  $scope.newSubledgers = function () {
    $scope.subledgers = { image_url: '/images/subledgers.png', debit: false, credit: false };
    site.showModal('#addSubledgersModal');
  };
  $scope.add = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/subledgers/add",
      data: $scope.subledgers
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addSubledgersModal');
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

  $scope.edit = function (subledgers) {
    $scope.subledgers = {};
    $scope.view(subledgers);
    site.showModal('#updateSubledgersModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/subledgers/update",
      data: $scope.subledgers
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateSubledgersModal');
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

  $scope.remove = function (subledgers) {
    $scope.view(subledgers);
    $scope.subledgers = {};
    site.showModal('#deleteSubledgersModal');
  };

  $scope.view = function (subledgers) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/subledgers/view",
      data: { _id: subledgers._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.subledgers = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (subledgers) {
    $scope.view(subledgers);
    $scope.subledgers = {};
    site.showModal('#viewSubledgersModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/subledgers/delete",
      data: { _id: $scope.subledgers._id, name: $scope.subledgers.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deletesubledgersModal');
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
});
