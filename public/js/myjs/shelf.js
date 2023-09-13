/*===============================  การจัดการ  ช่องจัดก็บ =================================*/
$(document).on("click", "#shelf_mng", function () {
    page_selected = 1;
    is_sort = true;
    col_sort = 1;
    raw_sort = 0;
    var html = `
    <div class="container-fluid">
      <div class="row">                
          <div class="col-lg-10 mx-auto mt-4">
              <label class="fn_name" ><i class="fa-solid fa-table-cells-large fg-lg"></i> &nbsp; ช่องจัดเก็บ</label>
              <form id="fmsearch_shelf" >
                  <div class="input-group mb-2">
                      <input type="text" id="search_shelf" onkeypress="handle_shelfSearch(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search">
                      <button class="b-success" type="button" id="bt_search_shelf" title="ค้นหา"><i class="fas fa-search"></i></button>
                      <button class="b-add ms-2" id="btAddShelf" type="button" title="เพิ่มข้อมูล"><i class="fa-solid fa-plus fa-lg"></i></button>
                      <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                  </div>
              </form> 
          </div>          
      </div>   
      <div class="row">  
          <div class="col-lg-7 col-md-9 col-sm-12 mx-auto" id="add_shelf"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="edit_shelf"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-10 mx-auto" id="table_shelf"></div>
      </div>
    </div>
      `;      
    $("#main_setting").html(html);
    loadDataShelf();
});

function loadDataShelf(show = true) {
  if(show === true) waiting();
  $.ajax({
      url: urlData,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'readAll', opt_data:'shelf'},
      success: function (result) {
          dataAllShow = result;
          if(show === true) showShelfTable(rowperpage, page_selected); //<<<<<< แสดงตาราง rowperpage,page_sel   
          waiting(false);
      },
      error: function (err) {
          console.log("The server  ERROR says: " + err);
      }
  });
}

function myShelfData(shText = "", colSort = 0, isSort = false, rawSort = 0, page = 1, perPage = 10) {
    const search_str = shText.toLowerCase().split(",");
    if (isSort == true) {sortByCol(dataAllShow, colSort, rawSort);} //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
    let array_Arg = new Array();
    for (let i = 0; i < dataAllShow.length; i++) {
        const condition = search_str.some(el => dataAllShow[i][1].includes(el));  //กรองชื่อ
        const condition2 = search_str.some(el => dataAllShow[i][2].includes(el));  //รายละเอียด
        if (condition || condition2) {
            let jsonArg = new Object();
            jsonArg.id = dataAllShow[i][0];
            jsonArg.name = dataAllShow[i][1];
            jsonArg.desc = dataAllShow[i][2];
            jsonArg.pic = dataAllShow[i][3];
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

function clsShelfShow(){
    $("#add_shelf").html("");
    $("#edit_shelf").html("");
    $("#table_shelf").html("");
  
}

$(document).on('click', "#bt_search_shelf", function () {  //ค้นหารายการ
    showShelfTable(rowperpage, 1);
});

function handle_shelfSearch(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        showShelfTable(rowperpage, 1);
    }
}

function showShelfTable(per=10, p=1, colSort=1, isSort=true, rawSort=0) { //======================== แสดงตาราง
  var strSearch = document.getElementById('search_shelf').value;
  var n = ((p - 1) * per);
  const myArr = myShelfData(strSearch, colSort, isSort, rawSort, p, per);
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
            on_clk[j] = 'showShelfTable(rowperpage,1,'+j+',true,1);';
            sortTxt[j] = '<i class="fa-solid fa-sort-up"></i>';
            
        }else{
            on_clk[j] = 'showShelfTable(rowperpage,1,'+j+',true,0);';
            sortTxt[j] = '<i class="fa-solid fa-sort-down"></i>';
        }        
    }else{
        on_clk[j] = 'showShelfTable(rowperpage,1,'+j+',true,0);';
        sortTxt[j] = '<i class="fa-solid fa-sort"></i>';
    }
  }
  

  var tt = `
    <table class="list-table table animate__animated animate__fadeIn" id="shelfTable" >
      <thead>
        <tr>
          <th class="text-center" style="width:5%">ลำดับ</th> 
          <th class="text-left sort-hd" onclick="`+on_clk[1]+`">`+sortTxt[1]+`&nbsp; ช่องจัดเก็บ</th>
          <th class="text-left sort-hd" onclick="`+on_clk[2]+`">`+sortTxt[2]+`&nbsp; รายละเอียด</th>
          <th class="text-center">แก้ไข&nbsp;&nbsp;&nbsp;ลบ</th>                
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table> 
      <div class="row animate__animated animate__fadeIn">
        <div class="col-sm-3 mb-2" style="font-size: 0.8rem;">
          <label  for="rowShow_shelf">แถวแสดง:</label>
          <input type="number" id="rowShow_shelf" name="rowShow_shelf" min="1" max="99" step="1" value="" style="text-align:center;">
        </div>
        <div class="col-sm-6 mb-2">
          <div id="pagination"></div>
        </div>
        <div class="col-sm-3 mb-2" style="font-size: 0.8rem; text-align:right;">
          <label id="record"></label>
        </div>
      </div>                     
    `;
  $("#table_shelf").html(tt);
  document.getElementById("rowShow_shelf").value = rowperpage.toString();
  document.getElementById("record").innerHTML = "ทั้งหมด : " + rec_all + " รายการ";
  for (let i = 0; i < myArr.length - 1; i++) {
    n++;
    listShelfTable(myArr[i], n);
  }
  pagination_show(p, page_all, rowperpage, 'showShelfTable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
}

$(document).on("change", "#rowShow_shelf", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
    rowperpage = +$("#rowShow_shelf").val();
    showShelfTable(rowperpage, 1);
});

function listShelfTable(ob, i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางประเเภท
    let tableName = document.getElementById('shelfTable');
    let prev = tableName.rows.length;
    let row = tableName.insertRow(prev);
    row.id = "row" + ob.id;
    row.style.verticalAlign = "top";
    txtDel = `<i class="fas fa-trash-alt" onclick="deleteShelfRow(` + ob.id + `)" style="cursor:pointer; color:#d9534f;"></i>`;
    let n_col = 4;
    let col = [];
    for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
    }
    col[0].innerHTML = `<div id="no" class="text-center">` + i_no + `</div>`;
    col[1].innerHTML = `<div id="name` + ob.id + `" class="text-left">` + ob.name + `</div>`;
    col[2].innerHTML = `<div id="desc` + ob.id + `" class="text-left">` + ob.desc + `</div>`;
    col[n_col - 1].innerHTML = `
      <input type="hidden" id="id_shelf` + ob.id + `" value="` + ob.id + `" />
      <input type="hidden" id="t_id_pic` + ob.id + `" value="` + ob.pic + `" />
      
      <i class="fas fa-edit me-3" onclick="editShelfRow(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
      `+ txtDel;
    col[n_col - 1].style = "text-align: center;";
}

$(document).on("click", "#btAddShelf", function () { //========== เปิดเพิ่มข้อมูล
    clsShelfShow();
    var html = `     
      <div id="shelf_add" class="main_form">    
        <form class="animate__animated animate__fadeIn" id="add_shelf_form" style="padding:20px;">
          <div class="row mb-3 justify-content-md-center">
            <div style="font-size:1.5rem; text-align: center;"> เพิ่มช่องจัดเก็บ </div>     
          </div> 
          <div class="row">
            <div class="col-md">
              <div class="input-group mb-2">
                <span class="input-group-text" ><i class="fa-solid fa-table-cells-large"></i></span>
                <input type="text" id="name_shelf" class="form-control" placeholder="ชื่อ-ช่องจัดเก็บ" aria-label="shelf name" required>
              </div>     
            </div>            
          </div>   
          <div class="row">
            <div class="col-md">
              <div class="input-group mb-4">
                <span class="input-group-text" ><i class="fa-regular fa-comment"></i></span>
                <input type="text" id="desc_shelf" class="form-control" placeholder="รายละเอียด" aria-label="shelf description" required>
              </div>     
            </div>            
          </div>  
          <div class="row justify-content-center" style="text-align: center;">
            <button type="submit" class="mybtn btnOk">บันทึก</button>
            <button type="button" class="mybtn btnCan" id="cancel_add_shelf">ยกเลิก</button>
          </div>             
          
        </form>
      </div>  
      `;
    $("#add_shelf").html(html);
  });

  $(document).on("click", "#cancel_add_shelf", function () { //========== ยกเลิกการเพิ่มข้อมูล
    clsShelfShow();
    showShelfTable(rowperpage, page_selected);
  });

  $(document).on("submit", "#add_shelf_form", function () {  //===== ตกลงเพิ่มข้อมูล
    let my_form = $(this);
    const name_shelf = my_form.find("#name_shelf").val();
    const desc_shelf = my_form.find("#desc_shelf").val();
    waiting();
    $.ajax({
      url: urlData,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'add', opt_data:'shelf', opt_nm:name_shelf, opt_desc:desc_shelf },
      success: function (result) {
        waiting(false);
        if(result == "success"){
          myAlert("success", "เพิ่มข้อมูล สำเร็จ");
          $("#add_shelf").html("");
          loadDataShelf();
        }else if(result == "exits"){
          sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', name_shelf + ' ซ้ำ! มีการใช้ชื่อนี้แล้ว');
        }else{
          sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }          
      },
      error: function (err) {
          console.log("Add new shelf ERROR : " + err);
      }
    });
    return false;
});

function deleteShelfRow(id) { //================================ ลบข้อมูล
    var del_name = document.getElementById('name' + id).innerHTML;
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'mybtn btnOk',
            cancelButton: 'mybtn btnCan'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'ลบ ' + del_name,
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
              url: urlData,
              type: 'GET',
              crossDomain: true,
              data: { opt_k:'del', opt_data:'shelf', opt_id:id },
              success: function (result) {
                waiting(false);
                if(result == "success"){
                  myAlert("success", "ข้อมูลถูกลบแล้ว !");
                  loadDataShelf();
                }else{
                  sw_Alert('error', 'ลบข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
                }          
              },
              error: function (err) {
                  console.log("Delete shelf ERROR : " + err);
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

function editShelfRow(id) { //================================ เปิดหน้าแก้ไขข้อมูล      
    var html = `     
    <div id="shelf_edit" class="main_form">    
      <form class="animate__animated animate__fadeIn" id="edit_shelf_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;"> แก้ไขข้อมูลช่องจัดเก็บ </div>     
        </div> 
        <div class="row mb-3 justify-content-center" style="position: relative;">
          <img id="pic_shelf" src="" alt="shelf" style="width:200px; outline:2px solid #c0c0c0; outline-offset: 1px;">  
          <label class="camera" for="upload_pic_shelf" title="อัพโหลดรูปใหม่">
            <i class="fa-solid fa-camera"></i>  
            <input type="file" id="upload_pic_shelf" name="upload_pic_shelf" style="display:none" accept="image/*">
          </label>
        </div> 
        <div class="row">        
          <div class="col-md">
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-table-cells-large"></i></span>
              <input type="text" id="name_shelf" class="form-control" placeholder="ชื่อ-ช่องจัดเก็บ" aria-label="shelf name" required>
            </div>            
          </div>
        </div>
        <div class="row">        
          <div class="col-md">
            <div class="input-group mb-4">
              <span class="input-group-text" ><i class="fa-regular fa-comment"></i></span>
              <input type="text" id="desc_shelf" class="form-control" placeholder="รายละเอียด" aria-label="shelf description" required>
            </div>
            <div class="row justify-content-center" style="text-align: center;">
                <button type="submit" class="mybtn btnOk">บันทึก</button>
                <button type="button" class="mybtn btnCan" id="cancelEditShelf">ยกเลิก</button>
                <input id="id_shelf" type="hidden">
                <input id="id_pic" type="hidden">
            </div>
          </div>
        </div>       
      </form>
    </div>  
    `;
    $("#edit_shelf").html(html);
    $("#id_shelf").val(id);    
    var pic_edit = $("#t_id_pic"+id).val();
    $('#pic_shelf').attr('src',linkPic(pic_edit, pic_no));
    $("#id_pic").val(pic_edit);
    $("#name_shelf").val($('#name' + id).html());
    $("#desc_shelf").val($('#desc' + id).html());
    $("#table_shelf").html("");
    
  }

  $(document).on("click", "#cancelEditShelf", function () { //========== ยกเลิกการแก้ไขข้อมูล
    clsShelfShow();
    showShelfTable(rowperpage, page_selected);
  });

  
$(document).on("submit", "#edit_shelf_form", function () {  //===== ตกลงแก้ไข/เปลี่ยนข้อมูล
    let my_form = $(this);
    const id_edit = my_form.find("#id_shelf").val();
    const name_edit = my_form.find("#name_shelf").val();
    const desc_edit = my_form.find("#desc_shelf").val();
    const editPic = my_form.find("#id_pic").val();  
    waiting();
    $.ajax({
      url: urlData,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'edit',opt_data:'shelf', opt_id:id_edit, opt_nm:name_edit, opt_desc:desc_edit, opt_urlPic:editPic},
      success: function (result) {
        waiting(false);
        if(result == "success"){
          waiting(false);
          myAlert("success", "แก้ไขข้อมูล สำเร็จ");
          clsShelfShow();
          loadDataShelf();
        }else if (result == "exits") {
            sw_Alert('warning', 'แก้ไขข้อมูล ไม่สำเร็จ', 'ชื่อ ซ้ำ! กรุณาเปลี่ยนใหม่');
        }else {
            sw_Alert('error', 'แก้ไขข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }          
      },
      error: function (err) {
          console.log("Edit shelf ERROR : " + err);
      }
    });
    return false;
});

$(document).on("change", "#upload_pic_shelf", function (e) {
    if (e.target.files) {
        waiting();
        var id_file = $("#id_shelf").val();
        var n_file = 'shelf-' + id_file;
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

                var width = 300;
                var height = 300;
                const sqr = false; /*<<==== กำหนดว่าต้องการภาพด้านเท่าหรือไม่ false/true */
                if (sqr) { /*============================= Square ==================================*/
                    if (img.width < img.height) { // ภาพสูง
                        var co = {
                            co_w: img.width,
                            co_h: img.width,
                            co_x: 0,
                            co_y: Math.floor((img.height - img.width) / 2)
                        }
                    } else if (img.width > img.height) { // ภาพกว้าง
                        var co = {
                            co_w: img.height,
                            co_h: img.height,
                            co_x: Math.floor((img.width - img.height) / 2),
                            co_y: 0
                        }
                    } else { // ภาพมีด้านเท่ากัน
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

                } else {  /*============================= Original ==================================*/
                    height = Math.floor(width * img.height / img.width);
                    canvas.width = width;
                    canvas.height = height;
                    ctx_s.drawImage(img, 0, 0, width, height);
                }

                var dataurl = canvas.toDataURL(imageFile.type);
                const vals = dataurl.split(',')[1];

                var id_pic_del = $("#id_pic").val();
                const obj = {
                    opt_k: "upShelfPic",
                    data: "shelf",
                    id: id_file,
                    fName: n_file,
                    fileId: id_pic_del,
                    fileName: imageFile.name,
                    mimeType: imageFile.type,
                    fdata: vals
                }
                fetch(urlData, {
                    method: "POST",
                    body: JSON.stringify(obj)
                })
                    .then(function (response) {
                        return response.text()
                    }).then(function (data) {
                        let res = JSON.parse(data);
                        if (res.result == "success") {
                            loadDataShelf(false);
                            $('#pic_shelf').attr('src', linkPic(res.id, pic_no));
                            $("#id_pic").val(res.id);
                            myAlert("success", "อัพโหลดรูปภาพ สำเร็จ");
                        } else {
                            console.log("Upload picture shelf ERROR : ");
                            console.log(res.result);
                            console.log(res);
                        }
                        waiting(false);
                    }); 
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(imageFile);
    }
});