app.controller("employees", function ($scope, $http) {

  $scope.id = 1;
  $scope.employee = {};

  $scope.addPhone = function () {
    if (!$scope.employee.phones) {
      $scope.employee.phones = [];
    }
    $scope.employee.phones.push($scope.phone);
    $scope.phone = '';
  };

  $scope.deletePhone = function (phone) {
    if (!$scope.employee.phones) {
      $scope.employee.phones = [];
    }
    for (let i = 0; i < $scope.employee.phones.length; i++) {
      if ($scope.employee.phones[i] == phone) {
        $scope.employee.phones.splice(i, 1);
      }
    }
  };

  
  $scope.addMobile = function () {
    if (!$scope.employee.mobiles) {
      $scope.employee.mobiles = [];
    }
    $scope.employee.mobiles.push($scope.mobile);
    $scope.mobile = '';
  };

  $scope.deleteMobile = function (mobile) {
    if (!$scope.employee.mobiles) {
      $scope.employee.mobiles = [];
    }
    for (let i = 0; i < $scope.employee.mobiles.length; i++) {
      if ($scope.employee.mobiles[i] == mobile) {
        $scope.employee.mobiles.splice(i, 1);
      }
    }
  };

    /* upload files */

    $scope.uploadFile = function (files) {
      var fd = new FormData();
      fd.append("fileToUpload", files[0]);
      $http.post('/api/employee/upload/file', fd, {
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
          $scope.employee.files.push({
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
      for (let i = 0; i < $scope.employee.files.length; i++) {
        let f = $scope.employee.files[i];
        if (f.url === file.url) {
          $scope.employee.files.splice(i, 1);
          return;
        }
      }
    };

  $scope.loadRoles = function () {
    $http({
      method: "POST",
      url: "/api/security/roles",
      data: {}
    }).then(
      function (response) {
        if(response.data.done){
          $scope.roles = response.data.roles;
        }
        
      },
      function (err) {
        $scope.error = err;
      })
  };

  $scope.loadGoves = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/goves/all",
      data: {
        select : {id:1 , name : 1}
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


  $scope.loadCities = function (gov) {

    var where = {};

    if (typeof gov === 'string') {
      gov = JSON.parse(gov);
    } else {
      gov = gov || {};
    }
    if (gov && gov.id) {
      where = {
        'gov.id': gov.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/cities/all",
      data: {
        where: where,
        select : {id:1 , name : 1}
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


  $scope.loadTowns = function (city) {

    var where = {};

    if (typeof city === 'string') {
      city = JSON.parse(city);
    } else {
      city = city || {};
    }
    if (city && city.id) {
      where = {
        'city.id': city.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/towns/all",
      data: {
        where: where,
        select : {id:1 , name : 1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.towns = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadRegions = function (town) {

    var where = {};

    if (typeof town === 'string') {
      town = JSON.parse(town);
    } else {
      town = town || {};
    }
    if (town && town.id) {
      where = {
        'town.id': town.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/regions/all",
      data: {
        where: where,
        select : {id:1 , name : 1}
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

  $scope.loadMaritals_status = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/maritals_status/all",
      data: {
        select : {id:1 , name : 1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.maritals_status = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadMilitaries_Status = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/militaries_status/all",
      data: {
        select : {id:1 , name : 1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.militaries_status = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadDepartments = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/departments/all",
      data: {
        select : {id:1 , name : 1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.departments = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadEmployees_Degrees = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees_degrees/all",
      data: {
        select : {id:1 , name : 1,salary:1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employees_degrees = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadJobs = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/jobs/all",
      data: {
        select : {id:1 , name : 1,salary:1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.jobs = response.data.list;
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
      url: "/api/employees/all",
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

  $scope.newEmployee = function () {
    $scope.error = '';
    $scope.employee = {
      image_url: '/images/employee.png',
      mobiles: [],
      phones: [],
      birth_date: new Date(),
      contract_date: new Date()
    };
    site.showModal('#addEmployeeModal');
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
      url: "/api/employees/add",
      data: $scope.employee
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addEmployeeModal');
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

  $scope.edit = function (employee) {
    $scope.error = '';
    $scope.view(employee);
    $scope.employee = {};
    site.showModal('#updateEmployeeModal');
  };

  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/update",
      data: $scope.employee
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateEmployeeModal');
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

  $scope.remove = function (employee) {
    $scope.view(employee);
    $scope.employee = {};
    site.showModal('#deleteEmployeeModal');
  };

  $scope.view = function (employee) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/view",
      data: {
        id: employee.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee = response.data.doc;
          $scope.employee.birth_date = new Date($scope.employee.birth_date);
          $scope.employee.contract_date = new Date($scope.employee.contract_date);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.details = function (employee) {
    $scope.view(employee);
    $scope.employee = {};
    site.showModal('#viewEmployeeModal');
  };

  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/delete",
      data: {
        id: $scope.employee.id,
        name: $scope.employee.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteEmployeeModal');
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
    
    if ($scope.search && $scope.search.name) {
      where['name'] = $scope.search.name;
    }

    $scope.loadAll(where);

    site.hideModal('#SearchModal')
  };

  $scope.loadEmployees = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Employees/all",
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
          $scope.employees = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadAll();
  $scope.loadRoles();
  $scope.loadGoves();
  $scope.loadCities();
  $scope.loadTowns();
  $scope.loadRegions();
  $scope.loadEmployees_Degrees();
  $scope.loadDepartments();
  $scope.loadMaritals_status();
  $scope.loadMilitaries_Status();
  $scope.loadJobs();
  $scope.loadEmployees();

});