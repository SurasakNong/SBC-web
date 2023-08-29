//=================================== Constant ======================================================
//var u_reg = _get('mode'); //http://192.168.50.14:8092/iam/index.html?mode=221523126391103902
var ts = "";
var ts_code = "";
var ts_ok = 0;
//===== postDataUser_Api.gs =============
var urlUser = 'https://script.google.com/macros/s/AKfycbwauyQqwPmC8vJet8Qq0RMIGl-DZeP7135c_w5gzglhPb6ijaeS0KyP7FFRwdM-Rja1ug/exec';
var urlComm = 'https://script.google.com/macros/s/AKfycbxxsL_GhQ10sDH0CQJdvXLTIg9Wq84fGLk4mQU8nzSZ_mnXabc-ZK3Svt1RX8WTQC6o/exec';
var urlType = 'https://script.google.com/macros/s/AKfycbw0p_iGJUlpEYw6VvfktFIXM6_Kk9igzkvA8cXtDlTShOSsKLFBuOu0QQPpRG2zvjO6/exec';
var urlProduct = 'https://script.google.com/macros/s/AKfycbx6JwgRhwuJezs7B55rSgFOoomdZoaIM-JVrTxqQOWQoiEW8Ouo_zuyyQXQcS9CU0ffrw/exec';
var pic_noAvatar = 'images/user/avatar.png';
var pic_no = 'images/product/noimage.jpg';
var user = {
  id: 0,
  uname: 'Unknow',
  name: 'Unknow',
  email: '',
  pic: pic_noAvatar,
  lv: 'User'
}

var dT = {
  fmShot: '',
  toShot: '',
  fmTs: '',
  toTs: ''
}

var rowperpage = 10; //=== จำนวนแถวที่แสดงข้อมูลต่อหน้า
var page_selected = 1; //=== หน้าที่เลือก

//=================================== DATE TIME Function ============================================
function date_Now(st="") { //============================= วันที่ปัจจุบันสตริง
  var m = new Date();
  var dateString = "";
  
  if (st === "dmy") { //==== 14/06/2023 22:24:49
      dateString =
          ("0" + m.getDate()).slice(-2) + "/" +
          ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
          m.getFullYear() + " " +
          ("0" + m.getHours()).slice(-2) + ":" +
          ("0" + m.getMinutes()).slice(-2) + ":" +
          ("0" + m.getSeconds()).slice(-2);
  } else if (st === "mdy") {  //==== 06/14/2023 22:24:49
      dateString =
          ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
          ("0" + m.getDate()).slice(-2) + "/" +
          m.getFullYear() + " " +
          ("0" + m.getHours()).slice(-2) + ":" +
          ("0" + m.getMinutes()).slice(-2) + ":" +
          ("0" + m.getSeconds()).slice(-2);
  } else if (st === "ymd") {  //==== 2023/06/14 22:24:49
    dateString =
        m.getFullYear() + "/" +
        ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
        ("0" + m.getDate()).slice(-2) + " " +
        ("0" + m.getHours()).slice(-2) + ":" +
        ("0" + m.getMinutes()).slice(-2) + ":" +
        ("0" + m.getSeconds()).slice(-2);
  } else if (st === "y-m-d") {  //==== 2023-06-14
    dateString =
        m.getFullYear() + "-" +
        ("0" + (m.getMonth() + 1)).slice(-2) + "-" +
        ("0" + m.getDate()).slice(-2);
  } else {
      dateString = m.getTime(); //Time Stamp
  }
  return dateString;
}

function tsToDate(ts, fn = "dmy") { //================= Timestamp to Date
  var m = new Date(ts);
  var dateString = "";
  if (fn === "dmy") { //==== 14/06/2023 22:24:49
      dateString =
          ("0" + m.getDate()).slice(-2) + "/" +
          ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
          m.getFullYear() + " " +
          ("0" + m.getHours()).slice(-2) + ":" +
          ("0" + m.getMinutes()).slice(-2);/* + ":" +
          ("0" + m.getSeconds()).slice(-2);*/
  } else if (fn === "mdy") {  //==== 06/14/2023 22:24:49
      dateString =
          ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
          ("0" + m.getDate()).slice(-2) + "/" +
          m.getFullYear() + " " +
          ("0" + m.getHours()).slice(-2) + ":" +
          ("0" + m.getMinutes()).slice(-2) + ":" +
          ("0" + m.getSeconds()).slice(-2);
  } else if (fn === "ymd") {  //==== 2023/06/14 22:24:49
      dateString =
          m.getFullYear() + "/" +
          ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
          ("0" + m.getDate()).slice(-2) + " " +
          ("0" + m.getHours()).slice(-2) + ":" +
          ("0" + m.getMinutes()).slice(-2) + ":" +
          ("0" + m.getSeconds()).slice(-2);
  } else {
      dateString = ts; //Time Stamp
  }
  return dateString;
}

function mdyToTimestamp(strDate) { //====== mdyToTimestamp('02/13/2009 23:31:30') ==> Timestamp
  var datum = Date.parse(strDate);
  return datum;
}

function dmyToTimestamp(strDate) { //====== dmyToTimestamp('13/02/2009 23:31:30') ==> Timestamp
  let my_date = strDate.split(" ");
  let mdy_data = my_date[0].split("/");
  let tt = ((my_date[1] == '') || (my_date[1] == undefined))? "00:00:00": my_date[1];
  const dmy_data = mdy_data[1] + "/" + mdy_data[0] + "/" + mdy_data[2] + " " + tt;
  var datum = Date.parse(dmy_data);
  return datum;
}

function ymdToTimestamp(strDate) { //====== dmyToTimestamp('2009-02-13 23:31:30') ==> Timestamp
  let my_date = strDate.split(" ");
  let mdy_data = my_date[0].split("-");
  let tt = ((my_date[1] == '') || (my_date[1] == undefined))? "00:00:00": my_date[1];
  const dmy_data = mdy_data[1] + "/" + mdy_data[2] + "/" + mdy_data[0] + " " +tt;
  var datum = Date.parse(dmy_data);
  return datum;
}

function diffTimestamp(stT, enT, fn = "m") { //======== ผลต่างของเวลา Timestamp
  var dif_ts = enT - stT;
  var res = 0;
  if (fn === "s") { //แสดงเป็น วินาที
      res = dif_ts / (1000);
  } else if (fn === "m") { //แสดงเป็น นาที
      res = dif_ts / (1000 * 60);
  } else if (fn === "h") { //แสดงเป็น ชั่วโมง
      res = dif_ts / (1000 * 60 * 60);
  } else if (fn === "D") { //แสดงเป็น วัน
      res = dif_ts / (1000 * 60 * 60 * 24);
  } else {
      res = 0;
  }
  return res.toFixed() * 1;
}

function encode_ts() { //===============================เข้ารหัสรหัส
  // encode time
  const d_now = new Date();
  let a_now = d_now.getTime().toString();
  let arr_now = a_now.split("");
  let arr_sum = arr_now[0] * arr_now[1] * arr_now[2];
  for (let i = 3; i < arr_now.length; i++) {
      arr_sum = arr_sum + (+arr_now[i]);
  }
  arr_sum = ("000" + (arr_sum * 3)).slice(-3);
  let a_ran = Math.floor(Math.random() * 10);
  arr_now.push(a_ran);
  arr_now.push(arr_sum);
  let a_code = arr_now.join("");
  return a_code; // a_code = "16756746025315243"; 
}

function decode_ts(ts_code) { //========================== ถอดรหัส
  //let datain = "16756746025315243"; 
  //((1*6*7)+5+6+7+4+6+0+2+5+3+1)*3, 1675674602531 5 243 , 5 is random, 243 is code check
  let a_data = ts_code.split("");
  let a_sum = a_data[0] * a_data[1] * a_data[2]; //(1*6*7)
  //let ok_code = 0;
  for (let i = 3; i < a_data.length - 4; i++) { //(1*6*7)+5+6+7+4+6+0+2+5+3+1
      a_sum = a_sum + (+a_data[i]);
  }
  let val_ts = (ts_code.substr(ts_code.length - 3)) * 1;
  a_sum = a_sum * 3; //((1*6*7)+5+6+7+4+6+0+2+5+3+1)*3
  let a_time = [];
  for (let j = 0; j < a_data.length - 4; j++) { //1675674602531
      a_time.push(a_data[j]);
  }
  let ok_code = (a_sum == val_ts) ? 1 : 0; // 243
  let result = [];
  result.push(a_time.join("")); //time stamp 1675674602531
  result.push(a_sum); // ผลรวมเลขตรวจสอบ 243
  result.push(ok_code); // 0=ไม่ถูกต้อง, 1=ถูกต้อง
  return result;
}


function haveTime(tt) { //===================== เวลาเหลือคิดจาก Timestamp
  const t_now = new Date();
  const t_taget = 10 * 60; // second
  time_now = Math.floor(t_now.getTime() / 1000);
  let tt2 = Math.floor(tt / 1000);
  let diff_sec_all = time_now - tt2;

  let diff_min = Math.floor(diff_sec_all / 60)
  let diff_sec = diff_sec_all - (diff_min * 60);
  let res = (diff_sec_all > t_taget) ? false : true;
  let result = [((t_taget / 60) - (diff_min + 1)), (60 - (diff_sec + 1)), res];
  return result
}
//===================== Function Access ==============================================================


//var _get = function (val) {  //=============== ฟังก์ชัน GET()
function _get(val){
  tmp = []; // กำหนดตัวแปรเก็บค่า เป็น array
  // เก็บค่า url โดยตัด ? อันแรกออก แล้วแยกโดยตัวแบ่ง &
  var items = location.search.substr(1).split("&");
  for (var index = 0; index < items.length; index++) { // วนลูป
    tmp = items[index].split("="); // แยกระหว่างชื่อตัวแปร และค่าของตัวแปร
    // ถ้าค่าที่ส่งมาตรวจสอบชื่อตัวแปรตรง ให้เก็บค่าผลัพธ์เป็นค่าของตัวแปรนั้นๆ
    //if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
    result = (tmp[0] === val) ? tmp[1] : null;
  }
  return result;  // คืนค่าของตัวแปรต้องการ ถ้าไม่มีจะเป็น null
}

function serializeObject() { //============= function to make form values to json format
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || "");
    } else {
      o[this.name] = this.value || "";
    }
  });
  return o;
};

function setCookie(cname, cvalue, exdays) { //================== function to set cookie
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {  //==================================== get or read cookie
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }

    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

//=========================== Alert Warning ============================================================
function myAlert(icon, title) {
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

function sw_Alert(icon, title, desc) {
  Swal.fire({
      customClass: {
          confirmButton: 'mybtn btnOk'
          //confirmButton: 'btn btn-primary'
      },

      buttonsStyling: false,
      icon: icon,
      title: title,
      text: desc,
      showClass: {
          popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
      }
  })
}

// show alert mini with time 2.3 sec
function Signed(icon, title) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    width: '16rem',
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

// sho alert icon title desc and buttom Confirm
function swalertshow(icon, title, desc) {
  Swal.fire({
    customClass: {
      confirmButton: 'btn button primary-button'
    },

    buttonsStyling: false,
    icon: icon,
    title: title,
    text: desc,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  })
}

function ckCode_alert(title, desc) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: desc,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('Confirmed');
    }
    window.location.replace(home);
  })
}

function to_alert(icon, title, desc) {
  Swal.fire({
    icon: icon,
    title: title,
    text: desc,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('Confirmed');
    }
  })
}

//============================= Encode and Decode Data ========================================================
function deCodeMode(mode) {
  var result = [];
  if ((mode != '') && (isNumber(mode))) {
    let n_mode = mode.length;
    let n1 = mode.substr(n_mode - 2, 2) * 1;
    let n2 = mode.substr(n_mode - 2 - n1 - 2, 2) * 1;
    let endtime = mode.substr(n_mode - 2 - n1 - 2 - n2, n2);
    let nowtime = new Date().getTime();
    let id = mode.substr(n_mode - 2 - n1, n1) * 1;
    let date = new Date(endtime * 1000);
    let ck_sum = mode.substr(0, 2) * 1;
    let sumT = 0;
    for (var i = 0; i < 6; i++) {
      sumT = sumT + (endtime.substr(endtime.length - 6 + i, 1) * 1);
    }

    if (ck_sum == sumT) {
      if (endtime > (nowtime / 1000)) {
        result[0] = '1';
        result[1] = endtime;  //end timestamp
        result[2] = date;  //datetime format
        result[3] = id; //id
        result[9] = 'OK';
        result[8] = (nowtime / 1000);
      } else {
        result[0] = '4';
        result[9] = 'Value is Expire';
      }

    } else {
      result[0] = '3';
      result[9] = 'Invalid value of sum check';
    }

  } else {
    result[0] = '2';
    result[9] = 'Invalid value';
  }
  return result;
}


//==========================================================================================================
function pagination_show_old(shopid, page, pageall, per, fn) { //============== แสดงตัวจัดการหน้าข้อมูล Pagination      
  let max_p = parseInt(pageall);
  let p = parseInt(page);
  let p_prev = (p > 1) ? p - 1 : 1;
  let p_next = (p < max_p) ? p + 1 : max_p;
  let pag_h = `<div class="pagination justify-content-center">`;
  let pag_prev = `<a href="#" id="pag_prev" onclick=` + fn + `(` + shopid + `,` + per + `,` + p_prev + `)>&laquo;</a>`;
  let pag_in = "";
  let h2 = 0;
  let h1 = 0;
  if (max_p <= 7) {
    let act = "";
    for (var j = 1; j <= max_p; j++) {
      act = (p == j) ? "class='active' " : "";
      pag_in += `<a href="#" ` + act + ` onclick=` + fn + `(` + shopid + `,` + per + `,` + j + `)>` + j + `</a> `;
    }
  } else {
    if (p < 5) {  //เลือกหน้าที่น้อยกว่าหน้าที่ 5
      for (var k = 1; k <= p + 2; k++) {
        act = (p == k) ? "class='active' " : "";
        pag_in += `<a href="#" ` + act + ` onclick=` + fn + `(` + shopid + `,` + per + `,` + k + `)>` + k + `</a> `;
      }
      h2 = Math.ceil((4 + max_p - 1) / 2);
      pag_in += `<a href="#" onclick=` + fn + `(` + shopid + `,` + per + `,` + h2 + `)>...</a> `;
      pag_in += `<a href="#" onclick=` + fn + `(` + shopid + `,` + per + `,` + (max_p - 1) + `)>` + (max_p - 1) + `</a> `;
      pag_in += `<a href="#" onclick=` + fn + `(` + shopid + `,` + per + `,` + (max_p) + `)>` + (max_p) + `</a> `;

    } else if (p > (max_p - 4)) { //เลือกหน้าที่ก่อนถึงหน้าสุดท้าย อยู่ 4 หน้า
      h1 = Math.ceil((2 + max_p - 3) / 2);
      pag_in += `<a href="#" onclick=` + fn + `(` + shopid + `,` + per + `,'1')>1</a> `;
      pag_in += `<a href="#" onclick=` + fn + `(` + shopid + `,` + per + `,'2')>2</a> `;
      pag_in += `<a href="#" onclick=` + fn + `(` + shopid + `,` + per + `,` + h1 + `)>...</a> `;
      for (var m = (p - 2); m <= max_p; m++) {
        act = (p == m) ? "class='active' " : "";
        pag_in += `<a href="#" ` + act + ` onclick=` + fn + `(` + shopid + `,` + per + `,` + m + `)>` + m + `</a> `;
      }

    } else { //เลือกหน้าที่อยู่ระหว่างหน้าที่ 5 และก่อนถึงหน้าสุดท้ายอยู่ 4 หน้า
      h1 = Math.ceil((p - 2) / 2);
      h2 = Math.ceil((p + 2 + max_p) / 2);
      pag_in += `<a href="#" onclick=` + fn + `(` + shopid + `,` + per + `,'1')>1</a> `;
      pag_in += `<a href="#" onclick=` + fn + `(` + shopid + `,` + per + `,` + h1 + `)>...</a> `;

      for (var k = (p - 2); k <= p + 2; k++) {
        act = (p == k) ? "class='active' " : "";
        pag_in += `<a href="#" ` + act + ` onclick=` + fn + `(` + id + `,` + per + `,` + k + `)>` + k + `</a> `;
      }
      pag_in += `<a href="#" onclick=` + fn + `(` + shopid + `,` + per + `,` + h2 + `)>...</a> `;
      pag_in += `<a href="#" onclick=` + fn + `(` + shopid + `,` + per + `,` + (max_p) + `)>` + (max_p) + `</a> `;
    }
  }
  let pag_next = `<a href="#" id="pag_next" onclick=` + fn + `(` + shopid + `,` + per + `,` + p_next + `)>&raquo;</a></div>`;
  $("#pagination").html(pag_h + pag_prev + pag_in + pag_next);
}

function dataGetbyId_val(id) {
    return (document.getElementById(id).value == 'undefined') ? '' : document.getElementById(id).value;
}