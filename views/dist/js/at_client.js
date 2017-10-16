var request_array, fetch_request, messages_array;

//maps data
var directionsService, directionsDisplay;
var customWayPoint;

function bindData(){
    $('[name=asset_type_img]').change(function(){
        $('input[name=assettype]').val( $('[name=asset_type_img]:checked').val() );
    })
    $(document).on('click','i.fa.fa-trash-o',function(e){
        e.stopPropagation();
        var data_li = $(this).closest('li');
        if(confirm('Do you want to delete this request?\nThis action cannot be reversed')){
            deleteRequest(data_li.attr('id'));
        }
    });
    $(document).on('click','a[data-type=messages]',function(e){
        e.stopPropagation();
        $('#message_view .modal-body h1 small').text('#'+$(this).attr('data-request'));
        $('#message_view .modal-body h1 span').removeClass('label-danger label-success')
        if( $(this).attr('data-requeststatus')=='approved' ){
            $('#message_view .modal-body h1 span').addClass('label-success').text('approved');
        }else{
            $('#message_view .modal-body h1 span').addClass('label-danger').text('denied');
        }
        $('#message_view .modal-body p').html($(this).find('p.hide').html());
        $('#message_view').modal('show');
    });
    $(document).on('click','i.fa.fa-map-marker',function() {
        var id = $(this).closest('li').attr('id');
    });
    $(document).on('click','i.fa.fa-map-marker',function(e){
        e.stopPropagation();
        var id = $(this).closest('li').attr('id');
        loadMap(id);
    });
}

function initMap() {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: {lat: 17.3850, lng: 78.4867}
    });
    directionsDisplay.setMap(map);
    
    document.getElementById('asset_source').addEventListener('change', function() {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    });
    document.getElementById('asset_destination').addEventListener('change', function() {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [];
    var waypoint;
    if(typeof customWayPoint=='string'){
        var waypoint = customWayPoint; //string name
    }else{
        var waypoint = customWayPoint; //latlng obj
    }
    waypts.push({location:waypoint, stopover:true});
    
    directionsService.route({
      origin: document.getElementById('asset_source').value,
      destination: document.getElementById('asset_destination').value,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
    },function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}

function loadMap(req_id){
    var loc = 'user/trackLocation';
    $.post(loc,{id:req_id})
        .done(function(data){
            console.log(data);
            if(data.status=='success'){
                document.getElementById('asset_destination').value=data.data.destination;
                document.getElementById('asset_source').value=data.data.source;
                customWayPoint = data.data.waypoint;
                $('#show_tracker_location').on('shown.bs.modal', function (e) {
                    calculateAndDisplayRoute(directionsService, directionsDisplay);
                    google.maps.event.trigger(map, 'resize');
                });
                $('#show_tracker_location').modal('show');
            }else{

            }
            
        });
    
    
}

function loadRequests(){
    //updates top panel, sidebar nav and list of requests
    $('#total_requests .inner h3').text(request_array.total_requests);
    $('#pending_requests .inner h3').text(request_array.pending_requests);
    $('#active_requests .inner h3').text(request_array.active_requests);
    $('#denied_requests .inner h3').text(request_array.denied_requests);
    var req = $('#current_requests ul');
    req.empty();
    var areq = request_array.active_request_list;
    if(areq!==undefined || areq.length>0){
        for(var i=0; i< areq.length; i++){
            var labl, labltext, delreq, asset_type;
            var track = '';
            if( areq[i].request_status=='pending' ){
                labl = 'label-warning';
                labltext = 'pending';
                delreq = '<i class="fa fa-trash-o"></i>';
                asset_type = areq[i].assettype;
            }else if(areq[i].request_status=='approved'){
                labl = 'label-success';
                labltext = 'active';
                delreq = '';
                asset_type = areq[i].asset_type_img;
                track = '<i class="fa fa-map-marker" aria-hidden="true"></i>';
            }else if(areq[i].request_status=='denied'){
                labl = 'label-danger';
                labltext = 'denied';
                delreq = '<i class="fa fa-trash-o"></i>';
                asset_type = areq[i].asset_type_img;
            }else{
                labl = 'label-default';
                labltext = 'completed';
                delreq = '';
                asset_type = areq[i].asset_type_img
            }
            req.append('<li id="'+areq[i]._id+'" data-type="'+asset_type+'" data-destination="'+areq[i].destination+'" data-source="'+areq[i].source+'" data-status="'+areq[i].request_status+'"><span class="handle ui-sortable-handle"> <i class="fa fa-ellipsis-v"></i> <i class="fa fa-ellipsis-v"></i> </span> <span class="text">'+asset_type+' <i class="fa fa-angle-right" aria-hidden="true"></i></span> <span class="text">'+areq[i].source+'</span> <span class="text"><i class="fa fa-long-arrow-right"></i> '+areq[i].destination+'</span> <small class="label '+labl+'"><i class="fa fa-clock-o"></i> '+labltext+'</small> <div class="tools"> <i class="fa fa-eye"></i>'+delreq+ track +'</div></li>');
        }
    }else{
        req.append('<li><span class="text">No Requests to display</span>')
    }
}

function loadMessages(){
    var l = messages_array.length;
    msg = messages_array;
    msg_li = $('#messages_list ul.dropdown-menu ul.menu');
    msg_li.empty();
    if(l==1){
        $('#messages_list ul.dropdown-menu li.header').text('You have 1 message');
    }else{
        $('#messages_list ul.dropdown-menu li.header').text('You have '+l+' messages');
    }
    $('#messages_list span.label').text(l);
    for(var i=0; i<l; i++){
        msg_li.append('<li><a data-type="messages" data-request="'+msg[i].request_id+'" data-requeststatus="'+msg[i].request_status+'"><div class="pull-left"><img src="dist/img/user2-160x160.jpg" class="img-circle" alt="User Image"></div><h4 class="text-capitalize">'+msg[i].sender+'</h4><p><strong>#'+msg[i].request_id+'</strong><br>- '+msg[i].request_status+'.</p><p class="hide">'+msg[i].message+'</p></a></li>');
    }
}

function loadData(user_type, user_id){
    var request_check = 'user/getRequests';
    var messages_check = 'user/getMessages';
    $.get(request_check,{'type':user_type,'username':user_id})
        .done(function(data){
            if(data.length>0){
                var preq = data.filter(function(data) { return data.request_status === 'pending' });
                var areq = data.filter(function(data) { return data.request_status === 'approved' });
                var dreq = data.filter(function(data) { return data.request_status === 'denied' });
                request_array = {
                    'total_requests':data.length,
                    'pending_requests':preq.length,
                    'active_requests':areq.length,
                    'denied_requests':dreq.length,
                    'pending_request_list':preq,
                    'active_request_list':data
                };
                console.log(request_array);
            }else{
                request_array = {
                    'total_requests':0,
                    'pending_requests':0
                };
            }
            loadRequests();
        });
    $.get(messages_check,{'userid':user_id})
        .done(function(data){
            console.log(data);
            if(data.length>0){
                messages_array = data;
                loadMessages();
            }else{
                $('#messages_list span.label').removeClass('label-success').addClass('label-default').text('0');
                $('#messages_list ul.dropdown-menu li.header').text('You have 0 messages');
                $('#messages_list ul.dropdown-menu li.footer').empty();
                $('#messages_list ul.dropdown-menu ul.menu').empty();
            }
        })
}

function addRequest(){
    var requestData = $('#new_request').serialize();
    var addRequest = 'user/addRequest';
    console.log(requestData);
    $.post(addRequest,requestData)
    .done(function(data){
        if(data.status=='success'){
            alert('Request Added Successfully')
        }
        console.log(data);
    });
}

function deleteRequest(req_id){
    var res = {
        id: req_id
    }
    var delRequest = 'user/delRequest';
    $.post(delRequest,res)
    .done(function(data){
        if(data.status=='success'){
            alert('Request Deleted Successfully')
        }else if(data.status=='failed' && data.message=='approved request'){
            alert('Admin has already approved this request.');
        }else if(data.status=='failed' && data.message=='not found'){
            alert('Unable to find this request. Please refresh your browser.');
        }else{
            alert('an error occurred. Check console for logs');
        }
        console.log(data);
    });
}

$(document).ready(function(){
    $.get('session/',{type:'client'})
        .done(function(data){
            if(data.status=='failed'){
                location.pathname='/login';
            }else{
                var userid = data.userid;
                $.post('getuserDetails/',{userid: userid})
                    .done(function(data){
                        user_array = data;
                        //set details across all fields
                        $('[data-username]').text(user_array.user[0].username);
                        $('[data-userdetails]').html(user_array.user[0].username +' - ' + user_array.user[0].designation + '<small>'+ user_array.user[0].company +'</small>');
                        loadData('client', user_array.user[0].username);
                        bindData();
                    });
            }
        });
    
});