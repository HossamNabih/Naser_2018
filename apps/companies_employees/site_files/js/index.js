app.controller("companies_employees", function ($scope, $http) {

  $scope.company_employee = {};
  $scope.id = 1;

  $scope.addPhone = function () {
    if (!$scope.company_employee.phones) {
      $scope.company_employee.phones = [];
    }
    $scope.company_employee.phones.push($scope.phone);
    $scope.phone = '';
  };

  $scope.deletePhone = function (phone) {
    if (!$scope.company_employee.phones) {
      $scope.company_employee.phones = [];
    }
    for (let i = 0; i < $scope.company_employee.phones.length; i++) {
      if ($scope.company_employee.phones[i] == phone) {
        $scope.company_employee.phones.splice(i, 1);
      }
    }
  };

  $scope.addMobile = function () {
    if (!$scope.company_employee.mobiles) {
      $scope.company_employee.mobiles = [];
    }
    $scope.company_employee.mobiles.push($scope.mobile);
    $scope.mobile = '';
  };

  $scope.deleteMobile = function (mobile) {
    if (!$scope.company_employee.mobiles) {
      $scope.company_employee.mobiles = [];
    }
    for (let i = 0; i < $scope.company_employee.mobiles.length; i++) {
      if ($scope.company_employee.mobiles[i] == mobile) {
        $scope.company_employee.mobiles.splice(i, 1);
      }
    }
  };

  $scope.loadCompanies = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies/all",
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
          $scope.companies = response.data.list;
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
        select: {
          id: 1,
          name: 1
        }
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

  $scope.loadJobs = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/jobs/all",
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
      url: "/api/companies_employees/all",
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

  $scope.newCompany_Employee = function () {
    $scope.error = '';
    $scope.company_employee = {
      image_url: '/images/company_employee.png'
    };
    site.showModal('#addCompany_EmployeeModal');
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
      url: "/api/companies_employees/add",
      data: $scope.company_employee
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addCompany_EmployeeModal');
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

  $scope.edit = function (company_employee) {
    $scope.error = '';
    $scope.view(company_employee);
    $scope.company_employee = {};
    site.showModal('#updateCompany_EmployeeModal');
  };

  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_employees/update",
      data: $scope.company_employee
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateCompany_EmployeeModal');
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

  $scope.remove = function (company_employee) {
    $scope.view(company_employee);
    $scope.company_employee = {};
    site.showModal('#deleteCompany_EmployeeModal');
  };

  $scope.view = function (company_employee) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_employees/view",
      data: {
        id: company_employee.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.company_employee = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.details = function (company_employee) {
    $scope.view(company_employee);
    $scope.company_employee = {};
    site.showModal('#viewCompany_EmployeeModal');
  };

  $scope.delete = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_employees/delete",
      data: {
        id: $scope.company_employee.id,
        name: $scope.company_employee.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteCompany_EmployeeModal');
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

  $scope.loadCompanies_employees = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Companies_employees/all",
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
          $scope.companies_employees = response.data.list;
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
  $scope.loadCompanies();
  $scope.loadCompanies_employees();
  $scope.loadDepartments();
  $scope.loadJobs();
});