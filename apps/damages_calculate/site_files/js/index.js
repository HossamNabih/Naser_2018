app.controller("damages_calculate", function ($scope, $http) {

  $scope.damage_calculate = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/damages_calculate/upload/image', fd, {
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
        $scope.damage_calculate.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };


  $scope.loadCompanies = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies/all",
      data: {
        select: { id: 1, name: 1 }
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
        select: { id: 1, name: 1, 'company._id': 1, 'company.name': 1, 'category._id': 1, 'category.name': 1 }
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
        select: { id: 1, name: 1 }
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


  $scope.loadDamages = function (sub_category) {
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
      url: "/api/damages/all",
      data: {
        where: where,
        select: { id: 1, name: 1 }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.damages = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };


  $scope.loadDevices = function (sub_category) {
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
      url: "/api/companies_devices/all",
      data: {
        where: where,
        select: {}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.companies_devices = response.data.list;
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
      url: "/api/damages_calculate/all",
      data: {
        select: {}
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

  $scope.newDamage_Calculate = function () {
    $scope.error = '';
    $scope.damage_calculate = { image_url: '/images/damage_calculate.png', ticket_count: 1 };
    site.showModal('#addDamage_CalculateModal');
  };
  $scope.add = function () {

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/damages_calculate/add",
      data: $scope.damage_calculate
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addDamage_CalculateModal');
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

  $scope.edit = function (damage_calculate) {
    $scope.error = '';
    $scope.view(damage_calculate);
    $scope.damage_calculate = {};
    site.showModal('#updateDamage_CalculateModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/damages_calculate/update",
      data: $scope.damage_calculate
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateDamage_CalculateModal');
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

  $scope.remove = function (damage_calculate) {
    $scope.view(damage_calculate);
    $scope.damage_calculate = {};
    site.showModal('#deleteDamage_CalculateModal');
  };

  $scope.view = function (damage_calculate) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/damages_calculate/view",
      data: { _id: damage_calculate._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.damage_calculate = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (damage_calculate) {
    $scope.view(damage_calculate);
    $scope.damage_calculate = {};
    site.showModal('#viewDamage_CalculateModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/damages_calculate/delete",
      data: { _id: $scope.damage_calculate._id, name: $scope.damage_calculate.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteDamage_CalculateModal');
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
  $scope.loadCompanies();
  $scope.loadCategories();
  $scope.loadSub_Categories();
  $scope.loadDamages();
  $scope.loadDevices();
});
