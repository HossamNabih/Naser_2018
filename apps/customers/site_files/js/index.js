app.controller("customers", function ($scope, $http, $rootScope, $timeout) {


  $scope.customer = {};
  $scope.regions = [];
  $scope.goves = [];
  $scope.towns = [];
  $scope.cities = [];

  $scope.addPhone = function () {
    if (!$scope.customer.phones) {
      $scope.customer.phones = [];
    }
    $scope.customer.phones.push($scope.phone);
    $scope.phone = '';
  };

  $scope.deletePhone = function (phone) {
    if (!$scope.customer.phones) {
      $scope.customer.phones = [];
    }
    for (let i = 0; i < $scope.customer.phones.length; i++) {
      if ($scope.customer.phones[i] == phone) {
        $scope.customer.phones.splice(i, 1);
      }
    }
  };

  $scope.addMobile = function () {
    if (!$scope.customer.mobiles) {
      $scope.customer.mobiles = [];
    }
    $scope.customer.mobiles.push($scope.mobile);
    $scope.mobile = '';
  };

  $scope.deleteMobile = function (mobile) {
    if (!$scope.customer.mobiles) {
      $scope.customer.mobiles = [];
    }
    for (let i = 0; i < $scope.customer.mobiles.length; i++) {
      if ($scope.customer.mobiles[i] == mobile) {
        $scope.customer.mobiles.splice(i, 1);
      }
    }
  };

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/customers/upload/image', fd, {
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
        $scope.customer.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
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


  $scope.loadCities = function (gov) {
    if ($scope.townBusy == true) {
      return;
    }
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
        select: {
          id: 1,
          name: 1
        }
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
    if ($scope.townBusy == true) {
      return;
    }
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
        select: {},
        limit : 10000
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

  $scope.loadRegions = function () {
    if ($scope.townBusy == true) {
      return;
    }

    var where = {};


    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/regions/all",
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
          $scope.regions = response.data.list;
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
      url: "/api/customers/all",
      data: {where : where}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
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

    if ($scope.search.gov) {
      where['gov'] = $scope.search.gov;
    }
   
    if ($scope.search.city) {
      where['city'] = $scope.search.city;
    }
   
    if ($scope.search.name) {
      where['name'] = $scope.search.name;
    }
    
    if ($scope.search.email) {
      where['email'] = $scope.search.email;
    }

    if ($scope.search.phones) {
      where['phones'] = $scope.search.phones;
    }

    if ($scope.search.mobiles) {
      where['mobiles'] = $scope.search.mobiles;
    }

    if ($scope.search.address) {
      where['address'] = $scope.search.address;
    }

    if ($scope.search.notes) {
      where['notes'] = $scope.search.notes;
    }

    if ($scope.search.black_list==true) {
      where['black_list'] = $scope.search.black_list;
    }
    
    $scope.loadAll(where);
    
  };

  $scope.newCustomer = function (customer) {
    customer = customer || {};
    customer.image_url = customer.image_url || '/images/customer.png';
    $scope.customer = customer;
    site.showModal('#addCustomerModal');
  };

  $scope.editCustomer = function (customer) {

    let cu = customer || {};
    delete cu.$$hashKey;
    delete cu.gov.$$hashKey;
    delete cu.city.$$hashKey;
    delete cu.town.$$hashKey;
    delete cu.region.$$hashKey;

    if (cu.gov && cu.gov.id && $scope.goves.filter(g => g.id === cu.gov.id).length === 0) {
      $scope.goves.push(cu.gov);
    }

    if (cu.city && cu.city.id && $scope.cities.filter(c => c.id === cu.city.id).length === 0) {
      $scope.cities.push(cu.city);
    }

    if (cu.town && cu.town.id && $scope.towns.filter(t => t.id === cu.town.id).length === 0) {
      $scope.towns.push(cu.town);
    }

    if (cu.region && cu.region.id && $scope.regions.filter(g => g.id === cu.region.id).length === 0) {
      $scope.regions.push(cu.region);
    }

    cu.image_url = cu.image_url || '/images/customer.png';
  
    $timeout(() => {
      $scope.customer = cu;
    }, 250);

    site.showModal('#updateCustomerModal');
  };

  $scope.add = function () {

    $scope.error = '';
    let v = site.validated();

    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;

    $http({
      method: "POST",
      url: "/api/customers/add",
      data: $scope.customer
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addCustomerModal');
          $rootScope.$emit("newCustomerDone", {
            doc: response.data.doc
          });
          if ($scope.parent === undefined) {
            $scope.loadAll();
          }
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.edit = function (customer) {
    $scope.view(customer);
    $scope.customer = {};
    site.showModal('#updateCustomerModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/customers/update",
      data: $scope.customer
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateCustomerModal');
          $rootScope.$emit("editCustomerDone", {
            doc: $scope.customer
          });
          if ($scope.parent === undefined) {
            $scope.loadAll();
          }
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.remove = function (customer) {
    $scope.view(customer);
    $scope.customer = {};
    site.showModal('#deleteCustomerModal');
  };

  $scope.view = function (customer) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/customers/view",
      data: {
        _id: customer._id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.customer = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };
  $scope.details = function (customer) {
    $scope.view(customer);
    $scope.customer = {};
    site.showModal('#viewCustomerModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/customers/delete",
      data: {
        _id: $scope.customer._id,
        name: $scope.customer.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteCustomerModal');
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

  $scope.townBusy = false;
  $scope.townChanged = function () {
    $scope.townBusy = true;
    if ($scope.customer.town) {
      if ($scope.customer.gov === undefined) {
        $scope.customer.gov = $scope.customer.town.gov;
      }
      if ($scope.customer.city === undefined) {
        $scope.customer.city = $scope.customer.town.city;
      }
      if ($scope.customer.region === undefined) {
        $scope.customer.region = $scope.customer.town.region;
      }

      $timeout(() => {
        $scope.customer.gov.id = $scope.customer.town.gov.id;
        $scope.customer.city.id = $scope.customer.town.city.id;
        $scope.customer.region.id = $scope.customer.town.region.id;
      }, 250);
    }

    $timeout(() => {
      $scope.townBusy = false
    }, 500);
  };


  $rootScope.$on("loadAllCustomers", function (ev, args) {
    $scope.loadAll();
    $scope.loadGoves();
    $scope.loadCities();
    $scope.loadTowns();
    $scope.loadRegions();
  });


  $rootScope.$on("loadAllAddress", function (ev, args) {
    $scope.loadGoves();
    $scope.loadCities();
    $scope.loadTowns();
    $scope.loadRegions();
  });

  $rootScope.$on("newCustomer", function (ev, customer) {
    $scope.newCustomer(customer);
  });

  $rootScope.$on("editCustomer", function (ev, customer) {
    $scope.editCustomer(customer);
  });

});