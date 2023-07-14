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
		const d_dt = dateNow("dmy");
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
      var dataIn = '?opt_k=add_comment&opt_dt='+d_dt+'&opt_nm='+d_nm+'&opt_tl='+d_tl+'&opt_em='+d_em+'&opt_cm='+d_cm;
      //console.log(dataIn);  
          
      $.ajax({ 
        url: 'https://script.google.com/macros/s/AKfycbxntINerfC92GRPEpC03tO4knSDUXOzmnAXtgFdl4R8jNwJ5zK0UnSV5nzb3gjm9JRQJg/exec' ,
        type: 'GET',
      crossDomain: true,
        data : { opt_k: 'add', opt_dt: d_dt, opt_nm : d_nm, opt_tl : d_tl, opt_em : d_em, opt_cm : d_cm },
        success: function(response){
          console.log("The server says: " + response);
      document.getElementById("bb-booking-form").reset();
      sw_Alert("success","ส่งความคิดเห็น สำเร็จ","เราได้รับความคิดเห็นของท่านแล้ว เราจะติดต่อกลับในไม่ช้า ขอบคุณครับ");		
        },
      error: function(err){
      console.log("The server  ERROR says: " + err);
      }
      });
    }
  });
  	

function dateNow(st){ //======= วันที่ปัจจุบันสตริง
  var m = new Date();
  var dateString = "";
  if(st === "dmy"){ //==== 14/06/2023 22:24:49
    dateString = 
    ("0" + m.getDate()).slice(-2)+"/" + 
    ("0" + (m.getMonth()+1)).slice(-2)+"/" +
    m.getFullYear() + " " +
    ("0" + m.getHours()).slice(-2) + ":" +
    ("0" + m.getMinutes()).slice(-2) + ":" +
    ("0" + m.getSeconds()).slice(-2);
  }else if(st === "mdy"){  //==== 06/14/2023 22:24:49
    dateString =
    ("0" + (m.getMonth()+1)).slice(-2)+"/" +
    ("0" + m.getDate()).slice(-2)+"/" +   
    m.getFullYear() + " " +
    ("0" + m.getHours()).slice(-2) + ":" +
    ("0" + m.getMinutes()).slice(-2) + ":" +
    ("0" + m.getSeconds()).slice(-2);
  }else if(st === "ymd"){  //==== 2023/06/14 22:24:49
    dateString =
    m.getFullYear() + "/" +
    ("0" + (m.getMonth()+1)).slice(-2) + "/" +
    ("0" + m.getDate()).slice(-2) + " " +
    ("0" + m.getHours()).slice(-2) + ":" +
    ("0" + m.getMinutes()).slice(-2) + ":" +
    ("0" + m.getSeconds()).slice(-2);  
    
  }else{
    dateString = m.getTime(); //Time Stamp
  }
  return dateString;
}

function myAlert(icon,title) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        width: '330px',
        showConfirmButton: false,
        timer: 2300,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast.fire({
        icon: icon, //'success'
        title: title  //'Signed in successfully'
    })

}

function sw_Alert(icon,title,desc) {           
    Swal.fire({
      customClass: {
      confirmButton: 'btn btn-primary'
      },
      
  buttonsStyling: false,
    icon: icon,
    title: title,
    text: desc,
    showClass: {
        popup: 'animate__animated animate__zoomIn' 
    },
    hideClass: {
        popup: 'animate__animated animate__zoomOut'
    }
    })
}


function emailValidate(id) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const email = $("#"+id).val();
  if (re.test(email)) {
    return true;
  }      
  return false;  
}