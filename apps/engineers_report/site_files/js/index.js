app.controller("engineers_report", function ($scope, $http) {

  $scope.search = {
    date1: new Date(),
    date2: new Date(),
    employee: {}
  };

  $scope.showSearch = function () {
    site.showModal('#searchModal');
  };

  $scope.searchAll = function () {





    $scope.employee = $scope.search.employee;
    $scope.getTicketList($scope.search.employee);
    $scope.getAssignTicketList($scope.search.employee);
    $scope.getEmployeeOfferList($scope.search.employee);
    $scope.getEmployeeDiscountList($scope.search.employee);
    site.hideModal('#searchModal');
  };

  $scope.clearAll = function () {
    $scope.search = {
      date1: new Date(),
      date2: new Date(),
      employee: {}
    }
  };

  $scope.getEmployeeList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employees/all",
      data: {
        select: {
          id: 1,
          name: 1,
          degree: 1,
          department: 1,
          extra_salary: 1,
          extra_ticket: 1,
          job: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.employeeList = response.data.list;
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



    $scope.TicketSlideList.forEach(s => {
      if (s.to >= $scope.total_tickets && s.from <= $scope.total_tickets) {
        s.value2 = parseFloat(s.value) + parseFloat($scope.employee.extra_ticket);
        $scope.ticketSlide = s;
        $scope.total_salary = parseFloat($scope.total_tickets) * s.value2;
        if (s.salary_calculate) {
          $scope.total_salary = $scope.total_salary + parseFloat($scope.employee.degree.salary) + parseFloat($scope.employee.extra_salary);
        }

        $scope.total_salary = $scope.total_salary + $scope.total_offers;
        $scope.total_salary = $scope.total_salary - $scope.total_discounts;

      }
    })
  }

  $scope.getTicketList = function (emp) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'eng.id': emp.id,
          date_type: {
            id: 4
          },
          done: true,
          from_date: $scope.search.date1,
          to_date: $scope.search.date2
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

  $scope.getAssignTicketList = function (emp) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/all",
      data: {
        where: {
          'eng.id': emp.id,
          date_type: {
            id: 5
          },
          from_date: $scope.search.date1,
          to_date: $scope.search.date2
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
          'eng.id': emp.id,
          from_date: $scope.search.date1,
          to_date: $scope.search.date2
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


  $scope.getEmployeeDiscountList = function (emp) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/employee_discount/all",
      data: {
        where: {
          'eng.id': emp.id,
          from_date: $scope.search.date1,
          to_date: $scope.search.date2
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

});