app.controller("amounts_report", function ($scope, $http) {

  $scope.showSearch = function(){
    site.showModal('#searchModal');
  };

  $scope.searchAll = function(){
    $scope.loadAmountsInList($scope.search);
    $scope.loadAmountsOutList($scope.search);
    
  };

  

  
  $scope.propertyName1 = 'date';
  $scope.reverse1 = true;

  $scope.propertyName2 = 'date';
  $scope.reverse2 = true;

  $scope.sortBy1 = function(propertyName) {
    $scope.reverse1 = ($scope.propertyName1 === propertyName) ? !$scope.reverse1 : false;
    $scope.propertyName1 = propertyName;
  };

  $scope.sortBy2 = function(propertyName) {
    $scope.reverse2 = ($scope.propertyName2 === propertyName) ? !$scope.reverse2 : false;
    $scope.propertyName2 = propertyName;
  };

  $scope.loadCompanies = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/Companies/all",
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

  $scope.loadInOutNames = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/in_out_names/all",
      data: 
      {
       
        
      }
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

  $scope.loadAmountsInList = function (search) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/amounts_in/all",
      data: {where : {search : search}}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.total_in = 0;
          response.data.list.forEach(v => {
            $scope.total_in +=  parseFloat(v.value);
          });
          $scope.amountsInList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
      
      
  };

  
   
  $scope.loadAmountsOutList = function (search) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/amounts_out/all",
      data: {where : {search : search}}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.total_out = 0;
          response.data.list.forEach(v => {
            $scope.total_out += parseFloat(v.value);
          });
          $scope.amountsOutList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
      )
  };

  $scope.loadCustomers();
  $scope.loadEngList ();
  $scope.loadCompanies();
$scope.loadInOutNames();
  $scope.loadAmountsInList();
  $scope.loadAmountsOutList();
});
