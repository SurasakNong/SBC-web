//jquery-click-scroll
//by syamsul'isul' Arifin

var sectionArray = [1, 2, 3, 4, 5];

$.each(sectionArray, function(index, value){
          
     $(document).scroll(function(){
         var offsetSection = $('#' + 'section_' + value).offset().top - 0;
         var docScroll = $(document).scrollTop();
         var docScroll1 = docScroll + 1;
         
        
         if ( docScroll1 >= offsetSection ){
             $('#sidebarMenu .nav-link').removeClass('active');
             $('#sidebarMenu .nav-link:link').addClass('inactive');  
             $('#sidebarMenu .nav-item .nav-link').eq(index).addClass('active');
             $('#sidebarMenu .nav-item .nav-link').eq(index).removeClass('inactive');
         }
         
     });
    
    $('.click-scroll').eq(index).click(function(e){
        var offsetClick = $('#' + 'section_' + value).offset().top - 0;
        e.preventDefault();
        $('html, body').animate({
            'scrollTop':offsetClick
        }, 300)
    });
    
});

$(document).ready(function(){
    $('#sidebarMenu .nav-item .nav-link:link').addClass('inactive');    
    $('#sidebarMenu .nav-item .nav-link').eq(0).addClass('active');
    $('#sidebarMenu .nav-item .nav-link:link').eq(0).removeClass('inactive');
	
});


$(document).on("click", "#btn_submit", function () { 
		const d_dt = date_Now();
		const d_nm = document.getElementById('opt_nm').value;
		const d_tl = document.getElementById('opt_tl').value;
    const d_em = document.getElementById('opt_em').value;
		const d_cm = document.getElementById('opt_cm').value;
    if(!emailValidate("opt_em") && d_em != ""){
      sw_Alert("warning","ข้อมูลอีเมลไม่ถูกต้อง!","กรุณา กรอกข้อมูลอีเมล์ให้ถูกต้อง ขอบคุณครับ");	
      return false
    }    
    if(d_nm == '' || (d_tl == '' && d_em == '') || d_cm == ''){
      sw_Alert("warning","ข้อมูลไม่ครบถ้วน!","กรุณา กรอกข้อมูลในแบบฟอร์มให้ครบ ขอบคุณครับ");	
    }else{          
      $.ajax({ 
        url: urlComm,
        type: 'GET',
      crossDomain: true,
        data : { opt_k: 'add', opt_dt: d_dt, opt_nm : d_nm, opt_tel : d_tl, opt_em : d_em, opt_comm : d_cm },
        success: function(response){
          console.log("The server says: " + response);
      document.getElementById("bb-booking-form").reset();
      sw_Alert("success","ส่งความคิดเห็น สำเร็จ","ขอขอบคุณสำหรับความคิดเห็นของท่าน แล้วเราจะติดต่อกลับในไม่ช้า");		
        },
      error: function(err){
      console.log("The server  ERROR says: " + err);
      }
      });
    }
  });
  	

function emailValidate(id) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const email = $("#"+id).val();
  if (re.test(email)) {
    return true;
  }      
  return false;  
}