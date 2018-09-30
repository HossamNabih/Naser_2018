app.controller("safes_payments", function ($scope, $http) {

  $scope.safe= {};


  $scope.loadEmployees = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data: {
        select : {id:1 , name : 1}
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

  $scope.sourceList = [
    {name: "new safe added" },
    {name: "stores_in" },
    {name: "stores_out" },
    {name: "amount_in" },
    {name: "amount_out" },
    {name: "employee_offer" },
    {name: "employee_discont" },


  ]  
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
        if (response.data.done) {
          $scope.safes = response.data.list;
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
      url: "/api/safes_payments/all",
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

                      


  $scope.loadAll = function (where) {
    $scope.list = {};
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/safes_payments/all",
      data: {
        where : where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          
          $scope.list = response.data.list;
          console.log( $scope.list)
          site.hideModal('#safes_paymentsSearchModal'); 
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

    
    if ($scope.search.date) {
      where['date'] = $scope.search.date;
    }

    if ($scope.search.safe && $scope.search.safe.id) {
      where['safe.id'] = $scope.search.safe.id;
    }


    if ($scope.search.value) {
      where['value'] = site.toNumber($scope.search.value);
    }

    if ($scope.search.source) {
      where['source'] = $scope.search.source.name;
    }
    
    $scope.loadAll(where);
    
  };



 
  

  $scope.loadAll();
  // $scope.loadEmployees();
  $scope.loadSafes();

 
});
