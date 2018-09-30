app.controller("tickets", function ($scope, $http, $rootScope, $timeout) {

  $scope.ticket = {};
  $scope.engList = [];
  $scope.company_list = [];
  $scope.category_list = [];
  $scope.sub_category_list = [];
  $scope.device_list = [];
  $scope.model_list = [];
  $scope.models = [];
  $scope.damages = [];

  $scope.eng = {};

$scope.print_status=[
  {name:"##word.ticket_print_status0##" , value:"0" },
  {name:"##word.ticket_print_status1##" , value:"1" },
  {name:"##word.ticket_print_status-1##" , value:"-1" },
]


  /*##tickets/load.js*/
  /*##tickets/customer.js*/
  /*##tickets/close_eng.js*/
  /*##tickets/close_eng_input_and_items.js*/
  /*##tickets/close1.js*/
  /*##tickets/close2.js*/
  /*##tickets/notes.js*/
  /*##tickets/input_and_items.js*/



  $scope.hideModal = function (name) {
    hideModal(name);
  };



  $scope.updateOneTicket = function (ticket) {
   

    if(!ticket){
      return
    }
  
    $http({
      method: "POST",
      url: "/api/tickets/view",
      data: {
        id: ticket.id
      }
    }).then(
      function (response) {

        if (response.data.done) {

          let t = response.data.doc;
         
          t.device_info = t.device_info || {};

          if (t.device_info.category) {
            $scope.category_list = [t.device_info.category];
          }
          if (t.device_info.sub_category) {
            $scope.sub_category_list = [t.device_info.sub_category];
          }
          if (t.device_info.device) {
            $scope.device_list = [t.device_info.device];
          }
          if (t.device_info.model) {
            $scope.models = [t.device_info.model];
          }
          if (t.damage) {
            $scope.damages.push(t.damage);
          }

          t.date = new Date(t.date);
          t.visit_date = new Date(t.visit_date);
          t.close_eng = t.close_eng || {}
          t.close_eng.device_info = t.close_eng.device_info || {}

          if (t.eng_list && t.eng_list.length > 0) {
           
          }

          $scope.list.forEach((t1 , i) => {
            if(t1.id == t.id){
             $scope.list[i] = t;
            }
          });
          
        } else {
          $scope.error = response.data.error;
        }
      })
  };

  $scope.addToCompanyCodes = function () {
    $scope.ticket.company_codes = $scope.ticket.company_codes || [];
    $scope.ticket.company_codes.push($scope.companyCode);
    $scope.companyCode = '';
  };

  $scope.getSourceId = function () {
    if ($scope.ticket.source) {
      if (typeof $scope.ticket.source === 'object') {
        return $scope.ticket.source.id;
      }
      var s = JSON.parse($scope.ticket.source);
      return s.id;
    }
    return 0;
  };


  $scope.showReview = function (t) {
    $scope.error = '';
    t = site.fromJson(t);
    $scope.view(t);
    $scope.ticket = {};
    site.showModal('#ReviewModal');
  };


  $scope.loadUserList = function () {


    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/users/all",
      data: {
        where: {},
        select: {
          id: 1,
          profile: 1
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

  $scope.monitorCustomerConfirm = function (t) {
    $http({
      method: "POST",
      url: "/api/notifications/add",
      data: {
        icon: '/images/ticket.png',
        source: 'Tickets System',
        source_ar: 'نظام البلاغات',
        message: 'user Approved Black List Customer',
        message_ar: 'تمت الموافقة على بلاغ لعميل محظور',
        value: t.customer.name,
        value_ar: t.customer.name
      }
    });
  };

  $scope.monitorTicketOpenConfirm = function (t) {
    t.device_info = t.device_info || {}
    t.device_info.company = t.device_info.company || {}
    t.device_info.category = t.device_info.category || {}
    t.device_info.sub_category = t.device_info.sub_category || {}
    t.device_info.device = t.device_info.device || {}
    $http({
      method: "POST",
      url: "/api/notifications/add",
      data: {
        icon: '/images/ticket.png',
        source: 'Tickets System',
        source_ar: 'نظام البلاغات',
        message: 'user Approved Device Has Open Ticket',
        message_ar: 'تمت الموافقة على بلاغ لجهاز له بلاغ سابق مفتوح',
        value: t.device_info.company.name + ' ' + t.device_info.category.name + ' ' + t.device_info.sub_category.name + ' ' + t.device_info.device.name,
        value_ar: t.device_info.company.name + ' ' + t.device_info.category.name + ' ' + t.device_info.sub_category.name + ' ' + t.device_info.device.name
      }
    });
  };


  $scope.setDevice = function (d) {

    d = site.fromJson(d);
    $scope.onChangeStatus = false;

    $scope.company_list = [d.company];
    $scope.category_list = [d.category];
    $scope.sub_category_list = [d.sub_category];
    $scope.device_list = [d.device];
    $scope.models = [d.model];
    $scope.loadDamages(d.sub_category);

    $timeout(function () {
      $scope.ticket.device_info.company = d.company;
      $scope.ticket.device_info.category = d.category;
      $scope.ticket.device_info.sub_category = d.sub_category;
      $scope.ticket.device_info.device = d.device;
      $scope.ticket.device_info.model = d.model;
      $timeout(function () {
        $scope.onChangeStatus = true;
      }, 500);
    }, 100);


  };


  $scope.showRepeats = function (t) {
    site.showModal('#ticketsHistoryModal');
    $scope.list2 = t.repeats;
  };

 

  $scope.deviceHistory = function (d) {

    site.showModal('#ticketsHistoryModal');
    let where = {};
    where['customer.id'] = $scope.ticket.customer.id;
    where['device_info.device.id'] = d.device.id;
    $scope.loadAll(where, 2);
  };

  $scope.newTicket = function (t) {
    $scope.error = '';
    $scope.ticket_open_confirm = false;
    $scope.customer_confirm = false;

    let day = new Date();
    day.setDate(day.getDate() + 1);
    $scope.ticket = {
      image_url: '/images/ticket.png',
      date: new Date(),
      visit_date: day,
      files: [],
      device_info: {},
      done: false,
      print_count: 0,
      close1_done: false,
      close2_done: false,
      close_eng_done: false
    };
    if (t && t.device_info) {


      if (t.device_info.category) {
        $scope.category_list = [t.device_info.category];
      }
      if (t.device_info.sub_category) {
        $scope.sub_category_list = [t.device_info.sub_category];
      }
      if (t.device_info.device) {
        $scope.device_list = [t.device_info.device];
      }
      if (t.device_info.model) {
        $scope.models = [t.device_info.model];
      }
      if (t.damage) {
        $scope.damages.push(t.damage);
      }



    }
    $timeout(function () {

      if (t) {
        $scope.ticket.customer = Object.assign({} ,  t.customer );
        $scope.ticket.device_info = Object.assign({} ,  t.device_info );
      }


      $scope.ticket.status = {
        id: 1,
        ar: "مفتوح",
        en: "Open"
      };
      $scope.ticket.priotry = {
        id: 1,
        en: "Normal",
        ar: "عادى"
      };
    }, 300)
    $timeout(function () {

    }, 300);
    site.showModal('#addTicketModal');
  };

  $scope.add = function () {

    $scope.error = '';
    const v = site.validated();

    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;

    let customer = $scope.ticket.customer;

    if(!customer){
      $scope.error = 'يجب اختيار عميل';
      return;
    }

    if (customer.black_list == true) {
      if ($scope.customer_confirm !== true) {
        $scope.busy = false;
        site.showModal('#CustomerConfirmModal');
        return;
      }
    }


    $http({
      method: "POST",
      url: "/api/tickets/view/open",
      data: $scope.ticket
    }).then(
      function (response) {
        $scope.busy = false;
        if ($scope.ticket_open_confirm !== true && response.data.done && response.data.docs && response.data.docs.length > 0) {
          $scope.busy = false;
          site.showModal('#ticketOpenConfirmModal');
        } else {
          $scope.ticket.customer = {
            _id: customer._id,
            id: customer.id,
            name: customer.name,
            mobiles: customer.mobiles,
            phones: customer.phones,
            gov: customer.gov,
            city: customer.city,
            town: customer.town,
            region: customer.region
          };

          $http({
            method: "POST",
            url: "/api/tickets/add",
            data: $scope.ticket
          }).then(
            function (response) {
              $scope.busy = false;
              if (response.data.done) {
                site.hideModal('#addTicketModal');
                $scope.list.add(response.data.doc);
              } else {
                $scope.error = response.data.error;
              }
            },
            function (err) {}
          )
        }
      })


  };

  $scope.edit = function (ticket) {
    $scope.error = '';
    $scope.view(ticket);
    $scope.ticket = {};
    site.showModal('#updateTicketModal');
  };

  $scope.update = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/update",
      data: $scope.ticket
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateTicketModal');
          $scope.updateOneTicket($scope.ticket);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    )
  };

  $scope.updateReview = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/updateReview",

      data: {
        id: $scope.ticket.id,
        ticket: {
          review_status: $scope.ticket.review_status,
          review_done: $scope.ticket.review_done,
          notes: $scope.ticket.notes
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#ReviewModal');
          $scope.updateOneTicket($scope.ticket);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };


  $scope.remove = function (ticket) {
    $scope.error = '';
    $scope.view(ticket);
    $scope.ticket = {};
    site.showModal('#deleteTicketModal');
  };

  $scope.view = function (ticket , callback) {
    callback = callback || function(){};

    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/view",
      data: {
        id: ticket.id
      }
    }).then(
      function (response) {

        if (response.data.done) {
          let t = response.data.doc;
         
          t.device_info = t.device_info || {};

          if (t.device_info.category) {
            $scope.category_list = [t.device_info.category];
          }
          if (t.device_info.sub_category) {
            $scope.sub_category_list = [t.device_info.sub_category];
          }
          if (t.device_info.device) {
            $scope.device_list = [t.device_info.device];
          }
          if (t.device_info.model) {
            $scope.models = [t.device_info.model];
          }
          if (t.damage) {
            $scope.damages.push(t.damage);
          }

          t.date = new Date(t.date);
          t.visit_date = new Date(t.visit_date);
          t.close_eng = t.close_eng || {}
          t.close_eng.device_info = t.close_eng.device_info || {}

          if (t.eng_list && t.eng_list.length > 0) {
           
          }

          callback(Object.assign({}, t));

          $timeout(function () {
            $scope.ticket = Object.assign({}, t);
            $scope.busy = false;
          }, 500);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    )
  };

  $scope.details = function (ticket) {
    $scope.error = '';
    $scope.view(ticket);
    $scope.ticket = {};
    site.showModal('#viewTicketModal');
  };

  $scope.delete = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets/delete",

      data: {
        id: $scope.ticket.id,
        name: $scope.ticket.name
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteTicketModal');
          $scope.list.forEach((t , i)=>{
            if(t.id  == $scope.ticket.id){
              $scope.list.splice(i , 1);
            }
          })
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    )
  };


  $scope.townBusy = false;
  $scope.townChanged = function () {
    $scope.townBusy = true;
    if ($scope.ticket.customer.town) {
      $scope.ticket.customer.gov.id = $scope.ticket.customer.town.gov.id;
      $scope.ticket.customer.city.id = $scope.ticket.customer.town.city.id;
      $scope.ticket.customer.region.id = $scope.ticket.customer.town.region.id;
    }

    $timeout(() => {
      $scope.townBusy = false
    }, 500);
  };

  $scope.loadAll();
  $scope.loadTickets_Sources();
  $scope.loadTickets_Services();
  $scope.loadTickets_Status();
  $scope.loadTickets_Status2();
  $scope.loadTickets_Status3();
  $scope.loadTicketReviewStatus();
  $scope.loadDateTypes();
  $scope.loadUserTypes();
  $scope.loadCompanies();
  $scope.loadTickets_Priorities();
  $scope.loadEngList();
  $scope.loadUserList();

  $scope.loadGoves();
  $scope.loadCities();
  $scope.loadTowns();
  $scope.loadRegions();

});