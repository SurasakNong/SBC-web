/*===============================  สมาชิก =================================*/
const openMember = () => {    
    page_selected = 1;
    is_sort = true;
    col_sort = 1;
    raw_sort = 0;
    let html = `
      <div class="container-fluid">
        <div class="row mt-">                
            <div class="col-lg-12 mx-auto mt-4">
                <a class="fn_name" ><i class="fa-solid fa-users"></i>&nbsp; สมาชิก</a>
                <form id="fmsearch_mem" >
                  <div class="row mt-1">
                      <div class="col">
                          <div class="input-group mb-2">                  
                              <input type="text" id="search_member" onkeypress="handle_memberSearch(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search"
                              style="border-radius:18px 0 0 18px;">
                              <button class="b-success" type="button" id="bt_search_member" title="ค้นหา" style="border-radius:0 18px 18px 0;"><i class="fas fa-search"></i></button>
                              <button class="b-add ms-2" id="btAddMemQr" type="button" title="เพิ่มจาก Add Line Official Account"><i class="fa-solid fa-qrcode fa-lg"></i></button>
                              <button class="b-add ms-2" id="btAddMem" type="button" title="เพิ่มข้อมูล"><i class="fa-solid fa-plus fa-lg"></i></button>
                              <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                          </div>
                      </div>
                  </div>
                </form> 
            </div>          
        </div>   
        
        <div class="row">  
            <div class="col-lg-10 col-md-10 col-sm-10 mx-auto" id="add_member"></div>
        </div>  

        <div class="row">  
            <div class="col-lg-10 col-md-10 col-sm-10 mx-auto" id="edit_member"></div>
        </div>  

        <div class="row">  
          <div id="table_member_all">
            <div class="col-lg-12 mx-auto table-scroll mb-2" id="table_member" style="height: calc(100vh-200px);"></div>
            <div class="row">
              <div class="col-auto me-auto" style="font-size: 0.8rem;">
                <label  for="rowShow_mem">แถวแสดง:</label>
                <input type="number" id="rowShow_member" name="rowShow_mem" min="1" max="99" step="1" value="" style="text-align:center;">
              </div>
              <div class="col">
                <div id="pagination"></div>
              </div>
              <div class="col-auto" style="font-size: 0.8rem; text-align:right;">
                <a id="record"></a>
              </div>
            </div>   
          </div>
        </div>

        <div class="modal fade " id="Qrmodal" tabindex="-1" role="dialog" aria-labelledby="myModalLine" aria-hidden="true">
            <div class="modal-dialog modal-fullscreen-md-down">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5>Add Line Official</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row justify-content-center mb-4" style="text-align: center;">
                            <img id="picQrcode" src="" alt="Qrcode" style="width:300px; margin: auto 0;"> 
                        </div>                         
                    </div>
                    <div class="row justify-content-center mb-4">
                        <button type="button" class="mybtn btnOk me-3" id="add_line_qr">ตกลง</button>
                    </div>
                </div>
            </div>
        </div>

      </div>
  
        `;
    $("#main_setting").html(html);
    $('#picQrcode').attr('src', 'https://drive.google.com/uc?export=view&id=1jo7DbThGnkoyKNbo_p4MbGs2fyvqGJdz');
    loadDataMem();
}

 
$(document).on('click', "#btAddMemQr", function () {
    $("#Qrmodal").modal("show");
});

$(document).on('click', "#add_line_qr", function () {
  loadDataMem();
  $("#Qrmodal").modal("hide");
});

const loadDataMem = (show = true) =>{
    if(show === true) waiting();
    $.ajax({
        url: urlMember,
        type: 'GET',
        crossDomain: true,
        data: { opt_k: 'readAll'},
        success: function (result) {
            dataAllShow = result;
            if(show === true) showMemberTable(rowperpage, page_selected); //<<<<<< แสดงตาราง rowperpage,page_sel   
            waiting(false);
        },
        error: function (err) {
            console.log("The server  ERROR says: " + err);
        }
    });
  }

  function myMemberData(shText = "", colSort = 0, isSort = false, rawSort = 0, page = 1, perPage = 10) {
    const search_str = shText.toLowerCase().split(",");
    if (isSort = true) sortByCol(dataAllShow, colSort, rawSort); //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
    let array_Arg = new Array();
    for (let i = 0; i < dataAllShow.length; i++) {
      const condition = search_str.some(el => dataAllShow[i][2].toLowerCase().includes(el));  //ชื่อ
      const condition2 = search_str.some(el => dataAllShow[i][5].toLowerCase().includes(el));  //อีเมล
      const condition3 = search_str.some(el => dataAllShow[i][6].toLowerCase().includes(el));  //เบอร์โทร
      const condition4 = search_str.some(el => dataAllShow[i][7].toLowerCase().includes(el));  //ที่อยู่
      if (condition || condition2 || condition3 || condition4) {
        let jsonArg = new Object();
        jsonArg.id = dataAllShow[i][0];
        jsonArg.userId = dataAllShow[i][1];
        jsonArg.name = dataAllShow[i][2];
        jsonArg.urlPic = dataAllShow[i][3];
        jsonArg.dateTs = dataAllShow[i][4];
        jsonArg.email = dataAllShow[i][5];
        jsonArg.tel = dataAllShow[i][6];
        jsonArg.add = dataAllShow[i][7];
        jsonArg.point = dataAllShow[i][8];
        jsonArg.lineSt = dataAllShow[i][9];
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
  
  function clsMemberShow(){
    $("#add_member").html("");
    $("#edit_member").html("");
    $("#table_member").html("");  
    document.getElementById("table_member_all").style.display = "none";
  }

  $(document).on('click', "#bt_search_member", function () {  //ค้นหารายการ
    showMemberTable(rowperpage, 1);
  });
  
  function handle_memberSearch(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        showMemberTable(rowperpage, 1);
    }
  }

  function showMemberTable(per=10, p=1, colSort=4, isSort=true, rawSort=1) { //======================== แสดงตาราง
    const strSearch = document.getElementById('search_member').value;
    let n = ((p - 1) * per);
      const myArr = myMemberData(strSearch, colSort, isSort, rawSort, p, per);
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
                on_clk[j] = 'showMemberTable(rowperpage,1,'+j+',true,1);';
                sortTxt[j] = '<i class="fa-solid fa-sort-up"></i>';
                
            }else{
                on_clk[j] = 'showMemberTable(rowperpage,1,'+j+',true,0);';
                sortTxt[j] = '<i class="fa-solid fa-sort-down"></i>';
            }        
        }else{
            on_clk[j] = 'showMemberTable(rowperpage,1,'+j+',true,0);';
            sortTxt[j] = '<i class="fa-solid fa-sort"></i>';
        }
      }
      let tt = `
        <table class="list-table table animate__animated animate__fadeIn" id="memberTable" >
          <thead>
            <tr>
              <th class="text-center" style="width:5%">ลำดับ</th> 
              <th class="text-start sort-hd" onclick="`+on_clk[4]+`">`+sortTxt[4]+`&nbsp; วันที่</th>
              <th class="text-start sort-hd" onclick="`+on_clk[2]+`">`+sortTxt[2]+`&nbsp; ชื่อ</th>
              <th class="text-start sort-hd" onclick="`+on_clk[5]+`">`+sortTxt[5]+`&nbsp; อีเมล</th>
              <th class="text-start sort-hd" onclick="`+on_clk[6]+`">`+sortTxt[6]+`&nbsp; เบอร์โทร</th>
              <th class="text-start sort-hd" onclick="`+on_clk[7]+`">`+sortTxt[7]+`&nbsp; ที่อยู่</th>
              <th class="text-end">Point</th>
              <th class="text-center">แก้ไข&nbsp;&nbsp;&nbsp;ลบ</th>                
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table> 
        `;      
      document.getElementById("table_member_all").style.display = "block";
      $("#table_member").html(tt);    
      $("#rowShow_member").val(rowperpage.toString());
      $("#record").html("รวม "+ rec_all + " รายการ");
      for (let i = 0; i < myArr.length - 1; i++) {
        n++;
        listMemberTable(myArr[i], n);
      }
      pagination_show(p, page_all, rowperpage, 'showMemberTable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
  }
  
  $(document).on("change", "#rowShow_member", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
    rowperpage = +$("#rowShow_member").val();
    showMemberTable(rowperpage, 1);
  });

  function listMemberTable(ob,i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางประเเภท
    const tableName = document.getElementById('memberTable');
    const prev = tableName.rows.length;
    const stLine = (ob.userId == "" || ob.userId == 'undefined' || ob.userId == undefined)?false:true;
    let row = tableName.insertRow(prev);
    row.id = "row" + ob.id;
    row.style.verticalAlign = "top";
    row.style.color = (stLine) ? "#000000" : "#aa2020";
    txtDel = `<i class="fa-solid fa-xmark" onclick="delete_member(` + ob.id + `,'` + ob.name + `')" style="cursor:pointer; color:#d9534f;"></i>`;
    const n_col = 8;
    let col = [];
    for (let ii = 0; ii < n_col; ii++) {
      col[ii] = row.insertCell(ii);
    }
    col[0].innerHTML = `<div id="no" class="text-center">` + i_no + `</div>`;
    col[1].innerHTML = `<div id="dt` + ob.id + `" class="text-start">` + tsToDate(+ob.dateTs)  + `</div>`;
    col[2].innerHTML = `<div id="name` + ob.id + `" class="text-start">` + ob.name + `</div>`;
    col[3].innerHTML = `<div id="email` + ob.id + `" class="text-start">` + ob.email + `</div>`;
    col[4].innerHTML = `<div id="tel` + ob.id + `" class="text-start">` + ob.tel + `</div>`;
    col[5].innerHTML = `<div id="add` + ob.id + `" class="text-start">` + ob.add + `</div>`;    
    col[6].innerHTML = `<div id="point` + ob.id + `" class="text-end">` + ob.point + `</div>`;
    col[n_col - 1].innerHTML = `
            <input type="hidden" id="id_mem` + ob.id + `" value="` + ob.id + `" /> 
            <input type="hidden" id="userId_mem` + ob.id + `" value="` + ob.userId + `" /> 
            <input type="hidden" id="dt_mem` + ob.id + `" value="` + ob.dateTs + `" /> 
            <input type="hidden" id="url_pic` + ob.id + `" value="` + ob.dt + `" /> 
            <input type="hidden" id="lineSt` + ob.id + `" value="` + ob.lineSt + `" /> 
            <i class="fas fa-edit me-3" onclick="editMemberRow(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
            `+ txtDel;
    col[n_col - 1].style = "text-align: center;";
  }

  function delete_member(id, name) { //================================ ลบข้อมูล 
    const del_name = name;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'mybtn btnOk me-4',
        cancelButton: 'mybtn btnCan'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: "โปรดยืนยัน",
      text: 'ต้องการลบ "' + del_name + '" หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '&nbsp;&nbsp;ตกลง&nbsp;&nbsp;',
      cancelButtonText: '&nbsp;&nbsp;ไม่&nbsp;&nbsp;',
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        waiting();
        $.ajax({
          url: urlMember,
          type: 'GET',
          crossDomain: true,
          data: { opt_k: 'del', opt_id: id },
          success: function (result) {
            waiting(false);
            if (result == "success") {
              myAlert("success", "ข้อมูลถูกลบแล้ว !");
              loadDataMem();
            } else {
              sw_Alert('error', 'ลบข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
            }
          },
          error: function (err) {
            console.log("Delete Member ERROR : " + err);
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

  
$(document).on("click", "#btAddMem", function () { //========== เปิดเพิ่มข้อมูล  
  clsMemberShow();
  let html = `     
          <div id="sale_add" class="main_form" style="position:relative;">    
            <button class="b-top"  type="button" title="ยกเลิก" id="cancel_add_member">
            <i class="fa-solid fa-xmark fa-lg"></i></button>
            <form class="animate__animated animate__fadeIn" id="add_mem_form" style="padding:20px;">
              <div class="row mb-2 justify-content-md-center" >
                <div class="main_form_head"> เพิ่มสมาชิก </div>                
              </div>
              <div class="row mb-2">
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 75px; background-color:#fcdfe4;" for="mem_name">ชื่อ</label>
                    <input type="text" id="mem_name" class="form-control" placeholder="ชื่อสมาชิก" aria-label="mem_name" required>
                  </div>
                </div>
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 75px; background-color:#fcdfe4;" for="email_mem">อีเมล</label>
                    <input type="email" id="email_mem" class="form-control" placeholder="email@email.com" aria-label="Email">
                  </div>
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 75px; background-color:#fcdfe4;" for="tel_mem">เบอร์โทร</label>
                    <input type="text" id="tel_mem" class="form-control" placeholder="เบอร์โทรศัพท์ของสมาชิก" aria-label="member Tel"
                    onkeypress="return onlyNumberKey(event)" >   
                  </div>
                </div>
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 75px; background-color:#fcdfe4;" for="add_mem">ที่อยู่</label>
                    <input type="text" id="add_mem" class="form-control" placeholder="ที่อยู่ของสมาชิก" aria-label="member address" >                                        
                  </div>                  
                </div>   
              </div>

              <div class="row justify-content-center"> 
                  <button type="button" class="mybtn btnOk" id="bt_add_member">บันทึก</button>     
              </div>
            </form>         
          </div>  
          `;
  $("#add_member").html(html);
});
  
$(document).on("click", "#cancel_add_member", function () { //========== ยกเลิกเพิ่มข้อมูล  
  clsMemberShow();
  showMemberTable(rowperpage, 1);
});


$(document).on("click", "#bt_add_member", function () { //========== เพิ่มรายการ
  if (($("#email_mem").val() === '' && $("#tel_mem").val() === '') || $("#mem_name").val() === '') {
    sw_Alert('warning', 'ข้อมูลไม่ครบถ้วน', 'คุณยังไม่ใส่ข้อมูล ชื่อ, อีเมล หรือ เบอร์โทรศัพท์');
  }else{
    let array_cell = [
      $("#mem_name").val(),
      $("#email_mem").val(),
      $("#tel_mem").val(),
      date_Now(),
      $("#add_mem").val()
    ];

    waiting();
        $.ajax({
          url: urlMember,
          type: 'GET',
          crossDomain: true,
          data: { opt_k: 'add', opt_data: JSON.stringify(array_cell) },
          success: function (result) {
            waiting(false);
            if (result == "success") {
              myAlert("success", "เพิ่มข้อมูล สำเร็จ");
              clsMemberShow();
              loadDataMem();
            } else {
              sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
            }
          },
          error: function (err) {
            console.log("Add new member ERROR : " + err);
            waiting(false);
          }
        });

  }
});

  
const editMemberRow = (id) => { //========== เปิดแก้ไขข้อมูล  
  let color_txt = "#903030";
  let line_txt = 'ให้ Add Line Official, แล้วพิมพ์ข้อความ "code='+$('#id_mem'+id).val()+'" ส่ง';
  if($("#lineSt"+id).val() == 'TRUE'){
    color_txt = "#105010";
    line_txt = "Add Line Official สมบูรณ์แล้ว";
  }else if($("#userId_mem"+id).val() !== '' && $("#lineSt"+id).val() == 'FALSE' ){
    color_txt = "#105080";
    line_txt = "Add Line Official = OK, ต่อไปให้กรอกข้อมูลอีเมล,เบอร์โทร,ที่อยู่";
  }else{
    color_txt = "#903030";
    line_txt = 'ให้ Add Line Official, แล้วพิมพ์ข้อความ "code='+$('#id_mem'+id).val()+'" ส่ง';
  }

  let html = `     
          <div id="member_edit" class="main_form" style="position:relative;">    
            <button class="b-top"  type="button" title="ยกเลิก" id="cancel_edit_member">
            <i class="fa-solid fa-xmark fa-lg"></i></button>
            <form class="animate__animated animate__fadeIn" id="edit_mem_form" style="padding:20px;">
              <div class="row mb-2 justify-content-md-center" >
                <div class="main_form_head"> แก้ไขข้อมูลสมาชิก </div>                
              </div>
              <div class="row mb-2">
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 75px; background-color:#fcdfe4;" for="mem_name">ชื่อ</label>
                    <input type="text" id="mem_name" class="form-control" placeholder="ชื่อสมาชิก" aria-label="mem_name" required>
                  </div>
                </div>
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 75px; background-color:#fcdfe4;" for="email_mem">อีเมล</label>
                    <input type="email" id="email_mem" class="form-control" placeholder="email@email.com" aria-label="Email">
                  </div>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 75px; background-color:#fcdfe4;" for="tel_mem">เบอร์โทร</label>
                    <input type="text" id="tel_mem" class="form-control" placeholder="เบอร์โทรศัพท์ของสมาชิก" aria-label="member Tel"
                    onkeypress="return onlyNumberKey(event)" >   
                  </div>
                </div>
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 75px; background-color:#fcdfe4;" for="add_mem">ที่อยู่</label>
                    <input type="text" id="add_mem" class="form-control" placeholder="ที่อยู่ของสมาชิก" aria-label="member address" >                                        
                  </div>                  
                </div>   
              </div>

              <div class="row mb-4">
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 75px; background-color:#fcdfe4;" for="point_mem">Point</label>
                    <input type="number" id="point_mem" class="form-control" placeholder="0" aria-label="member Point" min="0" step="1">   
                  </div>
                </div>

                <div class="col-md">
                  <div class="input-group mb-1">
                    <input type="text" id="add_line_mem" class="form-control me-2" aria-label="add line member" style="color:#ffffff;" disabled> 
                    
                  </div>
                </div>
              </div>

              <div class="row justify-content-center"> 
                  <button type="button" class="mybtn btnOk" id="bt_edit_member">บันทึก</button>  
                  <input id="mem_id" type="hidden">   
                  <input id="mem_userId" type="hidden">   
                  <input id="mem_dt" type="hidden">   
              </div>
            </form>         
          </div>  
          `;
  

  $("#edit_member").html(html);
  $("#mem_name").val($("#name"+id).html());
  $("#email_mem").val($("#email"+id).html());
  $("#tel_mem").val($("#tel"+id).html());
  $("#add_mem").val($("#add"+id).html());
  $("#point_mem").val($("#point"+id).html());
  $("#mem_id").val($("#id_mem"+id).val());
  $("#mem_userId").val($("#userId_mem"+id).val());
  $("#mem_dt").val($("#dt_mem"+id).val());
  $("#add_line_mem").val(line_txt);
  $("#add_line_mem").css("background-color", color_txt);
  $("#table_member").html("");  

}

$(document).on("click", "#cancel_edit_member", function () { //========== ยกเลิกแก้ไขข้อมูล  
  clsMemberShow();
  showMemberTable(rowperpage, 1);
});

$(document).on("click", "#bt_edit_member", function () {  //===== ตกลงแก้ไขข้อมูล
  let lineId = ($("#mem_userId").val() == '')?'FALSE':'TRUE';
  if ($('#mem_name').val() == '') {
    sw_Alert('error', 'ข้อมูลไม่ครบถ้วน', 'กรุณาระบุชื่อสมาชิก');
    return false;
  }
  if ($('#email_mem').val() == '' && $('#tel_mem').val() == '') {
    sw_Alert('error', 'ข้อมูลไม่ครบถ้วน', 'กรุณาระบุอีเมล หรือ เบอร์โทรศัพท์');
    return false;
  }
    const txt = 'บันทึกการแก้ไข "' + $('#mem_name').val() + '" หรือไม่';
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'mybtn btnOk me-4',
        cancelButton: 'mybtn btnCan'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'โปรดยืนยัน ',
      text: txt,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '&nbsp;&nbsp;ตกลง&nbsp;&nbsp;',
      cancelButtonText: '&nbsp;&nbsp;ไม่&nbsp;&nbsp;',
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {        
          let array_cell = [
            $("#mem_id").val(),
            $("#mem_name").val(),
            $("#email_mem").val(),
            $("#tel_mem").val(),
            date_Now(),
            $("#add_mem").val(),
            $("#point_mem").val(),
            lineId
          ];
        
        waiting();
        $.ajax({
          url: urlMember,
          type: 'GET',
          crossDomain: true,
          data: { opt_k: 'edit', opt_data: JSON.stringify(array_cell) },
          success: function (result) {
            waiting(false);
            if (result == "success") {
              myAlert("success", "แก้ไขข้อมูล สำเร็จ");
              clsMemberShow();
              loadDataMem();

            } else {
              sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
            }
          },
          error: function (err) {
            console.log("Edit member ERROR : " + err);
            waiting(false);
          }
        });
        return false;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        /*swalWithBootstrapButtons.fire(
            'ยกเลิก',
            'ข้อมูลของคุณยังไม่ถูกลบ :)',
            'error'
        )*/
      }
    })
    
});