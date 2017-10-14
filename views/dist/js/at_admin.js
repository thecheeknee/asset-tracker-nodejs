var request_array, asset_array, driver_array;

function bindcommands(){
    $(document).on('click','i.fa.fa-eye',function(e){
        e.stopPropagation();
        var data_li = $(this).closest('li');
        var view =  '#' + data_li.attr('data-call');
        var view_box = $( view );
        if( view=='#request_view' ){
            view_box.find(['data-type=assettype']).text(data_li.attr('data-type'));
            view_box.find(['data-type=destination']).text(data_li.attr('data-destination'));
            view_box.find(['data-type=source']).text(data_li.attr('data-source'));
            view_box.find(['data-type=status']).text(data_li.attr('data-status'));
        }else if( view=='#asset_view' ){
            view_box.find('input#_id').attr('value',data_li.attr('data-id'));
            view_box.find('input#assettype').attr('value',data_li.attr('data-type'));
            view_box.find('input#source').attr('value',data_li.attr('data-source'));
            view_box.find('input#destination').attr('value',data_li.attr('data-destination'));
            view_box.find('input#assigned').attr('value',data_li.attr('data-status'));
            if(data_li.attr('data-status')=='true'){
                view_box.find('input#assignstatus').prop("checked", true);
            }else{
                view_box.find('input#assignstatus').removeAttr('checked');
            }
        }else{
            
        }
        if(view_box.find('.box-body').css('display')=='none'){
            view_box.find('button.btn.btn-info.btn-sm').click();
        }
    });
    $('[name=asset_type_img]').change(function(){
        $('input[name=assettype]').attr('value', $('[name=asset_type_img]:checked').val() );
    });
}

function loadRequests(){
    //updates top panel, sidebar nav and list of requests
    $('#total_requests .inner h3').text(request_array.total_requests);
    $('#pending_requests .inner h3').text(request_array.pending_requests);
    var preq = $('#pending_list ul');
    preq.empty();
    var creq = $('#current_list ul');
    creq.empty();
    var areq = request_array.request_list;
    for(var i=0; i< areq.length; i++){
        var labl, labltext, delreq;
        if( areq[i].request_status=='pending' ){
            labl = 'label-warning';
            labltext = 'pending';
            delreq = '<i class="fa fa-trash-o"></i>';
            preq.append('<li data-call="request_view" data-type="'+areq[i].assettype+'" data-destination="'+areq[i].destination+'" data-source="'+areq[i].source+'" data-status="'+areq[i].request_status+'"><span class="handle ui-sortable-handle"> <i class="fa fa-ellipsis-v"></i> <i class="fa fa-ellipsis-v"></i> </span> <span class="text">'+areq[i].assettype+' <i class="fa fa-angle-right" aria-hidden="true"></i></span> <span class="text">'+areq[i].source+'</span> <span class="text"><i class="fa fa-long-arrow-right"></i> '+areq[i].destination+'</span> <small class="label '+labl+'"><i class="fa fa-clock-o"></i> '+labltext+'</small> <div class="tools"> <i class="fa fa-eye"></i>'+delreq+'</div></li>');
        }else if(areq[i].request_status=='current'){
            labl = 'label-success';
            labltext = 'active';
            delreq = '';
            creq.append('<li data-call="request_view" data-type="'+areq[i].assettype+'" data-destination="'+areq[i].destination+'" data-source="'+areq[i].source+'" data-status="'+areq[i].request_status+'"><span class="handle ui-sortable-handle"> <i class="fa fa-ellipsis-v"></i> <i class="fa fa-ellipsis-v"></i> </span> <span class="text">'+areq[i].assettype+' <i class="fa fa-angle-right" aria-hidden="true"></i></span> <span class="text">'+areq[i].source+'</span> <span class="text"><i class="fa fa-long-arrow-right"></i> '+areq[i].destination+'</span> <small class="label '+labl+'"><i class="fa fa-clock-o"></i> '+labltext+'</small> <div class="tools"> <i class="fa fa-eye"></i>'+delreq+'</div></li>');
        }else{
            labl = 'label-default';
            labltext = 'completed';
            delreq = '';
        }
    }
}

function loadAssets(){
    $('#assets_in_use .inner h3').text(asset_array.active_assets);
    $('#assets_available .inner h3').text(asset_array.available_assets);
    var li_assets = $('#asset_list ul');
    var assets = asset_array.total_assets;
    var labl ='', labltext='';
    li_assets.empty();
    console.log(assets);
    for(var i=0; i< assets.length; i++){
        if( assets[i].assigned==undefined || assets[i].assigned==false ){
            labl = 'label-success';
            labltext = 'available';
        }
        li_assets.append('<li data-call="asset_view" data-id="'+assets[i]._id+'" data-type="'+assets[i].assettype+'" data-destination="'+assets[i].destination+'" data-source="'+assets[i].source+'" data-status="'+assets[i].assigned+'"><span class="handle ui-sortable-handle"> <i class="fa fa-ellipsis-v"></i> <i class="fa fa-ellipsis-v"></i> </span> <span class="text">'+assets[i].assettype+' <i class="fa fa-angle-right" aria-hidden="true"></i></span> <span class="text">'+assets[i].source+'</span> <span class="text"><i class="fa fa-long-arrow-right"></i> '+assets[i].destination+'</span> <small class="label '+labl+'"><i class="fa fa-clock-o"></i> '+labltext+'</small> <div class="tools"> <i class="fa fa-eye"></i></div></li>');
    }
}

function loadDriver(){
    //update driver list
    //update driver dropdown for assigning
}

function loadData(user_type, user_id){
    var requests_check = 'owner/getRequests';
    var driver_check = 'owner/getUsers';
    var assets_check = 'owner/getAssets';
    $.get(requests_check,{'_id':user_id})
        .done(function(data){
            if(data.length>0){
                var preq = data.filter(function(data) { return data.request_status === 'pending' });
                var areq = data.filter(function(data) { return data.request_status === 'current' });
                request_array = {
                    'total_requests':data.length,
                    'pending_requests':preq.length,
                    'request_list':data
                };
            }else{
                request_array = {
                    'total_requests':0,
                    'pending_requests':0
                };
            }
            loadRequests();
        });
    $.get(driver_check,{'usertype':user_type})
        .done(function(data){
            if(data.length>0){
                
            }
        });
    $.get(assets_check,{'usertype':user_type})
        .done(function(data){
            if(data.length>0){
                var av_asset = data.filter(function(data) { return data.assigned === 'false' });//available assets
                var ci_asset = data.filter(function(data) { return data.assigned === 'true' });//Assets in use
                asset_array ={
                    'total_assets':data,
                    'available_assets':av_asset.length,
                    'active_assets':ci_asset.length,
                }
                loadAssets();
            }else{
                asset_array ={
                    'available_assets':av_asset,
                    'active_assets':ci_asset,
                }
            }
            
        });
}

function approveRequest(){
    var request = $('#request_approval').serialize();
    
}

function addDriver(){
    var driverData = $('#driver_form').serialize();
    var addDriver = 'owner/addDriver';
    console.log(driverData);
    $.post(addDriver,driverData)
    .done(function(data){
        console.log(data);
    });
}

function updateDriver(){
    var driverData = $('#driver_form').serialize();
    var addDriver = 'owner/updateDriver';
    console.log(driverData);
    $.post(addDriver,driverData)
    .done(function(data){
        console.log(data);
    });
}

function deleteDriver(){
    var driverData = $('#driver_form').serialize();
    var addDriver = 'owner/addDriver';
    console.log(driverData);
    $.post(addDriver,driverData)
    .done(function(data){
        console.log(data);
    });
}

function asset(){
    if( $('#asset_view input#_id').val()==undefined || $('#asset_view input#_id').val()=='' ){
       addAsset();
    }else{
       updateAsset();
    }
}

function addAsset(){
    var assetData = $('#asset_form').serialize();
    var addAsset = 'owner/addAsset';
    console.log(assetData);
    $.post(addAsset,assetData)
    .done(function(data){
        console.log(data);
    });
}

function updateAsset(){
    var assetData = $('#asset_form').serialize();
    var addAsset = 'owner/updateAsset';
    console.log(assetData);
    $.post(addAsset,assetData)
    .done(function(data){
        console.log(data);
    });
}

$(document).ready(function(){
    loadData('admin', 'abhinaya');
    bindcommands();
})