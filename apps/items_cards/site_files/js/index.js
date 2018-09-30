app.controller("items_cards", function ($scope, $http, $interval) {
  $scope.search = {
    bySystem: true,
    system: 'security',
    byUser: false,
    user: null,
    byMessage: false,
    message: '',
    byValue: false,
    value: '',
    byTime: false,
    time: null,
    fromDate: null,
    toDate: null,
    bySort: true,
    sort: 'time',
    sortType: '-1',
    limit: 50
  };

  $scope.sortList = [{
      value: 'source',
      en: 'By System Name',
      ar: 'ترتيب  حسب أسم النظام'
    },
    {
      value: 'user',
      en: 'By User Name',
      ar: 'ترتيب  حسب أسم المستخدم'
    },
    {
      value: 'message',
      en: 'By Message',
      ar: 'ترتيب  حسب محتوى الرسالة'
    },
    {
      value: 'value',
      en: 'By Value',
      ar: 'ترتيب  حسب محتوى القيمة'
    },
    {
      value: 'time',
      en: 'By Time Ascending',
      ar: 'ترتيب تصاعدى حسب الوقت'
    },
  ];

  $scope.sortTypeList = [{
      value: '-1',
      en: 'Desccending',
      ar: 'تنازلى'
    },
    {
      value: '1',
      en: 'Accending',
      ar: 'تصاعدى'
    },

  ];
  $scope.systemList = [{
      value: 'security',
      en: 'Security System',
      ar: 'نظام الحماية'
    },
    {
      value: 'company',
      en: 'Company System',
      ar: 'نظام الشركات'
    },
    {
      value: 'governorate',
      en: 'Governorate System',
      ar: 'نظام المحافظات'
    },
  ];


  $scope.loadStores = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/stores/all",
      data: {
        select : {id:1 , name : 1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.stores = response.data.list;
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
      url: "/api/items_cards/all",
      data: {}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          for (let i = 0; i < response.data.list.length; i++) {
            let date_time = new Date(response.data.list[i].time).toLocaleString();
            let date = date_time.split(',')[0].split('/');
            response.data.list[i].dayDate = date[1] + '-' + date[0] + '-' + date[2];
            response.data.list[i].dayTime = date_time.split(',')[1];
          }
          $scope.list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )

  };


  $scope.loadUsers = function () {
    if ($scope.userList) {
      return
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/users/all",
      data: {}
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

  $scope.searchByTime = function (time) {
    $scope.search = {
      byTime: true,
      time: time,
      limit: 100
    };
    $scope.searchAll();
  };

  $scope.searchByUser = function (user) {
    $scope.search = {
      byUser: true,
      user: user,
      limit: 100
    };
    $scope.searchAll();
  };

  $scope.searchBySystem = function (system) {
    $scope.search = {
      bySystem: true,
      system: system,
      limit: 100
    };
    $scope.searchAll();
  };

  $scope.searchAll = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/items_cards/search",
      data: $scope.search
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          for (let i = 0; i < response.data.list.length; i++) {
            let date_time = new Date(response.data.list[i].time).toLocaleString();
            let date = date_time.split(',')[0].split('/');
            response.data.list[i].dayDate = date[1] + '-' + date[0] + '-' + date[2];
            response.data.list[i].dayTime = date_time.split(',')[1];
          }
          $scope.list = response.data.list;
          site.hideModal('#searchItems_CardsModal');
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )

  };


  $scope.showAdd = (n) => {
    site.showModal('#displayItems_CardsModal')
    $('#displayContent').html(site.toHtmlTable(n.add));
  };

  $scope.showUpdate = (n) => {
    site.showModal('#displayItems_CardsModal')
    $('#displayContent').html(site.toHtmlTable(n.update));
  };

  $scope.showDelete = (n) => {
    site.showModal('#displayItems_CardsModal')
    $('#displayContent').html(site.toHtmlTable(n.delete));
  };

  $scope.loadAll();
  $scope.loadStores();

});