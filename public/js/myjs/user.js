/*===============================  การจัดการผู้ใช้งาน =================================*/

$(document).on("submit", "#login_form", function () {
  //======= ทำการเข้าสู่ระบบ
  waiting();
  var my_form = $(this);
  var username = document.getElementById("inputUsername").value;
  var pass = document.getElementById("inputPassword").value;
  let ts_now = date_Now();
  $.ajax({
      url: urlUser,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'login', opt_un: username, opt_pw: pass, opt_dt: ts_now },
      success: function (result) {
          const obj = JSON.parse(JSON.stringify(result))[0];
          waiting(false);
          if (obj.result == true) {
              Object.assign(user, {
                  id: obj.id,
                  uname: obj.uname,
                  name: obj.name == "" || obj.name == "undefined" ? "Unknow" : obj.name,
                  email: obj.email,
                  pic: obj.picUrl == "" || obj.picUrl == "undefined" ? pic_noAvatar : obj.picUrl,
                  lv: obj.lv
              });
              showSetting();
          } else {
              sw_Alert(
                  "warning",
                  "เข้าสู่ระบบไม่สำเร็จ",
                  "ชื่อ หรือ รหัสผ่านไม่ถูกต้อง"
              );
              my_form.find("input[type=password]").val("");
          }
      },
      error: function (err) {
          console.log("The server  ERROR says: " + err);
      }
  });
  return false;
});

$(document).on("click", "#user_mng", function () {
    page_selected = 1;
    is_sort = true;
    col_sort = 1;
    raw_sort = 0;
    show_manageuser_tb();    
});

function show_home() { //========================== แสดงหน้าหลัก  
  var html = `
  <div class="container-fluid">
    <div class="row mt-3">                
      <h1>Surasak Iamserm </h1>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus et aut labore esse delectus fuga beatae,
        consequuntur id ratione expedita voluptatibus at sapiente officiis. Veniam et officiis temporibus sit
        deserunt?</p>
    </div>
  </div>
    `;
  $("#main_setting").html(html);
  document.getElementById("pic_user").src = user.pic;
  document.getElementById('pic_user').setAttribute('title', user.name+' ('+user.uname+')');
  console.log("Hello");
  //console.log(user);
}

function show_manageuser_tb() { //========================== แสดงค้นหา และปุ่มเพิ่ม หมวดรายการ
    var html = `
    <div class="container-fluid">
      <div class="row">                
          <div class="col-lg-10 mx-auto mt-4">
              <label class="fn_name" ><i class="fa-solid fa-user fa-lg"></i> &nbsp; ผู้ใช้งาน</label>
              <form id="fmsearch_user" >
                  <div class="input-group mb-2">
                      <input type="text" id="search_user" onkeypress="handle_userSearch(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search">
                      <button class="b-success" type="button" id="bt_search_user" title="ค้นหา"><i class="fas fa-search"></i></button>
                      <button class="b-add ms-2" id="bt_add_user" type="button" title="เพิ่มข้อมูล"><i class="fa-solid fa-user-plus fa-lg"></i></button>
                      <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                  </div>
              </form> 
          </div>          
      </div>   
      <div class="row">  
          <div class="col-lg-7 col-md-9 col-sm-12 mx-auto" id="add_user"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="edit_user"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-10 mx-auto" id="table_user"></div>
      </div>
    </div>
      `;
    $("#main_setting").html(html);
    loadDataUser();
}

function loadDataUser(show = true) {
  if(show === true) waiting();
  $.ajax({
      url: urlUser,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'readAll'},
      success: function (result) {
          dataAllShow = result;
          if(show === true) showUserTable(rowperpage, page_selected); //<<<<<< แสดงตาราง rowperpage,page_sel   
          waiting(false);
      },
      error: function (err) {
          console.log("The server  ERROR says: " + err);
      }
  });
}

function myUserData(shText = "", colSort = 0, isSort = false, rawSort = 0, page = 1, perPage = 10) {
  const search_str = shText.toLowerCase().split(",");
  if (isSort == true) sortByCol(dataAllShow, colSort, rawSort); //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
  let array_Arg = new Array();
  for (let i = 0; i < dataAllShow.length; i++) {
    const condition = search_str.some(el => dataAllShow[i][1].includes(el));  //กรองชื่อ
    const condition2 = search_str.some(el => dataAllShow[i][3].includes(el)); //UserName
    const condition3 = search_str.some(el => dataAllShow[i][2].includes(el)); //Email
    if (condition || condition2 || condition3) {
      let jsonArg = new Object();
      jsonArg.id = dataAllShow[i][0];
      jsonArg.name = dataAllShow[i][1];
      jsonArg.email = dataAllShow[i][2];
      jsonArg.uname = dataAllShow[i][3];
      jsonArg.lv = dataAllShow[i][5];
      jsonArg.urlpic = dataAllShow[i][6];
      jsonArg.dtlog = dataAllShow[i][7];
      array_Arg.push(jsonArg);
    }
  }
  let nAllData = array_Arg.length;         //==จำนวนข้อมูลทั้งหมด
  let nAllPage = Math.ceil(nAllData / perPage); //=== จำนวนหน้าทั้งหมด
  let rowStart = ((page - 1) * perPage); //=== แถวเริ่มต้น ((page-1)*perpage)+1
  let rowEnd = (rowStart + +perPage) - 1;         //=== แถวสุดท้าย rowStart + perpage - 1

  let array_Data = new Array();
  for (let i = rowStart; i <= rowEnd; i++) {
    if (array_Arg[i] != null) {
      array_Data.push(array_Arg[i]);
    }
  }
  let pageAll = new Object();
  pageAll.page = nAllPage;
  pageAll.rec = nAllData;
  pageAll.st = rowStart;
  pageAll.en = rowEnd;
  array_Data.push(pageAll);
  return array_Data;
}

function clsUseShow(){
  $("#add_user").html("");
  $("#edit_user").html("");
  $("#table_user").html("");

}

$(document).on('click', "#bt_search_user", function () {  //ค้นหารายการ
    showUserTable(rowperpage, 1);
});

function handle_userSearch(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        showUserTable(rowperpage, 1);
    }
}

function showUserTable(per=10, p=1, colSort=1, isSort=true, rawSort=0) { //======================== แสดงตาราง  
  var strSearch = document.getElementById('search_user').value;
  var n = ((p - 1) * per);
  const myArr = myUserData(strSearch, colSort, isSort, rawSort, p, per);
  let page_all = myArr[myArr.length - 1].page;
  let rec_all = myArr[myArr.length - 1].rec;
  page_selected = (p >= page_all) ? page_all : p;
  is_sort = isSort;
  col_sort = colSort;
  raw_sort = rawSort;
  let on_clk = ['','','','','','','','']; 
  let sortTxt = ['','','','','','','',''];  
  for(let j=0; j < on_clk.length; j++){
    if(j == colSort){
        if(rawSort == 0){
            on_clk[j] = 'showUserTable(rowperpage,1,'+j+',true,1);';
            sortTxt[j] = '<i class="fa-solid fa-sort-up"></i>';
            
        }else{
            on_clk[j] = 'showUserTable(rowperpage,1,'+j+',true,0);';
            sortTxt[j] = '<i class="fa-solid fa-sort-down"></i>';
        }        
    }else{
        on_clk[j] = 'showUserTable(rowperpage,1,'+j+',true,0);';
        sortTxt[j] = '<i class="fa-solid fa-sort"></i>';
    }
  }
  var tt = `
        <table class="list-table table animate__animated animate__fadeIn" id="usertable" >
          <thead>
            <tr>
              <th class="text-center" style="width:5%">ลำดับ</th> 
              <th class="text-left sort-hd" onclick="`+on_clk[1]+`">`+sortTxt[1]+`&nbsp; ชื่อ-สกุล</th>
              <th class="text-left sort-hd" onclick="`+on_clk[3]+`">`+sortTxt[3]+`&nbsp; UserName</th>
              <th class="text-left sort-hd" onclick="`+on_clk[2]+`">`+sortTxt[2]+`&nbsp; อีเมล</th>
              <th class="text-left sort-hd" onclick="`+on_clk[5]+`">`+sortTxt[5]+`&nbsp; Level</th>
              <th class="text-left sort-hd" onclick="`+on_clk[7]+`">`+sortTxt[7]+`&nbsp; วันเข้าระบบ</th>
              <th class="text-center">แก้ไข&nbsp;&nbsp;&nbsp;ลบ</th>                
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table> 
          <div class="row animate__animated animate__fadeIn">
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem;">
              <label  for="rowShow_user">แถวแสดง:</label>
              <input type="number" id="rowShow_user" name="rowShow_user" min="1" max="99" step="1" value="" style="text-align:center;">
            </div>
            <div class="col-sm-6 mb-2">
              <div id="pagination"></div>
            </div>
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem; text-align:right;">
              <label id="record"></label>
            </div>
          </div>                     
        `;
  $("#table_user").html(tt);
  document.getElementById("rowShow_user").value = rowperpage.toString();
  document.getElementById("record").innerHTML = "ทั้งหมด : " + rec_all + " รายการ";
  for (let i = 0; i < myArr.length - 1; i++) {
    n++;
    listuserTable(myArr[i], n);
  }
  pagination_show(p, page_all, rowperpage, 'showUserTable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
}

$(document).on("change", "#rowShow_user", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
    rowperpage = +$("#rowShow_user").val();
    showUserTable(rowperpage, 1);
});

function listuserTable(ob, i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางประเเภท
    let tableName = document.getElementById('usertable');
    let prev = tableName.rows.length;
    let row = tableName.insertRow(prev);
    row.id = "row" + ob.id;
    row.style.verticalAlign = "top";
    //row.style.height = "50px";
    /*let txtDel = `<i class="fas fa-trash-alt" style="cursor:not-allowed; color:#939393;"></i>`;
    if(u_level == "0"){*/
    txtDel = `<i class="fas fa-trash-alt" onclick="delete_user_Row(` + ob.id + `)" style="cursor:pointer; color:#d9534f;"></i>`;
    //}
    let n_col = 7;
    let col = [];
    for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
    }
    col[0].innerHTML = `<div id="no" class="text-center">` + i_no + `</div>`;
    col[1].innerHTML = `<div id="name` + ob.id + `" class="text-left">` + ob.name + `</div>`;
    col[2].innerHTML = `<div id="uname` + ob.id + `" class="text-left">` + ob.uname + `</div>`;
    col[3].innerHTML = `<div id="email` + ob.id + `" class="text-left">` + ob.email + `</div>`;
    col[4].innerHTML = `<div id="level` + ob.id + `" class="text-left">` + ob.lv + `</div>`;
    col[5].innerHTML = `<div id="dtlog` + ob.id + `" class="text-left">` + tsToDate(+ob.dtlog) + `</div>`;
    col[n_col - 1].innerHTML = `
      <input type="hidden" id="id_user` + ob.id + `" value="` + ob.id + `" />
      <input type="hidden" id="u_urlpic` + ob.id + `" value="` + ob.urlpic + `" />
      
      <i class="fas fa-edit me-3" onclick="edit_user_Row(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
      `+ txtDel;
    col[n_col - 1].style = "text-align: center;";
}

$(document).on("click", "#bt_add_user", function () { //========== เปิดเพิ่มผู้ใช้งาน
  clsUseShow();
  var html = `     
    <div id="user_add" class="main_form">    
      <form class="animate__animated animate__fadeIn" id="add_user_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;">
            เพิ่มผู้ใช้งาน
          </div>     
        </div> 
        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-user"></i></span>
              <input type="text" id="name_user" class="form-control" placeholder="ชื่อ-นามสกุล" aria-label="Fullname" required>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" ><i class="fa-regular fa-envelope"></i></span>
              <input type="email" id="email_user" class="form-control" placeholder="อีเมล" aria-label="Email">
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-regular fa-user"></i></span>
              <input type="text" id="userName" class="form-control" placeholder="User Name" aria-label="User Name" required>
            </div>
            <div class="input-group mb-4">
              <label class="input-group-text" for="selPos"><i class="fa-solid fa-briefcase"></i></label>
              <select class="form-select" id="selLv">
                <option selected value="0">-- ระดับ --</option>
                <option value="1">Admin</option>
                <option value="2">User</option>
              </select>
            </div>            
          </div>
          
        </div>   
        <div class="row justify-content-center" style="text-align: center;">
          <button type="submit" class="mybtn btnOk">บันทึก</button>
          <button type="button" class="mybtn btnCan" id="cancel_add_user">ยกเลิก</button>
        </div>             
        
      </form>
    </div>  
    `;
  $("#add_user").html(html);
});

$(document).on("click", "#cancel_add_user", function () { //========== ยกเลิกการเพิ่มผู้ใช้งาน
  clsUseShow();
  showUserTable(rowperpage, page_selected);
});

$(document).on("submit", "#add_user_form", function () {  //===== ตกลงเพิ่มผู้ใช้งาน  
    let my_form = $(this);
    const name_user = my_form.find("#name_user").val();
    const email_user = my_form.find("#email_user").val();
    const uName = my_form.find("#userName").val();
    const sel_lv_index = document.getElementById("selLv").selectedIndex;
    const sel_lv = (sel_lv_index == 0)?"User":document.getElementById("selLv").options[sel_lv_index].text;
    const dt_create = date_Now();
    waiting();
    $.ajax({
      url: urlUser,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'add', opt_nm:name_user, opt_em:email_user, 
      opt_un:uName, opt_pw:"123456", opt_lv:sel_lv, opt_dt:dt_create},
      success: function (result) {
        waiting(false);
        if(result == "success"){
          myAlert("success", "เพิ่มผู้ใช้งาน สำเร็จ");
          $("#add_user").html("");
          loadDataUser();
        }else if(result == "exits"){
          sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', uName + ' ซ้ำ! มีการใช้ชื่อนี้แล้ว');
        }else{
          sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }          
      },
      error: function (err) {
          console.log("Add new user ERROR : " + err);
      }
    });
    return false;
});

function delete_user_Row(id) { //================================ ลบข้อมูลผู้ใช้งาน
    var user_name = document.getElementById('name' + id).innerHTML + ' (' + document.getElementById('uname' + id).innerHTML + ')';
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'mybtn btnOk',
            cancelButton: 'mybtn btnCan'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'ลบ ' + user_name,
        text: "โปรดยืนยัน ตกลงหรือไม่ ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '&nbsp;&nbsp;ตกลง&nbsp;&nbsp;',
        cancelButtonText: '&nbsp;&nbsp;ไม่&nbsp;&nbsp;',
        reverseButtons: false
    }).then((result) => {
        if (result.isConfirmed) {
            waiting();
            $.ajax({
              url: urlUser,
              type: 'GET',
              crossDomain: true,
              data: { opt_k:'del', opt_id:id },
              success: function (result) {
                waiting(false);
                if(result == "success"){
                  myAlert("success", "ข้อมูลถูกลบแล้ว !");
                  loadDataUser();
                }else{
                  sw_Alert('error', 'ลบข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
                }          
              },
              error: function (err) {
                  console.log("Delete user ERROR : " + err);
              }
            });         
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            /*swalWithBootstrapButtons.fire(
                'ยกเลิก',
                'ข้อมูลของคุณยังไม่ถูกลบ :)',
                'error'
            )*/
        }
    })
}

function edit_user_Row(id) { //================================ เปิดหน้าแก้ไขข้อมูลผู้ใช้งาน      
  var html = `     
  <div id="user_edit" class="main_form">    
    <form class="animate__animated animate__fadeIn" id="edit_user_form" style="padding:20px;">
      <div class="row mb-3 justify-content-md-center">
        <div style="font-size:1.5rem; text-align: center;">
          แก้ไขข้อมูลผู้ใช้งาน
        </div>     
      </div> 
      <div class="row mb-3 justify-content-center" style="position: relative;">
        <img id="picuser" src="" alt="Avatar" style="width:150px; border-radius:50%;">  
        <label class="camera" for="upload_picUser" title="อัพโหลดรูปใหม่">
          <i class="fa-solid fa-camera"></i>  
          <input type="file" id="upload_picUser" style="display:none" accept="image/*">
        </label>
        <label class="resetPass" title="รีเซ็ทรหัสผ่าน" id="resetpass">
        <i class="fa-solid fa-rotate-left"></i>
        </label>
      </div> 
      <div class="row">        
        <div class="col-md">
          <div class="input-group mb-2">
            <span class="input-group-text" ><i class="fa-solid fa-user"></i></span>
            <input type="text" id="name_user" class="form-control" placeholder="ชื่อ-นามสกุล" aria-label="Fullname" required>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" ><i class="fa-regular fa-envelope"></i></span>
            <input type="email" id="email_user" class="form-control" placeholder="อีเมล" aria-label="Email">
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text" ><i class="fa-regular fa-user"></i></span>
            <input type="text" id="userName" class="form-control" placeholder="User Name" aria-label="User Name" required>
          </div>
          <div class="input-group mb-4">
            <label class="input-group-text" for="selLv"><i class="fa-solid fa-briefcase"></i></label>
            <select class="form-select" id="selLv">
             <!-- <option selected value="0">-- ระดับ --</option> -->
              <option value="1">Admin</option>
              <option value="2">User</option>
            </select>
          </div> 
          <div class="row justify-content-center" style="text-align: center;">
              <button type="submit" class="mybtn btnOk">บันทึก</button>
              <button type="button" class="mybtn btnCan" id="cancel_edit_user">ยกเลิก</button>
              <input id="id_user" type="hidden">
              <input id="url_PicUser" type="hidden">
          </div>
        </div>
      </div>       
    </form>
  </div>  
  `;
  $("#edit_user").html(html);
  $("#id_user").val(id);
  $('#selLv option').each(function () {
    if ($(this).text() == $("#email_user").val(document.getElementById('level' + id).innerHTML)  ) {
        $(this).prop("selected", true);
    }
  });
  var picUser = (document.getElementById('u_urlpic' + id).value == '' || document.getElementById('u_urlpic' + id).value == 'undefined') ? pic_noAvatar : document.getElementById('u_urlpic' + id).value;
  document.getElementById("picuser").src = picUser;
  $("#url_PicUser").val(picUser);
  $("#name_user").val(document.getElementById('name' + id).innerHTML);
  $("#email_user").val(document.getElementById('email' + id).innerHTML);  
  $("#userName").val(document.getElementById('uname' + id).innerHTML);  
  $("#table_user").html("");
}

$(document).on("click", "#cancel_edit_user", function () { //========== ยกเลิกการแก้ไขผู้ใช้งาน
  clsUseShow();
  showUserTable(rowperpage, page_selected);
});

$(document).on("change", "#upload_picUser", function (e) {
  if (e.target.files) {
    waiting();
    var n_file = document.getElementById('id_user').value + '-' + document.getElementById('userName').value;
    var idUser = document.getElementById('id_user').value;
    let imageFile = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = document.createElement("img");
      img.onload = function (event) {
        waiting();
        var c = document.createElement('canvas'),
          ctx = c.getContext("2d");
        var canvas = document.createElement('canvas'),
          ctx_s = canvas.getContext("2d");
        const width = 250;
        const height = 250;
        if (img.width < img.height) { // สูง
          var co = {
            co_w: img.width,
            co_h: img.width,
            co_x: 0,
            co_y: Math.floor((img.height - img.width) / 2)
          }
        } else if (img.width > img.height) { // กว้าง
          var co = {
            co_w: img.height,
            co_h: img.height,
            co_x: Math.floor((img.width - img.height) / 2),
            co_y: 0
          }
        } else { // ด้านเท่ากัน
          var co = {
            co_w: img.height,
            co_h: img.width,
            co_x: 0,
            co_y: 0
          }
        }
        c.width = co.co_w;
        c.height = co.co_h;
        ctx.drawImage(img, co.co_x, co.co_y, co.co_w, co.co_h, 0, 0, co.co_w, co.co_h);
        canvas.width = width;
        canvas.height = height;
        ctx_s.drawImage(c, 0, 0, width, height);
        var dataurl = canvas.toDataURL(imageFile.type);
        //document.getElementById("preview").src = dataurl;
        const vals = dataurl.split(',')[1];
        var urlPicUser = document.getElementById('url_PicUser').value;
        var id_pic_del = (urlPicUser.includes("id=")) ? urlPicUser.split('id=')[1] : '';
        const obj = {
          opt_k: "upUserPic",
          idUser: idUser,
          fName: n_file,
          fileId: id_pic_del,
          fileName: imageFile.name,
          mimeType: imageFile.type,
          fdata: vals
        }
        fetch(urlUser, {
          method: "POST",
          body: JSON.stringify(obj)
        })
          .then(function (response) {
            return response.text()
          }).then(function (data) {
            let res = JSON.parse(data);
            if (res.result == "success") {
              loadDataUser(false);
              const fullIdPic = linkPic(res.id,pic_noAvatar);
              //console.log(fullIdPic);
              document.getElementById("picuser").src = fullIdPic;
              $("#url_PicUser").val(fullIdPic);
            } else {
              console.log("Upload picture user ERROR : " + res.result);
              console.log("Upload picture user ERROR : " + res);
            }
            waiting(false);
          });
      }
      img.src = e.target.result;
    }
    reader.readAsDataURL(imageFile);
  }
});

function del_result(val) {
  $.ajax({
    url: urlUser,
    type: 'GET',
    crossDomain: true,
    data: {opt_delpic:"delUserPic",opt_idpic:val},
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
      if (result) {
          console.log("Delete user picture success.");
      } else {
          console.log("Delete user picture not success!");
      }
    },
    error: function (err) {
        console.log("Delete picture user ERROR : " + err);
    }
  });     
}

$(document).on("submit", "#edit_user_form", function () {  //===== ตกลงเปลี่ยนข้อมูลผู้ใช้งาน  
    let my_form = $(this);
    const id_user_sel = my_form.find("#id_user").val();
    const name_user = my_form.find("#name_user").val();
    const email_user = my_form.find("#email_user").val();
    const uName = my_form.find("#userName").val();
    const sel_lv_index = document.getElementById("selLv").selectedIndex;
    const sel_lv = (sel_lv_index == 0)?"User":document.getElementById("selLv").options[sel_lv_index].text;
    const userPic = my_form.find("#url_PicUser").val();    
    waiting();
    $.ajax({
      url: urlUser,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'edit', opt_id:id_user_sel, opt_nm:name_user, opt_em:email_user, 
      opt_un:uName, opt_lv:sel_lv, opt_urlPic:userPic},
      success: function (result) {
        waiting(false);
        if(result == "success"){
          waiting(false);
          myAlert("success", "แก้ไขข้อมูล สำเร็จ");
          clsUseShow();
          loadDataUser();
        }else if (result == "exits") {
            sw_Alert('warning', 'แก้ไขข้อมูล ไม่สำเร็จ', 'User Name ซ้ำกับผู้อื่น กรุณาเปลี่ยนใหม่');
        }else {
            sw_Alert('error', 'แก้ไขข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }          
      },
      error: function (err) {
          console.log("Edit user ERROR : " + err);
      }
    });
    return false;
});

$(document).on("click", "#resetpass", function () { //========== รีเซ็ทรหัสผ่านใหม่
    const id_user_sel = document.getElementById("id_user").value;
    const user_name = document.getElementById('name_user').value;
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'mybtn btnOk',
            cancelButton: 'mybtn btnCan'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'รีเซ็ทรหัสผ่าน ' + user_name,
        text: "โปรดยืนยัน ตกลงหรือไม่ ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '&nbsp;&nbsp;ตกลง&nbsp;&nbsp;',
        cancelButtonText: '&nbsp;&nbsp;ไม่&nbsp;&nbsp;',
        reverseButtons: false
    }).then((result) => {
        if (result.isConfirmed) {
          waiting();
          $.ajax({
            url: urlUser,
            type: 'GET',
            crossDomain: true,
            data: { opt_k: 'resetpass', opt_id:id_user_sel },
            success: function (result) {
              waiting(false);
              if(result == "success"){
                waiting(false);
                myAlert("success", "รหัสผ่านได้ถถูกรีเซ็ทแล้ว !");
              }else{
                sw_Alert('error', 'รีเซ็ทรหัสผ่าน ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
              }          
            },
            error: function (err) {
                console.log("Reset password ERROR : " + err);
            }
          });
        }else if (result.dismiss === Swal.DismissReason.cancel) {
            /*swalWithBootstrapButtons.fire(
                'ยกเลิก',
                'ข้อมูลของคุณยังไม่ถูกลบ :)',
                'error'
            )*/
        }
    })
});  

$(document).on("click", "#ch_key", function () {   //เปิดหน้าเปลี่ยนรหัสผ่าน
  let html = `      
  <div class="container">
    <div class="row justify-content-center mt-4">
      <div class="col-md-5 mx-auto">
        <form class="animate__animated animate__fadeIn" id="change_pass_mainform" style="padding:20px;">
          <div class="mb-3" style="font-size:1.5rem; text-align: center;">
            เปลี่ยนรหัสผ่าน
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
            <input type="password" class="form-control" id="old_pass" placeholder="รหัสผ่านเดิม" aria-label="Password" required>
          </div>
          <div class="input-group mb-2">
            <span class="input-group-text" ><i class="fa-solid fa-key"></i></span>
            <input type="password" class="form-control" id="new_pass1" placeholder="รหัสผ่านใหม่" aria-label="Password" required>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" ><i class="fa-solid fa-key"></i></span>
            <input type="password" class="form-control" id="new_pass2" placeholder="อีกครั้ง" aria-label="Repeat Password" required>
          </div>
          <div style="text-align:center;">
            <button type="submit" class="mybtn btnOk">บันทึก</button>
            <button type="button" class="mybtn btnCan" onclick="show_home();">ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `;
  $("#main_setting").html(html);
});

$(document).on("submit", "#change_pass_mainform", function () {  //===== ตกลงเปลี่ยนรหัสผ่าน
  let my_form = $(this);
  const pass_old = my_form.find("#old_pass").val();
  const pass_new1 = my_form.find("#new_pass1").val();
  const pass_new2 = my_form.find("#new_pass2").val();
  if (pass_new1 === pass_new2) {
      waiting();
      $.ajax({
          url: urlUser,
          type: 'GET',
          crossDomain: true,
          data: { opt_k: 'changepass', opt_id: user.id, opt_pw: pass_old, opt_pw2: pass_new1 },
          success: function (result) {
              waiting(false);
              console.log(result);
              if (result == "success") {
                  myAlert("success", "เปลี่ยนรหัสผ่าน สำเร็จ");
                  show_home();
              } else if (result == "passwrong") {
                  sw_Alert('error', 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'รหัสผ่านเดิมไม่ถูกต้อง');
              } else {                    
                  sw_Alert('error', 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
              }
          },
          error: function (err) {
              console.log("Reset password ERROR : " + err);
          }
      });

  } else {
      sw_Alert('warning', 'รหัสผ่านไม่ตรงกัน', 'กรุณาระบุรหัสผ่านใหม่ให้ตรงกันทั้งสองครั้ง');
  }

  return false;
});
