app.controller("employees_insurances", function ($scope, $http) {

  /* upload files */

  $scope.uploadFile = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/employee_insurance/upload/file', fd, {
      withCredentials: true,
      headers: {
        'Content-Type': undefined
      },
      uploadEventHandlers: {
        progress: function (e) {
          $scope.fileStatus = "Uploading : " + Math.round((e.loaded * 100 / e.total)) + " %";
          if (e.loaded == e.total) {
            $scope.fileStatus = "100%";
          }
        }
      },
      transformRequest: angular.identity
    }).then(function (res) {
      if (res.data && res.data.done) {
        $scope.fileStatus = "File Uploaded";
        $scope.employee_insurance.files.push({
          url: res.data.file_url,
          name: $scope.fileName || res.data.file_name
        });
        $scope.fileName = '';
      }
    }, function (error) {
      $scope.fileStatus = error;
    });
  };

  $scope.deleteFile = function (file) {
    for (let i = 0; i < $scope.employee_insurance.files.length; i++) {
      let f = $scope.employee_insurance.files[i];
      if (f.url === file.url) {
        $scope.employee_insurance.files.splice(i, 1);
        return;
      }
    }
  };



  /* end*/


  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/employees_insurances/upload/image', fd, {
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
        $scope.employee_insurance.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

  function toFloat(num){
    num = num || 0;
    num = num.toString().trim();
    return parseFloat(num);
  };

  $scope.calc = function () {
    $scope.employee_insurance.total = toFloat($scope.employee_insurance.fixed_salary) + 
    toFloat($scope.employee_insurance.insurance_discount) +
    toFloat( $scope.employee_insurance.variable_salary)
     + toFloat($scope.employee_insurance.salary_discount);
  },

  $scope.loadEmployees = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data: {
        select: { id: 1, name: 1, insurance_number: 1 }
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

  $scope.loadInsurances_slides = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/insurances_slides/all",
      data: {
        select: { id: 1, name: 1, value: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.insurances_slides = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };

  $scope.loadFacilites_Codes = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/facilities_codes/all",
      data: {
        select: { id: 1, name: 1 }
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
      url: "/api/employees_insurances/all",
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

  $scope.newEmployee_Insurance = function () {
    $scope.error = '';
    $scope.employee_insurance = { image_url: '/images/employee_insurance.png'  , increase : .07};
    site.showModal('#addEmployee_InsuranceModal');
  };
  $scope.add = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_insurances/add",
      data: $scope.employee_insurance
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addEmployee_InsuranceModal');
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

  $scope.edit = function (employee_insurance) {
    $scope.error = '';
    $scope.employee_insurance = {};
    $scope.view(employee_insurance);
    site.showModal('#updateEmployee_InsuranceModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_insurances/update",
      data: $scope.employee_insurance
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateEmployee_InsuranceModal');
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

  $scope.remove = function (employee_insurance) {
    $scope.view(employee_insurance);
    $scope.employee_insurance = {};
    site.showModal('#deleteEmployee_InsuranceModal');
  };

  $scope.view = function (employee_insurance) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_insurances/view",
      data: { _id: employee_insurance._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_insurance = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (employee_insurance) {
    $scope.view(employee_insurance);
    $scope.employee_insurance = {};
    site.showModal('#viewEmployee_InsuranceModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_insurances/delete",
      data: { _id: $scope.employee_insurance._id, name: $scope.employee_insurance.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteEmployee_InsuranceModal');
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
  $scope.loadInsurances_slides();
  $scope.loadFacilites_Codes();
});
