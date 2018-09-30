app.controller("amounts_in", function ($scope, $http) {

  $scope.amount_in = {};
  $scope.search = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/amounts_in/upload/image', fd, {
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
        $scope.amount_in.image_url = res.data.image_url;
      }
    }, function (error) {
      $scope.uploadStatus = error;
    });
  };

  $scope.addemployee = function () {

         
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
  
  $scope.addCom = function () {
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
  $scope.loadGoves = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/goves/all",
      data: {
        select: { id: 1, name: 1 }
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

  $scope.newCompany = function () {
    $scope.error = '';
    $scope.show_company.checked=false;
    $scope.company = { image_url: '/images/company.png', files: [], mobiles: [], phones: [], hotlines: [], active: false };
    site.showModal('#addCompanyModal');
  };
  $scope.add = function () {
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
          $scope.show_customer.checked=false;
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



  $scope.loadEngList = function () {

    
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data: {
        where: {},
        select: {
          id: 1,
          name: 1,
          mobiles: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.engList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
   

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

  $scope.addCustomer = function () {

    
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
  $scope.newCustomer = function (customer) {
    customer = customer || {};
    customer.image_url = customer.image_url || '/images/customer.png';
    customer.gov = $scope.goves[0];
    $scope.customer = customer;
    site.showModal('#addCustomerModal');
  };
  

  $scope.loadCustomers = function () {

    
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/customers/all",
      data: {
        where: {},
        select: {
          id: 1,
          name: 1,
          mobiles: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.customers = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
   

  };

  $scope.loadInOutNames = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/in_out_names/all",
      data: {where : {in : true}}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.namesList = response.data.list;
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
      url: "/api/amounts_in/all",
      data: {where : where}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list = response.data.list;
          
         site.hideModal('#amountsInSearchModal');
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };


  $scope.loadSafes = function () {
    $scope.list = {};
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/safes/all",
      data: {}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.safes = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };




  $scope.newAmount_In = function () {
    $scope.error = '';
    $scope.show_company=false;
    $scope.show_eng=false;
    $scope.show_customer=false;
    $scope.amount_in = { image_url: '/images/amount_in.png', date: new Date() , from_eng : false , from_company : false };
    site.showModal('#addAmount_InModal');
  };


  $scope.searchAll = function () {
    let where = {};
    
    
    if ($scope.search.date) {
      where['date'] = $scope.search.date;
    }

    if ($scope.search.dateFrom) {
      where['date_from'] = $scope.search.dateFrom;
    }

    if ($scope.search.dateTo) {
      where['date_to'] = $scope.search.dateTo;
    }

    if ($scope.search.company && $scope.search.company.id) {
      where['company.id'] = $scope.search.company.id;
    }

    if ($scope.search.source && $scope.search.source.id) {
      where['source.id'] = $scope.search.source.id;
    }

    if ($scope.search.customer && $scope.search.customer.id) {
      where['customer.id'] = $scope.search.customer.id;
    }

    if ($scope.search.eng && $scope.search.eng.id) {
      where['eng.id'] = $scope.search.eng.id;
    }

    if ($scope.search.safe && $scope.search.safe.id) {
      where['safe.id'] = $scope.search.safe.id;
    }
    if ($scope.search.value) {
      where['value'] = parseInt($scope.search.value);
    }

    if ($scope.search.description) {
      where['description'] = ($scope.search.description);
    }

    
    $scope.loadAll(where);
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
      url: "/api/amounts_in/add",
      data: $scope.amount_in
     
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addAmount_InModal');
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



  $scope.edit = function (amount_in) {
    $scope.error = '';
    $scope.view(amount_in);
    $scope.amount_in = {};
    site.showModal('#updateAmount_InModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/amounts_in/update",
      data: $scope.amount_in
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateAmount_InModal');
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

  $scope.remove = function (amount_in) {
    $scope.view(amount_in);
    $scope.amount_in = {};
    site.showModal('#deleteAmount_InModal');
  };

  $scope.view = function (amount_in) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/amounts_in/view",
      data: { _id: amount_in._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.amount_in = response.data.doc;
          $scope.amount_in.date = new Date($scope.amount_in.date);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (amount_in) {
    $scope.view(amount_in);
    $scope.amount_in = {};
    site.showModal('#viewAmount_InModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/amounts_in/delete",
      data: { _id: $scope.amount_in._id, name: $scope.amount_in.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteAmount_InModal');
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
  
   
  $scope.loadCustomers();
  $scope.loadCompanies();
  $scope.loadEngList();
  $scope.loadSafes();
  $scope.loadInOutNames();
  $scope.loadAll();
});
