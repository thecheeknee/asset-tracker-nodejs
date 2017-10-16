var request_array, fetch_request;

//maps data
var directionsService, directionsDisplay;

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
    var waypoint = document.getElementById('current_waypoint').value;
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
    var loc = 'transport/trackLocation';
    $.get(loc,{id:req_id})
        .done(function(data){
            console.log(data);
            if(data.status=='success'){
                document.getElementById('asset_destination').value=data.data.destination;
                document.getElementById('asset_source').value=data.data.source;
                document.getElementById('current_waypoint').value=data.data.waypoint;
                document.getElementById('last_updated').value=data.data.last_update;
                calculateAndDisplayRoute(directionsService, directionsDisplay);
                google.maps.event.trigger(map, 'resize');
                if(data.waypoints[0].waypoints.length>0){
                    var wp_array = data.waypoints[0].waypoints;
                    $('select#waypoint_check').empty();
                    for(var i=0; i<wp_array.length; i++){
                        $('select#waypoint_check').append('<option value="'+wp_array[i]+'">'+wp_array[i]+'</option>');
                    }
                }
            }else{
                
            }
            
        });
    
    
}

function updateWayPoint(){
    var update_waypoint = 'transport/updateWaypoint';
    var checkpoint = $('#waypoint_check').val();
    $.get(update_waypoint,{req_id:request_array[0]._id,waypoint:checkpoint})
        .done(function(data){
            console.log(data);
        });
}

function loadData(user_type, user_name, id){
    var request_check = 'transport/getRequest';
    $.get(request_check,{'type':user_type,'username':user_name,'id':id})
        .done(function(data){
            if(data.length>0){
                request_array=data;
                console.log(request_array[0]);
                loadMap(request_array[0]._id);
            }else{
                request_array = {
                    'total_requests':0,
                    'pending_requests':0
                };
            }
        });

}

$(document).ready(function(){
    $.get('session/',{type:'driver'})
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
                        $('[data-userdetails]').html(user_array.user[0].username + '<small>'+ user_array.user[0].company +'</small>');
                    });
            }
        });
    loadData('driver', user_array.user[0].username,userid);
});