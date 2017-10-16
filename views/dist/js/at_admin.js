var request_array, asset_array, driver_array, message_array;

function clearContents(obj,form){
    if( $('#'+obj).find('button.btn-info').find('i.fa').hasClass('fa-minus')){
        $('#'+form).find('input[type=text], input[type=hidden], select, textarea').val('');
        $('#'+form).find('input[type=radio], input[type=checkbox]').removeAttr('checked').removeAttr('selected');
        bindcommands();
    }
}

function bindcommands(){
    $('a.new_doc').click(function(e){
        e.stopPropagation();
        var view_box = $('#' + $(this).attr('data-view'));
        if(view_box.find('.box-body').css('display')=='none'){
            view_box.find('button.btn.btn-info.btn-sm').click();
        }else{
            alert('Another request is being processed.\nPlease complete the current task/close the '+ $(this).attr('data-view') +' and try again');
        }
    });
    $(document).on('click','i.fa.fa-eye',function(e){
        e.stopPropagation();
        var data_li = $(this).closest('li');
        var view =  '#' + data_li.attr('data-call');
        var view_box = $( view );
        if( view=='#request_view' ){
            view_box.find('td[data-type=assettype]').text(data_li.attr('data-type'));
            view_box.find('td[data-type=destination]').text(data_li.attr('data-destination'));
            view_box.find('td[data-type=source]').text(data_li.attr('data-source'));
            view_box.find('td[data-type=client]').text(data_li.attr('data-client'));
            view_box.find('td[data-type=status]').text(data_li.attr('data-status'));
            if(data_li.attr('data-status')=='approved'){
                $('#request_view_approve').attr('disabled','disabled');
                $('#request_view_deny').attr('disabled','disabled');
            }
            //update request approval modal too
            var approve = $('#request_approval')
            approve.find('#_id').val(data_li.attr('data-id'));
            approve.find('#client_id').val(data_li.attr('data-client'));
            approve.find('#assettype').val(data_li.attr('data-type'));
            approve.find('#destination').val(data_li.attr('data-destination'));
            approve.find('#source').val(data_li.attr('data-source'));
            
        }else if( view=='#asset_view' ){
            view_box.find('input#id').attr('value',data_li.attr('data-id'));
            view_box.find('#asset_type_text').text(data_li.attr('data-type'));
            view_box.find('input#source').attr('value',data_li.attr('data-source'));
            view_box.find('input#destination').attr('value',data_li.attr('data-destination'));
            view_box.find('#assignedStatus').text(data_li.attr('data-status'));
            //update modal data in hidden view
            
        }else if( view=='#driver_view' ){
            view_box.find('#id').val(data_li.attr('data-id'));
            view_box.find('#usercontact').val(data_li.attr('data-contact'));
            view_box.find('#username').val(data_li.attr('data-name'));
            view_box.find('#userpassword').val(data_li.attr('data-password'));
            if(typeof data_li.attr('data-request')!==undefined){
                view_box.find('#current_request').val(data_li.attr('data-request'));
                view_box.find('#current_asset').val(data_li.attr('data-asset'));
            }
        }else{
            
        }
        if(view_box.find('.box-body').css('display')=='none'){
            view_box.find('button.btn.btn-info.btn-sm').click();
        }
    });
    $('[name=asset_type]').change(function(){
        $('#asset_type_text').text($('[name=asset_type]:checked').val() );
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
            preq.append('<li data-call="request_view" data-id="'+areq[i]._id+'" data-type="'+areq[i].assettype+'" data-destination="'+areq[i].destination+'" data-source="'+areq[i].source+'" data-status="'+areq[i].request_status+'" data-client="'+areq[i].client_id+'"><span class="handle ui-sortable-handle"> <i class="fa fa-ellipsis-v"></i> <i class="fa fa-ellipsis-v"></i> </span> <span class="text">'+areq[i].assettype+' <i class="fa fa-angle-right" aria-hidden="true"></i></span> <span class="text">'+areq[i].source+'</span> <span class="text"><i class="fa fa-long-arrow-right"></i> '+areq[i].destination+'</span> <small class="label '+labl+'"><i class="fa fa-clock-o"></i> '+labltext+'</small> <div class="tools"> <i class="fa fa-eye"></i>'+delreq+'</div></li>');
        }else if(areq[i].request_status=='approved'){
            labl = 'label-success';
            labltext = 'active';
            delreq = '';
            creq.append('<li data-call="request_view" data-id="'+areq[i]._id+'" data-type="'+areq[i].asset_type_img+'" data-destination="'+areq[i].destination+'" data-source="'+areq[i].source+'" data-status="'+areq[i].request_status+'" data-client="'+areq[i].client_id+'"><span class="handle ui-sortable-handle"> <i class="fa fa-ellipsis-v"></i> <i class="fa fa-ellipsis-v"></i> </span> <span class="text">'+areq[i].asset_type_img+' <i class="fa fa-angle-right" aria-hidden="true"></i></span> <span class="text">'+areq[i].source+'</span> <span class="text"><i class="fa fa-long-arrow-right"></i> '+areq[i].destination+'</span> <small class="label '+labl+'"><i class="fa fa-clock-o"></i> '+labltext+'</small> <div class="tools"> <i class="fa fa-eye"></i>'+delreq+'</div></li>');
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
    var opt_assets = $('#request_approval select#asset_id');
    var assets = asset_array.total_assets;
    var labl ='', labltext='';
    li_assets.empty();
    opt_assets.empty();
    //console.log(assets);
    for(var i=0; i< assets.length; i++){
        if( assets[i].assignedStatus==undefined || assets[i].assignedStatus==false ){
            labl = 'label-success';
            labltext = 'available';
            opt_assets.append('<option value="'+assets[i].asset_id+'">'+assets[i].assetInfo.asset_type+'</option>')
        }else{
            labl = 'label-warning';
            labltext = 'assigned';
        }
        li_assets.append('<li data-call="asset_view" data-id="'+assets[i].asset_id+'" data-type="'+assets[i].assetInfo.asset_type+'" data-destination="'+assets[i].assetInfo.destination+'" data-source="'+assets[i].assetInfo.source+'" data-status="'+labltext+'"><span class="handle ui-sortable-handle"> <i class="fa fa-ellipsis-v"></i> <i class="fa fa-ellipsis-v"></i> </span> <span class="text">'+assets[i].assetInfo.asset_type+' <i class="fa fa-angle-right" aria-hidden="true"></i></span> <span class="text">'+assets[i].assetInfo.source+'</span> <span class="text"><i class="fa fa-long-arrow-right"></i> '+assets[i].assetInfo.destination+'</span> <small class="label '+labl+'"><i class="fa fa-clock-o"></i> '+labltext+'</small> <div class="tools"> <i class="fa fa-eye"></i></div></li>');
        
    }
}

function loadDrivers(){
    var driver_li = $('#driver_list ul');
    driver_li.empty();
    var driver_opt = $('#driver_id');
    driver_opt.empty();
    //debugger;
    var drivers = driver_array;
    for(var i=0;i<drivers.length;i++){
        var assigneddata='', labl='label-danger', labltext='assigned';
        if(drivers[i].assigned_status===undefined || drivers[i].assigned_status==false ){
            driver_opt.append('<option value="'+ drivers[i].user_id +'">'+ drivers[i].username +'</option>');
            labl='label-success';
            labltext='available';
        }else{
            assigneddata ='data-request="'+drivers[i].request_id+'" data-asset="'+drivers[i].asset_id+'"';
        }
        driver_li.append('<li data-call="driver_view" data-id="'+drivers[i].user_id+'" data-contact="'+drivers[i].usercontact+'" data-name="'+drivers[i].username+'" data-password="'+drivers[i].userpassword+'" '+ assigneddata +'><span class="handle ui-sortable-handle"> <i class="fa fa-ellipsis-v"></i> <i class="fa fa-ellipsis-v"></i> </span> <span class="text">'+drivers[i].username+' <i class="fa fa-angle-right" aria-hidden="true"></i></span><small class="label '+labl+'"><i class="fa fa-clock-o"></i> '+labltext+'</small><div class="tools"> <i class="fa fa-eye"></i></div></li>')
    }
}

function loadData(user_type, user_id){
    var requests_check = 'owner/getRequests';
    var driver_check = 'owner/getUsers';
    var assets_check = 'owner/getAssets';
    var message_check = 'owner/getMessages';
    $.get(requests_check,{'_id':user_id})
        .done(function(data){
            if(data.length>0){
                var preq = data.filter(function(data) { return data.request_status === 'pending' });
                var areq = data.filter(function(data) { return data.request_status === 'approved' });
                request_array = {
                    'total_requests':data.length,
                    'pending_requests':preq.length,
                    'active_requests':areq.length,
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
    $.get(message_check,{'usertype':user_type})
        .done(function(data){
            if(data.length>0){
                console.log(data);
            }
        });
    $.get(driver_check,{'usertype':user_type})
        .done(function(data){
            if(data.length>0){
                var preq = data.filter(function(data) { return data.usertype === 'driver' });
                driver_array = preq;
                loadDrivers();
            }
        });
    $.get(assets_check,{'usertype':user_type})
        .done(function(data){
            if(data.length>0){
                var av_asset = data.filter(function(data) { return data.assignedStatus === false });//available assets
                var ci_asset = data.filter(function(data) { return data.assignedStatus === true });//Assets in use
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
    var approveRequest = 'owner/updateRequest';
    console.log(request);
    $.post(approveRequest,request)
    .done(function(data){
        if(data.type=='Request Updated'){
            if(data.request_status=='approved'){
                alert(data.message);
            }else{
                alert(data.message);
            }
            location.reload();
        }
    });
}

function driver(){
    if( $('#driver_view #id').val()==undefined || $('#driver_view input#id').val()==''){
        addDriver();
    }else{
        updateDriver();
    }
}

function addDriver(){
    var driverData = $('#driver_form').serialize();
    var addDriver = 'owner/addDriver';
    console.log(driverData);
    $.post(addDriver,driverData)
    .done(function(data){
        if(data.type=='Insert Success'){
            alert('New driver added');
            location.reload();
        }else{
            console.log(data);
        }
    });
}

function updateDriver(){
    var driverData = $('#driver_form').serialize();
    var addDriver = 'owner/updateDriver';
    console.log(driverData);
    $.post(addDriver,driverData)
    .done(function(data){
        if(data.type=='Update Success'){
            alert('Driver details updated');
            location.reload();
        }else{
            console.log(data);
        }
    });
}

function deleteDriver(){
    var driverData = $('#driver_form').serialize();
    var addDriver = 'owner/deleteDriver';
    console.log(driverData);
    $.post(addDriver,driverData)
    .done(function(data){
        if(data.type=='Delete Success'){
            alert('Driver removed from database');
            location.reload();
        }else{
            console.log(data);
        }
    });
}

function asset(){
    if( $('#asset_view input#id').val()==undefined || $('#asset_view input#id').val()=='' ){
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
        if(data.type=='Validation Error'){//validation error occurred
            alert(data.message);
        }else if(data.type=='Insert Success'){
            alert('Asset Added');
            clearContents('asset_view','asset_form');
            location.reload();
        }else{
            console.log(data);
            //clearContents('asset_view','asset_form');
        }
    });
}

function updateAsset(){
    var assetData = $('#asset_form').serialize();
    var addAsset = 'owner/updateAsset';
    console.log(assetData);
    $.post(addAsset,assetData)
    .done(function(data){
        if(data.type=='Validation Error'){//validation error occurred
            alert(data.message);
        }else if(data.type=='Update Success'){
            alert('Asset Updated');
            clearContents('asset_view','asset_form');
            location.reload();
        }else{
            console.log(data);
            //clearContents('asset_view','asset_form');
        }
    });
}

$(document).ready(function(){
    loadData('admin', 'abhinaya');
    bindcommands();
})