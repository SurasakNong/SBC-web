/*===============================  การจัดการความคิดเห็น =================================*/
$(document).on("click", "#comment_mng", function () {
    page_selected = 1;
    is_sort = true;
    col_sort = 1;
    raw_sort = 0;
    var html = `
    <div class="container-fluid">
      <div class="row mt-">                
          <div class="col-lg-10 mx-auto mt-4">
              <label class="fn_name" ><i class="fa-regular fa-comment"></i>&nbsp; ความคิดเห็น</label>
              <form id="fmsearch_comm" >
                <div class="row mt-1">
                    <div class="col-md-4">
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <label class="input-group-text " style="width: 50px;" for="datepicker">วันที่</label>
                            </div>
                            <input name="datefm" type="date" value='' id="datefm" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <label class="input-group-text " style="width: 50px;" for="datepicker">ถึง</label>
                            </div>
                            <input name="dateto" type="date" value='' id="dateto" class="form-control">
                            <!-- <input name="dateto" type="datetime-local" value='' id="dateto" class="form-control"> -->
                        </div>
                    </div>
                    <div class="col">
                        <div class="input-group mb-2">                  
                            <input type="text" id="search_comm" onkeypress="handle_commSearch(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search">
                            <button class="b-success" type="button" id="bt_search_comm" title="ค้นหา"><i class="fas fa-search"></i></button>
                            <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                        </div>
                    </div>
                </div>
              </form> 
          </div>          
      </div>   
      <div class="row">  
          <div class="col-lg-7 col-md-9 col-sm-12 mx-auto" id="add_comm"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="edit_comm"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-10 mx-auto" id="table_comm"></div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="commRead" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h6 class="modal-title" id="md_name">Modal title</h6>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-6" style="font-size: 0.8rem;" id="md_tel">เบอร์โทร : 0819545765</div>
                        <div class="col-md-6 ms-auto" style="font-size: 0.8rem; text-align: right;" id="md_email">อีเมล : hellogirl@hotmail.com</div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-12" style="font-size: 0.9rem;" id="md_comm">
                        
                        </div>
                    </div>
                </div>                
            </div>
            <div class="modal-footer">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-6" style="font-size: 0.7rem;" id="md_date">วันที่ :12/05/2023 22:22:12</div>                    
                        <div class="col-md-6 ms-auto" style="text-align: right;">
                            <button type="button" class="btn btn-success" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

    </div>
      `;      
    $("#main_setting").html(html);
    var dd = new Date();    
    dT.fmShot = dd.getFullYear() + "-" + ("0" + (dd.getMonth()-2)).slice(-2) + "-" + "01";
    dT.fmTs = dmyToTimestamp("01/"+ ("0" + (dd.getMonth()-2)).slice(-2) + "/" + dd.getFullYear() + " 00:00:01");
    dT.toShot = date_Now("y-m-d");
    dT.toTs = dmyToTimestamp(("0" + dd.getDate()).slice(-2)+"/"+ ("0" + (dd.getMonth()+1)).slice(-2) + "/" + dd.getFullYear() + " 23:59:59");
    $("#datefm").val(dT.fmShot);
    $("#dateto").val(dT.toShot);
    loadDataComment();
});

function loadDataComment(show = true) {
  if(show === true) waiting();
  $.ajax({
      url: urlComm,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'readAll'},
      success: function (result) {
          dataAllShow = result;
          if(show === true) showCommTable(rowperpage, page_selected); //<<<<<< แสดงตาราง rowperpage,page_sel   
          waiting(false);
      },
      error: function (err) {
          console.log("The server  ERROR says: " + err);
      }
  });
}

function myCommentData(shText = "", colSort = 0, isSort = false, rawSort = 0, page = 1, perPage = 10) {
  const search_str = shText.toLowerCase().split(",");
  if (isSort == true) sortByCol(dataAllShow, colSort, rawSort); //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
  let array_Arg = new Array();
  for (let i = 0; i < dataAllShow.length; i++) {
    const condition = search_str.some(el => dataAllShow[i][2].includes(el));  //กรองชื่อ
    const condition2 = search_str.some(el => dataAllShow[i][3].includes(el)); //Tel
    const condition3 = search_str.some(el => dataAllShow[i][4].includes(el)); //Email
    const condition4 = search_str.some(el => dataAllShow[i][5].includes(el)); //Comment
    if (condition || condition2 || condition3 || condition4) {
      if (+dataAllShow[i][1] >= dT.fmTs && +dataAllShow[i][1] <= dT.toTs) {
        let jsonArg = new Object();
        jsonArg.id = dataAllShow[i][0];
        jsonArg.dt = dataAllShow[i][1];
        jsonArg.name = dataAllShow[i][2];
        jsonArg.tel = dataAllShow[i][3];
        jsonArg.email = dataAllShow[i][4];
        jsonArg.comm = dataAllShow[i][5];
        jsonArg.st = dataAllShow[i][6];
        array_Arg.push(jsonArg);
      }
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

function handle_commSearch(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        showCommTable(rowperpage, 1);
    }
}

$(document).on('click', "#bt_search_comm", function () {  //ค้นหารายการ
    showCommTable(rowperpage, 1);
});

$(document).on('change', "#datefm", function () { 
    dT.fmShot = this.value;
    dT.fmTs = ymdToTimestamp(this.value + " 00:00:01")
});

$(document).on('change', "#dateto", function () { 
    dT.toShot = this.value;
    dT.toTs = ymdToTimestamp(this.value + " 23:59:59")
});

function showCommTable(per=10, p=1, colSort=1, isSort=true, rawSort=0) { //======================== แสดงตาราง
    var strSearch = document.getElementById('search_comm').value;
    var n = ((p - 1) * per);
    const myArr = myCommentData(strSearch, colSort, isSort, rawSort, p, per);
    let page_all = myArr[myArr.length - 1].page;
      let rec_all = myArr[myArr.length - 1].rec;
      page_selected = (p >= page_all) ? page_all : p;
      is_sort = isSort;
      col_sort = colSort;
      raw_sort = rawSort;
      let on_clk = ['','','','','','']; 
      let sortTxt = ['','','','','',''];  
      for(let j=0; j < on_clk.length; j++){
        if(j == colSort){
            if(rawSort == 0){
                on_clk[j] = 'showCommTable(rowperpage,1,'+j+',true,1);';
                sortTxt[j] = '<i class="fa-solid fa-sort-up"></i>';
                
            }else{
                on_clk[j] = 'showCommTable(rowperpage,1,'+j+',true,0);';
                sortTxt[j] = '<i class="fa-solid fa-sort-down"></i>';
            }        
        }else{
            on_clk[j] = 'showCommTable(rowperpage,1,'+j+',true,0);';
            sortTxt[j] = '<i class="fa-solid fa-sort"></i>';
        }
      }
      var tt = `
        <table class="list-table table animate__animated animate__fadeIn" id="commTable" >
          <thead>
            <tr id="commHeadTb">
              <th class="text-center sort-hd" onclick="`+on_clk[1]+`">`+sortTxt[1]+`&nbsp; วันที่</th> 
              <th class="text-left sort-hd" onclick="`+on_clk[2]+`">`+sortTxt[2]+`&nbsp; ชื่อ-สกุล</th>
              <th class="text-left sort-hd" onclick="`+on_clk[3]+`">`+sortTxt[3]+`&nbsp; เบอร์โทร</th>
              <th class="text-left sort-hd" onclick="`+on_clk[4]+`">`+sortTxt[4]+`&nbsp; อีเมล</th>
              <th class="text-left sort-hd" onclick="`+on_clk[5]+`">`+sortTxt[5]+`&nbsp; ความคิดเห็น</th>
              <th class="text-center">ลบ</th>                
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table> 
          <div class="row animate__animated animate__fadeIn">
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem;">
              <label  for="rowShow_comm">แถวแสดง:</label>
              <input type="number" id="rowShow_comm" name="rowShow_comm" min="1" max="99" step="1" value="" style="text-align:center;">
            </div>
            <div class="col-sm-6 mb-2">
              <div id="pagination"></div>
            </div>
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem; text-align:right;">
              <label id="record"></label>
            </div>
          </div>                     
        `;
      $("#table_comm").html(tt);
      document.getElementById("rowShow_comm").value = rowperpage.toString();
      document.getElementById("record").innerHTML = "ทั้งหมด : " + rec_all + " รายการ";
      for (let i = 0; i < myArr.length - 1; i++) {
        n++;
        listCommTable(myArr[i], n);
      }
      pagination_show(p, page_all, rowperpage, 'showCommTable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
}

$(document).on("change", "#rowShow_comm", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
  rowperpage = +$("#rowShow_comm").val();
  showCommTable(rowperpage, 1);
});

function listCommTable(ob, i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางประเเภท
    let tableName = document.getElementById('commTable');
    let prev = tableName.rows.length;
    let row = tableName.insertRow(prev);
    row.id = "row" + ob.id;
    row.style.verticalAlign = "top";
    row.style.color = (ob.st == "TRUE")?"#a0a0a0":"#000000";
    //row.style.height = "50px";
    /*let txtDel = `<i class="fas fa-trash-alt" style="cursor:not-allowed; color:#939393;"></i>`;
    if(u_level == "0"){*/
    txtDel = `<i class="fa-solid fa-xmark" onclick="delete_comm_Row(` + ob.id + `)" style="cursor:pointer; color:#d9534f;"></i>`;
    //}
    let n_col = 6;
    let col = [];
    for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
    }
    col[0].innerHTML = `<div id="dt` + ob.id + `" class="text-center">` + tsToDate(+ob.dt) + `</div>`;
    col[1].innerHTML = `<div id="name` + ob.id + `" class="text-left">` + ob.name + `</div>`;
    col[2].innerHTML = `<div id="tel` + ob.id + `" class="text-left">` + ob.tel + `</div>`;
    col[3].innerHTML = `<div id="email` + ob.id + `" class="text-left">` + ob.email + `</div>`;
    col[4].innerHTML = `<div id="comm` + ob.id + `" class="text-left fitText">` + ob.comm + `</div>`;
    col[n_col - 1].innerHTML = `
      <input type="hidden" id="id_comm` + ob.id + `" value="` + ob.id + `" />
      <input type="hidden" id="st_comm` + ob.id + `" value="` + ob.st + `" />    
      `+ txtDel;
    col[n_col - 1].style = "text-align: center;";
    document.getElementById("row"+ ob.id ).style.cursor = "pointer";
    document.getElementById("dt"+ ob.id ).setAttribute('onclick','showRead('+ob.id+');');
    document.getElementById("name"+ ob.id ).setAttribute('onclick','showRead('+ob.id+');');
    document.getElementById("tel"+ ob.id ).setAttribute('onclick','showRead('+ob.id+');');
    document.getElementById("email"+ ob.id ).setAttribute('onclick','showRead('+ob.id+');');
    document.getElementById("comm"+ ob.id ).setAttribute('onclick','showRead('+ob.id+');');
}

function showRead(id){
    $("#commRead").modal("show");
    document.getElementById("md_name").innerHTML = document.getElementById('name' + id).innerHTML;
    document.getElementById("md_tel").innerHTML = "เบอร์โทร : " + document.getElementById('tel' + id).innerHTML;
    document.getElementById("md_email").innerHTML = "อีเมล : " + document.getElementById('email' + id).innerHTML;
    document.getElementById("md_comm").innerHTML = document.getElementById('comm' + id).innerHTML;
    document.getElementById("md_date").innerHTML = "วันที่ : " + document.getElementById('dt' + id).innerHTML;
    if($("#st_comm"+id).val() == "FALSE"){
        setCommStatus(id);
        loadDataComment(false);
        document.getElementById('st_comm' + id).value = "TRUE";
    }
    
}

function setCommStatus(id) {  //===== เปลี่ยนความคิดเห็นเป็นอ่านแล้ว  
    $.ajax({
      url: urlComm,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'st', opt_id:id },
      success: function (result) {
        document.getElementById("row"+ id ).style.color = "#a0a0a0";
      },
      error: function (err) {
          console.log("Edit user ERROR : " + err);
      }
    });
    return false;
}

function delete_comm_Row(id) { //================================ ลบความคิดเห็น
    var user_name = document.getElementById('name' + id).innerHTML + ' (' + document.getElementById('dt' + id).innerHTML + ')';
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
              url: urlComm,
              type: 'GET',
              crossDomain: true,
              data: { opt_k:'del', opt_id:id },
              success: function (result) {
                waiting(false);
                if(result == "success"){
                  myAlert("success", "ข้อมูลถูกลบแล้ว !");
                  loadDataComment();
                }else{
                  sw_Alert('error', 'ลบข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
                }          
              },
              error: function (err) {
                  console.log("Delete Comment ERROR : " + err);
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