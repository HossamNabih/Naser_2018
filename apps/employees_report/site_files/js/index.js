app.controller("employees_report", function ($scope, $http) {

  $scope.search = {
    employee: {}
  };

  $scope.showSearch = function () {
    site.showModal('#searchModal');
  };

  $scope.searchAll = function () {

    if( $scope.search.employee && $scope.userList &&  $scope.userList.length > 0){
      $scope.userList.forEach(user => {
        if(user.employee_id == $scope.search.employee.id){
          $scope.user_id = user.id;
        }
      });
    }else{
      return;
    }

   

    $scope.employee = $scope.search.employee;
    $scope.getAddedTicketList();
    $scope.getAssignTicketList();
    $scope.getEmployeeOfferList();
    $scope.getclose1TicketList();
    $scope.getBackEngTicketList();
    $scope.getClose2TicketList();
    $scope.getReviewTicketList();
    $scope.getEmployeeDiscountList();
    site.hideModal('#searchModal');
  };

  $scope.clearAll = function () {
    $scope.search = {
    
      employee: {}
    }
  };

  $scope.getEmployeeList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all"
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employeeList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.calc = function () {

    $scope.total_offers = 0;
    $scope.total_discounts = 0;

    if ($scope.employeeOfferList) {
      $scope.employeeOfferList.forEach(offer => {
        $scope.total_offers = $scope.total_offers + offer.value;
      });
    }

    if ($scope.employeeDiscountList) {
      $scope.employeeDiscountList.forEach(discount => {
        $scope.total_discounts = $scope.total_discounts + discount.value;
      });
    }
    if($scope.employee){

      $scope.total_salary0=parseFloat($scope.employee.degree.salary ) + ( parseFloat($scope.employee.extra_salary || 0) || 0);
    }

   $scope.total_salary1= $scope.total_offers-$scope.total_discounts;

   if ($scope.total_salary0 > 0)
    {
    $scope.total_salary = $scope.total_salary1+$scope.total_salary0;
   }
   else
   {
    $scope.total_salary=0;
   }

  }

  $scope.loadUsers = function () {
    if ($scope.userList) {
      return
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/users/all",
      data: {
        select: {
          id : 1,
          employee_id: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.userList = response.data.users;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )

  };

  $scope.getAddedTicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'add_user_info.id': $scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.total_tickets = response.data.list.length;
          $scope.ticketList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getAssignTicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'assign_user_info.id':$scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
          }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.assginTicketList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getclose1TicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'close_eng_user_info.id':$scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
          }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.close1TicketList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getBackEngTicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'back_to_eng_user_info.id':$scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
          }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.BackEngTicketList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getClose2TicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'close2_user_info.id':$scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
          }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.Close2TicketList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getReviewTicketList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'review_user_info.id':$scope.user_id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
          }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.ReviewTicketList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getTicketSlideList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets_slides/all",
      data: {}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.TicketSlideList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.getEmployeeOfferList = function (emp) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employee_offer/all",
      data: {
        where: {
          'eng.id':$scope.search.employee.id,
          from_date: $scope.search.dateFrom,
          to_date: $scope.search.dateTo
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employeeOfferList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.getEmployeeDiscountList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employee_discount/all",
      data: {
        where: {
             'eng.id':$scope.search.employee.id ,
             from_date: $scope.search.dateFrom,
             to_date: $scope.search.dateTo
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employeeDiscountList = response.data.list;
          $scope.calc();
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.propertyName = 'date';
  $scope.reverse = true;


  $scope.sortBy = function (propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };


  $scope.getEmployeeList();
  $scope.getTicketSlideList();
  $scope.loadUsers();
});