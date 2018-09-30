app.controller("companies_devices", function ($scope, $http, $timeout) {

  $scope.company_device = {};
  $scope.modelEditorAdd = true;
  $scope.modelEditorUpdate = false;

  $scope.addModel = function () {
    if (!$scope.company_device.models) {
      $scope.company_device.models = [];
    }
    $scope.company_device.models.push($scope.model);
    $scope.model = {};
  };

  $scope.deleteModel = function (model) {
    if (!$scope.company_device.models) {
      $scope.company_device.models = [];
    }
    for (let i = 0; i < $scope.company_device.models.length; i++) {
      if ($scope.company_device.models[i].name == model.name) {
        $scope.company_device.models.splice(i, 1);
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

  $scope.loadCategories = function (company) {

    var where = {};

    if (typeof company === 'string') {
      company = JSON.parse(company);
    } else {
      company = company || {};
    }
    if (company && company.id) {
      where = {
        'company.id': company.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_categories/all",
      data: {
        where: where,
        select: {
          id: 1,
          'company.id': 1,
          'company.name': 1,
          'category.id': 1,
          'category.name': 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.companies_categories = response.data.list;
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


  $scope.loadDevices_Names = function (sub_category) {

    var where = {};

    if (typeof sub_category === 'string') {
      sub_category = JSON.parse(sub_category);
    } else {
      sub_category = sub_category || {};
    }
    if (sub_category && sub_category.id) {
      where = {
        'sub_category.id': sub_category.id
      };
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/devices_names/all",
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
          $scope.devices_names = response.data.list;
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
      url: "/api/companies_devices/all",
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

  $scope.newCompany_Device = function () {
    $scope.error = '';
    $scope.company_device = {
      image_url: '/images/company_device.png',
      models: []
    };
    site.showModal('#addCompany_DeviceModal');
  };

  $scope.add = function () {


    $scope.error = '';
    const v = site.validated();
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    if ($scope.company_device.models.length === 0) {
      $scope.error = ' ##word.companies_devices_models_errors## ';
      return;
    }


    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_devices/add",
      data: $scope.company_device
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addCompany_DeviceModal');
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

  $scope.edit = function (company_device) {
    $scope.modelEditorUpdate = false;
    $scope.error = '';
    $scope.view(company_device);
    $scope.company_device = {};
    site.showModal('#updateCompany_DeviceModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_devices/update",
      data: $scope.company_device
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateCompany_DeviceModal');
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

  $scope.remove = function (company_device) {
    $scope.view(company_device);
    $scope.company_device = {};
    site.showModal('#deleteCompany_DeviceModal');
  };

  $scope.view = function (company_device) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_devices/view",
      data: {
        id: company_device.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.company_device = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.details = function (company_device) {
    $scope.view(company_device);
    $scope.company_device = {};
    site.showModal('#viewCompany_DeviceModal');
  };

  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies_devices/delete",
      data: {
        id: $scope.company_device.id,
        name: $scope.company_device.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteCompany_DeviceModal');
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

    if ($scope.search && $scope.search.company) {
      where['company.id'] = $scope.search.company.id;
    }

    if ($scope.search && $scope.search.category) {
      where['category.id'] = $scope.search.category.id;
    }
    if ($scope.search && $scope.search.sub_category) {
      where['sub_category.id'] = $scope.search.sub_category.id;
    }
    if ($scope.search && $scope.search.device) {
      where['device.id'] = $scope.search.device.id;
    }

    $scope.loadAll(where);
    site.hideModal('#SearchModal')

  };

  $scope.loadAll();
  $scope.loadCompanies();
  $scope.loadCategories();
  $scope.loadSub_Categories();
  $scope.loadDevices_Names();
});