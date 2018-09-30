app.controller("companies", function ($scope, $http) {

  $scope.company = {};
  $scope.search = {};

  $scope.addPhone = function () {
    if (!$scope.company.phones) {
      $scope.company.phones = [];
    }
    $scope.company.phones.push($scope.phone);
    $scope.phone = '';
  };

  $scope.deletePhone = function (phone) {
    if (!$scope.company.phones) {
      $scope.company.phones = [];
    }
    for (let i = 0; i < $scope.company.phones.length; i++) {
      if ($scope.company.phones[i] == phone) {
        $scope.company.phones.splice(i, 1);
      }
    }
  };

  $scope.addMobile = function () {
    if (!$scope.company.mobiles) {
      $scope.company.mobiles = [];
    }
    $scope.company.mobiles.push($scope.mobile);
    $scope.mobile = '';
  };

  $scope.deleteMobile = function (mobile) {
    if (!$scope.company.mobiles) {
      $scope.company.mobiles = [];
    }
    for (let i = 0; i < $scope.company.mobiles.length; i++) {
      if ($scope.company.mobiles[i] == mobile) {
        $scope.company.mobiles.splice(i, 1);
      }
    }
  };


  $scope.addHotline = function () {
    if (!$scope.company.hotlines) {
      $scope.company.hotlines = [];
    }
    $scope.company.hotlines.push($scope.hotline);
    $scope.hotline = '';
  };

  $scope.deleteHotline = function (hotline) {
    if (!$scope.company.hotlines) {
      $scope.company.hotlines = [];
    }
    for (let i = 0; i < $scope.company.hotlines.length; i++) {
      if ($scope.company.hotlines[i] == hotline) {
        $scope.company.hotlines.splice(i, 1);
      }
    }
  };



 

  $scope.uploadFile = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/company/upload/file', fd, {
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
        $scope.company.files.push({
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
    for (let i = 0; i < $scope.company.files.length; i++) {
      let f = $scope.company.files[i];
      if (f.url === file.url) {
        $scope.company.files.splice(i, 1);
        return;
      }
    }
  };

  $scope.loadCompanies = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies/all",
      data: {
        id: 1,
        name: 1
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

  $scope.loadGoves = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/goves/all",
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
          $scope.goves = response.data.list;
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
      url: "/api/companies/all",
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

  $scope.newCompany = function () {
    $scope.error = '';
    $scope.company = {
      image_url: '/images/company.png',
      files: [],
      mobiles: [],
      phones: [],
      hotlines: [],
      active: true
    };
    site.showModal('#addCompanyModal');
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
      url: "/api/companies/add",
      data: $scope.company
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addCompanyModal');
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

  $scope.edit = function (company) {
    $scope.error = '';
    $scope.view(company);
    $scope.company = {};
    site.showModal('#updateCompanyModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies/update",
      data: $scope.company
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateCompanyModal');
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

  $scope.remove = function (company) {
    $scope.view(company);
    $scope.company = {};
    site.showModal('#deleteCompanyModal');
  };

  $scope.view = function (company) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies/view",
      data: {
        id: company.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.company = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };
  $scope.details = function (company) {
    $scope.view(company);
    $scope.company = {};
    site.showModal('#viewCompanyModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/companies/delete",
      data: {
        id: $scope.company.id,
        name: $scope.company.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteCompanyModal');
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

    if ($scope.search.name) {
     
      where['name'] = $scope.search.name;
    }

    $scope.loadAll(where);
    
    site.hideModal('#SearchModal')

  };

  $scope.loadCompanies = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Companies/all",
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
          $scope.companies = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  

  $scope.loadAll();
  $scope.loadCompanies();
  $scope.loadGoves();

});