app.controller("employees_mobiles", function ($scope, $http) {

  $scope.employee_mobile = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/employees_mobiles/upload/image', fd, {
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
        $scope.employee_mobile.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

  $scope.loadEmployees = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data: {
        select: { id: 1, name: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employees = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };


  $scope.loadMobiles_Slides = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/mobiles_slides/all",
      data: {
        select: { id: 1, name: 1, number: 1, value: 1, slide_name: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.mobiles_slides = response.data.list;
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
      url: "/api/employees_mobiles/all",
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

  $scope.newEmployee_Mobile = function () {
    $scope.error = '';
    $scope.employee_mobile = { image_url: '/images/employee_mobile.png' };
    site.showModal('#addEmployee_MobileModal');
  };
  $scope.add = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_mobiles/add",
      data: $scope.employee_mobile
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addEmployee_MobileModal');
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

  $scope.edit = function (employee_mobile) {
    $scope.error = '';
    $scope.view(employee_mobile);
    $scope.employee_mobile = {};
    site.showModal('#updateEmployee_MobileModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_mobiles/update",
      data: $scope.employee_mobile
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateEmployee_MobileModal');
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

  $scope.remove = function (employee_mobile) {
    $scope.view(employee_mobile);
    $scope.employee_mobile = {};
    site.showModal('#deleteEmployee_MobileModal');
  };

  $scope.view = function (employee_mobile) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_mobiles/view",
      data: { _id: employee_mobile._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_mobile = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (employee_mobile) {
    $scope.view(employee_mobile);
    $scope.employee_mobile = {};
    site.showModal('#viewEmployee_MobileModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_mobiles/delete",
      data: { _id: $scope.employee_mobile._id, name: $scope.employee_mobile.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteEmployee_MobileModal');
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
  $scope.loadEmployees();
  $scope.loadMobiles_Slides();
});
