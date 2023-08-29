/*===============================  การจัดการประเภท =================================*/
$(document).on("click", "#type_mng", function () {
    page_selected = 1;
    var html = `
    <div class="container-fluid">
      <div class="row">                
          <div class="col-lg-10 mx-auto mt-4">
              <label class="fn_name" ><i class="fa-solid fa-font-awesome fa-lg"></i> &nbsp; ประเภทสินค้า</label>
              <form id="fmsearch_type" >
                  <div class="input-group mb-2">
                      <input type="text" id="search_type" onkeypress="handle_typeSearch(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search">
                      <button class="b-success" type="button" id="bt_search_type" title="ค้นหา"><i class="fas fa-search"></i></button>
                      <button class="b-add ms-2" id="btAddType" type="button" title="เพิ่มข้อมูล"><i class="fa-solid fa-plus fa-lg"></i></button>
                      <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                  </div>
              </form> 
          </div>          
      </div>   
      <div class="row">  
          <div class="col-lg-7 col-md-9 col-sm-12 mx-auto" id="add_type"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="edit_type"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-10 mx-auto" id="table_type"></div>
      </div>
    </div>
      `;      
    $("#main_setting").html(html);
    showTypeTable(rowperpage, 1); //<<<<<< แสดงตาราง rowperpage,page_sel
});

function clsTypeShow(){
    $("#add_type").html("");
    $("#edit_type").html("");
    $("#table_type").html("");
  
}

$(document).on('click', "#bt_search_type", function () {  //ค้นหารายการ
    showTypeTable(rowperpage, 1);
});

function handle_typeSearch(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        showTypeTable(rowperpage, 1);
    }
}

function showTypeTable(per, p) { //======================== แสดงตาราง
    waiting();
    var strSearch = document.getElementById('search_type').value;
    var n = ((p - 1) * per);
  $.ajax({
    url: urlType,
    type: 'GET',
    crossDomain: true,
    data: { opt_k: 'read', opt_sh: strSearch, opt_pe: per, opt_p: p },
    success: function (result) {
      const myArr = JSON.parse(JSON.stringify(result));
      let page_all = myArr[myArr.length - 1].page;
      let rec_all = myArr[myArr.length - 1].rec;
      page_selected = (p >= page_all) ? page_all : p;
      var tt = `
        <table class="list-table table animate__animated animate__fadeIn" id="typeTable" >
          <thead>
            <tr>
              <th class="text-center" style="width:5%">ลำดับ</th> 
              <th class="text-left">ประเภทสินค้า</th>
              <th class="text-center">แก้ไข&nbsp;&nbsp;&nbsp;ลบ</th>                
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table> 
          <div class="row animate__animated animate__fadeIn">
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem;">
              <label  for="rowShow_type">แถวแสดง:</label>
              <input type="number" id="rowShow_type" name="rowShow_type" min="1" max="99" step="1" value="" style="text-align:center;">
            </div>
            <div class="col-sm-6 mb-2">
              <div id="pagination"></div>
            </div>
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem; text-align:right;">
              <label id="record"></label>
            </div>
          </div>                     
        `;
      $("#table_type").html(tt);
      document.getElementById("rowShow_type").value = rowperpage.toString();
      document.getElementById("record").innerHTML = "ทั้งหมด : " + rec_all + " รายการ";
      for (let i = 0; i < myArr.length - 1; i++) {
        n++;
        listTypeTable(myArr[i], n);
      }
      pagination_show(p, page_all, rowperpage, 'showTypeTable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
      waiting(false);
    },
    error: function (err) {
      console.log("The server  ERROR says: " + err);
    }
  });
}

$(document).on("change", "#rowShow_type", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
    rowperpage = +$("#rowShow_type").val();
    showTypeTable(rowperpage, 1);
});

function listTypeTable(ob, i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางประเเภท
    let tableName = document.getElementById('typeTable');
    let prev = tableName.rows.length;
    let row = tableName.insertRow(prev);
    row.id = "row" + ob.id;
    row.style.verticalAlign = "top";
    txtDel = `<i class="fas fa-trash-alt" onclick="deleteTypeRow(` + ob.id + `)" style="cursor:pointer; color:#d9534f;"></i>`;
    let n_col = 3;
    let col = [];
    for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
    }
    col[0].innerHTML = `<div id="no" class="text-center">` + i_no + `</div>`;
    col[1].innerHTML = `<div id="name` + ob.id + `" class="text-left">` + ob.name + `</div>`;
    col[n_col - 1].innerHTML = `
      <input type="hidden" id="id_type` + ob.id + `" value="` + ob.id + `" />
      <input type="hidden" id="t_urlpic` + ob.id + `" value="` + ob.urlpic + `" />
      
      <i class="fas fa-edit me-3" onclick="editTypeRow(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
      `+ txtDel;
    col[n_col - 1].style = "text-align: center;";
}

$(document).on("click", "#btAddType", function () { //========== เปิดเพิ่มข้อมูล
    clsTypeShow();
    var html = `     
      <div id="type_add">    
        <form class="animate__animated animate__fadeIn" id="add_type_form" style="padding:20px;">
          <div class="row mb-3 justify-content-md-center">
            <div style="font-size:1.5rem; text-align: center;"> เพิ่มประเภทสินค้า </div>     
          </div> 
          <div class="row">
            <div class="col-md">
              <div class="input-group mb-4">
                <span class="input-group-text" ><i class="fa-solid fa-font-awesome"></i></span>
                <input type="text" id="name_type" class="form-control" placeholder="ชื่อ-ประเภทสินค้า" aria-label="type name" required>
              </div>     
            </div>
            
          </div>   
          <div class="row justify-content-center" style="text-align: center;">
            <button type="submit" class="mybtn btnOk">บันทึก</button>
            <button type="button" class="mybtn btnCan" id="cancel_add_type">ยกเลิก</button>
          </div>             
          
        </form>
      </div>  
      `;
    $("#add_type").html(html);
  });

  $(document).on("click", "#cancel_add_type", function () { //========== ยกเลิกการเพิ่มข้อมูล
    clsTypeShow();
    showTypeTable(rowperpage, page_selected);
  });

  $(document).on("submit", "#add_type_form", function () {  //===== ตกลงเพิ่มข้อมูล
    let my_form = $(this);
    const name_type = my_form.find("#name_type").val();
    waiting();
    $.ajax({
      url: urlType,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'add', opt_nm:name_type},
      success: function (result) {
        waiting(false);
        if(result == "success"){
          myAlert("success", "เพิ่มข้อมูล สำเร็จ");
          $("#add_type").html("");
          showTypeTable(rowperpage, page_selected);
        }else if(result == "exits"){
          sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', uName + ' ซ้ำ! มีการใช้ชื่อนี้แล้ว');
        }else{
          sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }          
      },
      error: function (err) {
          console.log("Add new type ERROR : " + err);
      }
    });
    return false;
});

function deleteTypeRow(id) { //================================ ลบข้อมูล
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
              url: urlType,
              type: 'GET',
              crossDomain: true,
              data: { opt_k:'del', opt_id:id },
              success: function (result) {
                waiting(false);
                if(result == "success"){
                  myAlert("success", "ข้อมูลถูกลบแล้ว !");
                  showTypeTable(rowperpage, page_selected);
                }else{
                  sw_Alert('error', 'ลบข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
                }          
              },
              error: function (err) {
                  console.log("Delete type ERROR : " + err);
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

function editTypeRow(id) { //================================ เปิดหน้าแก้ไขข้อมูล      
    var html = `     
    <div id="type_edit">    
      <form class="animate__animated animate__fadeIn" id="edit_type_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;"> แก้ไขข้อมูลประเภทสินค้า </div>     
        </div> 
        <div class="row mb-3 justify-content-center" style="position: relative;">
          <img id="picType" src="" alt="type" style="width:300px; outline:2px solid #c0c0c0; outline-offset: 1px;">  
          <label class="camera" for="upload_picType" title="อัพโหลดรูปใหม่">
            <i class="fa-solid fa-camera"></i>  
            <input type="file" id="upload_picType" name="upload_picType" style="display:none" accept="image/*">
          </label>
        </div> 
        <div class="row">        
          <div class="col-md">
            <div class="input-group mb-4">
              <span class="input-group-text" ><i class="fa-solid fa-font-awesome"></i></span>
              <input type="text" id="name_type" class="form-control" placeholder="ชื่อ-ประเภทสินค้า" aria-label="type name" required>
            </div>
            <div class="row justify-content-center" style="text-align: center;">
                <button type="submit" class="mybtn btnOk">บันทึก</button>
                <button type="button" class="mybtn btnCan" id="cancelEditType">ยกเลิก</button>
                <input id="id_type" type="hidden">
                <input id="url_Pic" type="hidden">
            </div>
          </div>
        </div>       
      </form>
    </div>  
    `;
    $("#edit_type").html(html);
    $("#id_type").val(id);    
    var picType = ($("#t_urlpic"+id).val() == '' || $("#t_urlpic"+id).val() == 'undefined')?pic_no: $("#t_urlpic"+id).val()
    $('#picType').attr('src',picType);
    $("#url_Pic").val(picType);
    $("#name_type").val($('#name' + id).html());
    $("#table_type").html("");
    
  }

  $(document).on("click", "#cancelEditType", function () { //========== ยกเลิกการแก้ไขข้อมูล
    clsTypeShow();
    showTypeTable(rowperpage, page_selected);
  });

  
$(document).on("submit", "#edit_type_form", function () {  //===== ตกลงแก้ไข/เปลี่ยนข้อมูล
    let my_form = $(this);
    const id_type = my_form.find("#id_type").val();
    const name_type = my_form.find("#name_type").val();
    const typePic = my_form.find("#url_Pic").val();  
    waiting();
    $.ajax({
      url: urlType,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'edit', opt_id:id_type, opt_nm:name_type, opt_urlPic:typePic},
      success: function (result) {
        waiting(false);
        if(result == "success"){
          waiting(false);
          myAlert("success", "แก้ไขข้อมูล สำเร็จ");
          clsTypeShow();
          showTypeTable(rowperpage, page_selected);
        }else if (result == "exits") {
            sw_Alert('warning', 'แก้ไขข้อมูล ไม่สำเร็จ', 'ชื่อประเภท ซ้ำ! กรุณาเปลี่ยนใหม่');
        }else {
            sw_Alert('error', 'แก้ไขข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }          
      },
      error: function (err) {
          console.log("Edit type ERROR : " + err);
      }
    });
    return false;
});

$(document).on("change", "#upload_picType", function (e) {
    if (e.target.files) {
        waiting();
        var idType = $("#id_type").val();
        var n_file = 'type-' + idType;
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

                var urlPicType = $("#url_Pic").val();
                var id_pic_del = (urlPicType.includes("id=")) ? urlPicType.split('id=')[1] : '';
                const obj = {
                    opt_k: "upTypePic",
                    id: idType,
                    fName: n_file,
                    fileId: id_pic_del,
                    fileName: imageFile.name,
                    mimeType: imageFile.type,
                    fdata: vals
                }
                fetch(urlType, {
                    method: "POST",
                    body: JSON.stringify(obj)
                })
                    .then(function (response) {
                        return response.text()
                    }).then(function (data) {
                        let res = JSON.parse(data);
                        if (res.result == "success") {
                            const fullIdPic = linkPic(res.id, pic_no);
                            $('#picType').attr('src', fullIdPic);
                            $("#url_Pic").val(fullIdPic);
                           // myAlert("success", "อัพโหลดรูปภาพ สำเร็จ");
                        } else {
                            console.log("Upload picture type ERROR : ");
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