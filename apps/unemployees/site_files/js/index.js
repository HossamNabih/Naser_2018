app.controller("unemployees", function($scope, $http) {

$scope.unemployee = {};

$scope.addPhone = function(){
  if(!$scope.unemployee.phones){
    $scope.unemployee.phones = [];
  }
  $scope.unemployee.phones.push($scope.phone);
  $scope.phone = '';
};

$scope.deletePhone = function(phone){
  if(!$scope.unemployee.phones){
    $scope.unemployee.phones = [];
  }
  for (let i = 0; i < $scope.unemployee.phones.length; i++) {
    if($scope.unemployee.phones[i] == phone){
      $scope.unemployee.phones.splice(i , 1);
    }
  }
};

$scope.addMobile = function(){
  if(!$scope.unemployee.mobiles){
    $scope.unemployee.mobiles = [];
  }
  $scope.unemployee.mobiles.push($scope.mobile);
  $scope.mobile = '';
};

$scope.deleteMobile = function(mobile){
  if(!$scope.unemployee.mobiles){
    $scope.unemployee.mobiles = [];
  }
  for (let i = 0; i < $scope.unemployee.mobiles.length; i++) {
    if($scope.unemployee.mobiles[i] == mobile){
      $scope.unemployee.mobiles.splice(i , 1);
    }
  }
};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/unemployees/upload/image', fd, {
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
        $scope.unemployee.image_url = res.data.image_url;
        }
    }, function (error) {
        $scope.uploadStatus = error;
    });
};

$scope.loadGoves = function() {
  $scope.busy = true;
  $http({
    method: "POST",
    url: "/api/goves/all",
    data: {
      select : {id:1 , name : 1}
    }
  }).then(
    function(response) {
      $scope.busy = false;
      if (response.data.done) {
        $scope.goves = response.data.list;
      }
    },
    function(err) {
      $scope.busy = false;
      $scope.error = err;
    }
  )
};


$scope.loadCities = function (gov) {

  var where = {};

  if (typeof gov === 'string') {
    gov = JSON.parse(gov);
  } else {
    gov = gov || {};
  }
  if (gov && gov._id) {
    where = {
      'gov._id': gov._id
    };
  }

  $scope.busy = true;
  $http({
    method: "POST",
    url: "/api/cities/all",
    data: {
      where: where,
      select : {id:1 , name : 1}
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

  var where = {};

  if (typeof city === 'string') {
    city = JSON.parse(city);
  } else {
    city = city || {};
  }
  if (city && city._id) {
    where = {
      'city._id': city._id
    };
  }

  $scope.busy = true;
  $http({
    method: "POST",
    url: "/api/towns/all",
    data: {
      where: where,
      select : {id:1 , name : 1}
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


$scope.loadRegions = function (town) {

  var where = {};

  if (typeof town === 'string') {
    town = JSON.parse(town);
  } else {
    town = town || {};
  }
  if (town && town._id) {
    where = {
      'town._id': town._id
    };
  }

  $scope.busy = true;
  $http({
    method: "POST",
    url: "/api/regions/all",
    data: {
      where: where,
      select : {id:1 , name : 1}
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


  $scope.loadAll = function() {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/unemployees/all",
      data: {}
    }).then(
      function(response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list = response.data.list;
        }
      },
      function(err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.newUnEmployee = function(){
    $scope.error = '';
    $scope.unemployee = {image_url : '/images/unemployee.png'};
    site.showModal('#addUnEmployeeModal');
  };
  $scope.add = function() {
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/unemployees/add",
       data: $scope.unemployee
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#addUnEmployeeModal');
          $scope.loadAll();
         }else{
          $scope.error = '##word.error##';
         }
       },
       function(err) {
        console.log(err);
       }
     )
   };

   $scope.edit = function(unemployee){
    $scope.error = '';
    $scope.view(unemployee);
    $scope.unemployee = {};
     site.showModal('#updateUnEmployeeModal');
   };
   $scope.update = function() {
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/unemployees/update",
       data: $scope.unemployee
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#updateUnEmployeeModal');
          $scope.loadAll();
         }else{
          $scope.error = '##word.error##';
         }
       },
       function(err) {
         console.log(err);
       }
     )
   };

   $scope.remove = function(unemployee){
    $scope.view(unemployee);
    $scope.unemployee = {};
    site.showModal('#deleteUnEmployeeModal');
  };

  $scope.view = function(unemployee){
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/unemployees/view",
      data: {_id : unemployee._id}
    }).then(
      function(response) {
       $scope.busy = false;
        if (response.data.done) {
          $scope.unemployee = response.data.doc;
        }else{
         $scope.error = response.data.error;
        }
      },
      function(err) {
        console.log(err);
      }
    )
  };
  $scope.details = function(unemployee){
    $scope.view(unemployee);
    $scope.unemployee = {};
   site.showModal('#viewUnEmployeeModal');
  };
   $scope.delete = function() {
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/unemployees/delete",
       data: {_id : $scope.unemployee._id , name : $scope.unemployee.name}
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#deleteUnEmployeeModal');
          $scope.loadAll();
         }else{
          $scope.error = response.data.error;
         }
       },
       function(err) {
         console.log(err);
       }
     )
   };
  $scope.loadAll();
  $scope.loadGoves();
  $scope.loadCities();
  $scope.loadTowns();
  $scope.loadRegions();
});
