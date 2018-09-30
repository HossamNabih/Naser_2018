app.controller("employee_offer", function ($scope, $http) {

  $scope.employee_offer = {};
  $scope.search = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/employee_offer/upload/image', fd, {
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
        $scope.employee_offer.image_url = res.data.image_url;
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
      url: "/api/employee_offer/all",
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




  $scope.newemployee_offer = function () {
    $scope.error = '';
    $scope.employee_offer = { image_url: '/images/offer.png', date: new Date() , from_eng : false , from_company : false };
    site.showModal('#addemployee_offerModal');
  };


  $scope.searchAll = function () {
    let where = {};

    
    if ($scope.search.date) {
      where['date'] = $scope.search.date;
    }

    if ($scope.search.dateFrom) {
      where['from_date'] = $scope.search.dateFrom;
    }

    if ($scope.search.dateTo) {
      where['to_date'] = $scope.search.dateTo;
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
      url: "/api/employee_offer/add",
      data: $scope.employee_offer
     
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addemployee_offerModal');
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



  $scope.edit = function (employee_offer) {
    $scope.error = '';
    $scope.view(employee_offer);
    $scope.employee_offer = {};
    site.showModal('#updateemployee_offerModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employee_offer/update",
      data: $scope.employee_offer
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateemployee_offerModal');
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

  $scope.remove = function (employee_offer) {
    $scope.view(employee_offer);
    $scope.employee_offer = {};
    site.showModal('#deleteemployee_offerModal');
  };

  $scope.view = function (employee_offer) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employee_offer/view",
      data: { _id: employee_offer._id }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employee_offer = response.data.doc;
          $scope.employee_offer.date = new Date($scope.employee_offer.date);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
      )
  };
  $scope.details = function (employee_offer) {
    $scope.view(employee_offer);
    $scope.employee_offer = {};
    site.showModal('#viewemployee_offerModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employee_offer/delete",
      data: { _id: $scope.employee_offer._id, name: $scope.employee_offer.name }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteemployee_offerModal');
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
