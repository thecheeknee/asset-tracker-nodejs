var request_array, asset_array;

function counter(json, f, t) {
  return json.filter(function (i,n){
        return n.t===f;
    });
}

function loadRequests(){
    //updates top panel, sidebar nav and list of requests
    $('#total_requests .inner h3').text(request_array.total_requests);
    $('#pending_requests .inner h3').text(request_array.pending_requests);
    $('#active_requests .inner h3').text(request_array.active_requests);
    var req = $('#current_requests ul');
    req.empty();
    var areq = request_array.active_request_list;
    for(var i=0; i< areq.length; i++){
        var labl, labltext, delreq;
        if( areq[i].request_status=='pending' ){
            labl = 'label-warning';
            labltext = 'pending';
            delreq = '<i class="fa fa-trash-o"></i>';
        }else if(areq[i].request_status=='current'){
            labl = 'label-success';
            labltext = 'active';
            delreq = '';
        }else{
            labl = 'label-default';
            labltext = 'completed';
            delreq = '';
        }
        req.append('<li data-type="'+areq[i].assettype+'" data-destination="'+areq[i].destination+'" data-source="'+areq[i].source+'" data-status="'+areq[i].request_status+'"><span class="handle ui-sortable-handle"> <i class="fa fa-ellipsis-v"></i> <i class="fa fa-ellipsis-v"></i> </span> <span class="text">'+areq[i].assettype+' <i class="fa fa-angle-right" aria-hidden="true"></i></span> <span class="text">'+areq[i].source+'</span> <span class="text"><i class="fa fa-long-arrow-right"></i> '+areq[i].destination+'</span> <small class="label '+labl+'"><i class="fa fa-clock-o"></i> '+labltext+'</small> <div class="tools"> <i class="fa fa-eye"></i>'+delreq+'</div></li>');
    }
}

function loadData(user_type, user_id){
    var assets_check = 'user/getRequests';
    $.get(assets_check,{'type':user_type,'username':user_id})
        .done(function(data){
            if(data.length>0){
                var preq = data.filter(function(data) { return data.request_status === 'pending' });
                var areq = data.filter(function(data) { return data.request_status === 'current' });
                request_array = {
                    'total_requests':data.length,
                    'pending_requests':preq.length,
                    'active_requests':areq.length,
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
        })
}

function addRequest(){
    var requestData = $('#new_request').serialize();
    var addRequest = 'user/addRequest';
    console.log(requestData);
    $.post(addRequest,requestData)
    .done(function(data){
        console.log(data);
    });
}

$(document).ready(function(){
    loadData('admin', 'abhinaya');
    $('[name=asset_type_img]').change(function(){
        $('input[name=assettype]').val( $('[name=asset_type_img]:checked').val() );
    })
    
})