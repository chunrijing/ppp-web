window.onload=function(){
    window.alert=function(str){
        let _alertDom=$('.alert_model');

        if(_alertDom.length==0){
            let _html=`
            <div class="modal fade alert_model bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" >
                <div class="modal-dialog" role="document">
                    <div class="modal-content" style="width:480px;">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                    `+str+`
                    </div>
                    <div class="modal-footer">
                    </div>
                    </div>
                </div>
                </div>
                `
            let _dom=document.createElement('div');
            _dom.className='alert_layout';
            _dom.innerHTML=_html;

            $('body').append(_dom);
        }else{
            $(_alertDom).find('.modal-body').html(str);
        }

        $('.alert_model').modal()
            
    }
}