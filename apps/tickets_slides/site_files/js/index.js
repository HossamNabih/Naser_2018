app.controller("tickets_slides", function($scope, $http) {

$scope.ticket_slide = {};

  $scope.uploadImage = function (files) {
    var fd = new FormData();
    fd.append("fileToUpload", files[0]);
    $http.post('/api/tickets_slides/upload/image', fd, {
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
        $scope.ticket_slide.image_url = res.data.image_url;
        }
    }, function (error) {
        $scope.uploadStatus = error;
    });
};

  $scope.loadAll = function() {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets_slides/all",
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

  $scope.newTicket_Slide = function(){
    $scope.error = '';
    $scope.ticket_slide = {image_url : '/images/ticket_slide.png' , salary_calculate : false};
    site.showModal('#addTicket_SlideModal');
  };
  $scope.add = function() {

    $scope.error = '';
    const v = site.validated();
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/tickets_slides/add",
       data: $scope.ticket_slide
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#addTicket_SlideModal');
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

   $scope.edit = function(ticket_slide){
    $scope.error = '';
    $scope.view(ticket_slide);
    $scope.ticket_slide = {};
     site.showModal('#updateTicket_SlideModal');
   };
   $scope.update = function() {
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/tickets_slides/update",
       data: $scope.ticket_slide
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#updateTicket_SlideModal');
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

   $scope.remove = function(ticket_slide){
    $scope.view(ticket_slide);
    $scope.ticket_slide = {};
    site.showModal('#deleteTicket_SlideModal');
  };

  $scope.view = function(ticket_slide){
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tickets_slides/view",
      data: {_id : ticket_slide._id}
    }).then(
      function(response) {
       $scope.busy = false;
        if (response.data.done) {
          $scope.ticket_slide = response.data.doc;
        }else{
         $scope.error = response.data.error;
        }
      },
      function(err) {
        console.log(err);
      }
    )
  };
  $scope.details = function(ticket_slide){
    $scope.view(ticket_slide);
    $scope.ticket_slide = {};
   site.showModal('#viewTicket_SlideModal');
  };
   $scope.delete = function() {
    $scope.busy = true;
     $http({
       method: "POST",
       url: "/api/tickets_slides/delete" ,
       data: {_id : $scope.ticket_slide._id , name : $scope.ticket_slide.name}
     }).then(
       function(response) {
        $scope.busy = false;
         if (response.data.done) {
          site.hideModal('#deleteTicket_SlideModal');
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
});
