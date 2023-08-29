/*===============================  การจัดการสินค้า =================================*/
$(document).on("click", "#product_mng", function () {
    page_selected = 1;
    var html = `
    <div class="container-fluid">
      <div class="row">                
          <div class="col-lg-10 mx-auto mt-4">
              <label class="fn_name" ><i class="fa-regular fa-rectangle-list fa-lg"></i> &nbsp; รายการสินค้า</label>
              <form id="fmsearch_product" >
                  <div class="input-group mb-2">
                      <input type="text" id="search_product" onkeypress="handle_productSearch(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search">
                      <button class="b-success" type="button" id="bt_search_product" title="ค้นหา"><i class="fas fa-search"></i></button>
                      <button class="b-add ms-2" id="btAddProduct" type="button" title="เพิ่มข้อมูล"><i class="fa-solid fa-plus fa-lg"></i></button>
                      <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                  </div>
              </form> 
          </div>          
      </div>   
      <div class="row">  
          <div class="col-lg-7 col-md-9 col-sm-12 mx-auto" id="add_product"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="edit_product"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-10 mx-auto" id="table_product"></div>
      </div>
    </div>
      `;      
    $("#main_setting").html(html);
    showProductTable(rowperpage, 1); //<<<<<< แสดงตาราง rowperpage,page_sel
});

function clsProductShow(){
    $("#add_product").html("");
    $("#edit_product").html("");
    $("#table_product").html("");
  
}

$(document).on('click', "#bt_search_product", function () {  //ค้นหารายการ
    showProductTable(rowperpage, 1);
});

function handle_productSearch(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        showProductTable(rowperpage, 1);
    }
}

function showProductTable(per, p) { //======================== แสดงตาราง
    waiting();
    var strSearch = document.getElementById('search_product').value;
    var n = ((p - 1) * per);
  $.ajax({
    url: urlProduct,
    type: 'GET',
    crossDomain: true,
    data: { opt_k: 'read', opt_sh: strSearch, opt_pe: per, opt_p: p },
    success: function (result) {
      const myArr = JSON.parse(JSON.stringify(result));
      let page_all = myArr[myArr.length - 1].page;
      let rec_all = myArr[myArr.length - 1].rec;
      page_selected = (p >= page_all) ? page_all : p;
      var tt = `
        <table class="list-table table animate__animated animate__fadeIn" id="productTable" >
          <thead>
            <tr>
              <th class="text-center" style="width:5%">ลำดับ</th> 
              <th class="text-left">สินค้า</th>
              <th class="text-left">ยี่ห้อ</th>
              <th class="text-left">ประเภท</th>
              <th class="text-left">รายละเอียด</th>
              <th class="text-center">แก้ไข&nbsp;&nbsp;&nbsp;ลบ</th>                
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table> 
          <div class="row animate__animated animate__fadeIn">
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem;">
              <label  for="rowShow_product">แถวแสดง:</label>
              <input type="number" id="rowShow_product" name="rowShow_product" min="1" max="99" step="1" value="" style="text-align:center;">
            </div>
            <div class="col-sm-6 mb-2">
              <div id="pagination"></div>
            </div>
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem; text-align:right;">
              <label id="record"></label>
            </div>
          </div>                     
        `;
      $("#table_product").html(tt);
      $("#rowShow_product").val(rowperpage.toString());
      $("#record").html("ทั้งหมด : " + rec_all + " รายการ");
      for (let i = 0; i < myArr.length - 1; i++) {
        n++;
        listProductTable(myArr[i], n);
      }
      pagination_show(p, page_all, rowperpage, 'showProductTable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
      waiting(false);
    },
    error: function (err) {
      console.log("The server  ERROR says: " + err);
    }
  });
}

$(document).on("change", "#rowShow_product", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
    rowperpage = +$("#rowShow_product").val();
    showProductTable(rowperpage, 1);
});

function listProductTable(ob, i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางข้อมูล
    let tableName = document.getElementById('productTable');
    let prev = tableName.rows.length;
    let row = tableName.insertRow(prev);
    row.id = "row" + ob.id;
    row.style.verticalAlign = "top";
    txtDel = `<i class="fas fa-trash-alt" onclick="deleteProductRow(` + ob.id + `)" style="cursor:pointer; color:#d9534f;"></i>`;
    let n_col = 6;
    let col = [];
    for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
    }
    col[0].innerHTML = `<div id="no" class="text-center">` + i_no + `</div>`;
    col[1].innerHTML = `<div id="name` + ob.id + `" class="text-left">` + ob.name + `</div>`;
    col[2].innerHTML = `<div id="brand` + ob.id + `" class="text-left">` + ob.brand + `</div>`;
    col[3].innerHTML = `<div id="type` + ob.id + `" class="text-left">` + ob.type + `</div>`;
    col[4].innerHTML = `<div id="desc` + ob.id + `" class="text-left">` + ob.desc + `</div>`;

    col[n_col - 1].innerHTML = `
      <input type="hidden" id="id_product` + ob.id + `" value="` + ob.id + `" />
      <input type="hidden" id="p_urlpic1_` + ob.id + `" value="` + ob.urlpic1 + `" />
      <input type="hidden" id="p_urlpic2_` + ob.id + `" value="` + ob.urlpic2 + `" />
      <input type="hidden" id="p_urlpic3_` + ob.id + `" value="` + ob.urlpic3 + `" />
      <input type="hidden" id="p_urlpic4_` + ob.id + `" value="` + ob.urlpic4 + `" />
      <input type="hidden" id="p_urlpic5_` + ob.id + `" value="` + ob.urlpic5 + `" />
      <input type="hidden" id="p_urlpic6_` + ob.id + `" value="` + ob.urlpic6 + `" />
      
      <i class="fas fa-edit me-3" onclick="editProductRow(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
      `+ txtDel;
    col[n_col - 1].style = "text-align: center;";
}


$(document).on("click", "#btAddProduct", function () { //========== เปิดเพิ่มข้อมูล
    clsProductShow();
    var html = `     
      <div id="product_add">    
        <form class="animate__animated animate__fadeIn" id="add_product_form" style="padding:20px;">
          <div class="row mb-3 justify-content-md-center">
            <div style="font-size:1.5rem; text-align: center;"> เพิ่มรายการสินค้า </div>     
          </div> 
          <div class="row">
            <div class="col-md">
                <div class="input-group mb-2">
                    <span class="input-group-text" style="width:80px;" >ชื่อสินค้า</span>
                    <input type="text" id="name_product" class="form-control" placeholder="ชื่อ-สินค้า" aria-label="product name" required>
                </div> 
                <div class="input-group mb-2">
                    <span class="input-group-text" style="width:80px;" >ยี่ห้อ</span>
                    <input type="text" id="brand_product" class="form-control" placeholder="ยี่ห้อ/รุ่น" aria-label="product brand" required>
                </div> 
                <div class="input-group mb-2">
                    <label class="input-group-text" for="selType" style="width:80px;">ประเภท</label>
                    <select class="form-select" id="selType">
                        <option selected value="0">-- ประเภท --</option>
                    </select>
                    </div>      
                <div class="input-group mb-4">
                    <span class="input-group-text" style="width:100px;" >รายละเอียด</span>
                    <input type="text" id="desc_product" class="form-control" placeholder="รายละเอียด-สินค้า" aria-label="product description" required>
                </div>     
            </div>
            
          </div>   
          <div class="row justify-content-center" style="text-align: center;">
            <button type="submit" class="mybtn btnOk">บันทึก</button>
            <button type="button" class="mybtn btnCan" id="cancel_add_product">ยกเลิก</button>
          </div>             
          
        </form>
      </div>  
      `;
    $("#add_product").html(html);
    initDropdownList(urlType,'selType', 'type!A2:B', 0, 1) 
  });

$(document).on("click", "#cancel_add_product", function () { //========== ยกเลิกการเพิ่มข้อมูล
    clsProductShow();
    showProductTable(rowperpage, page_selected);
  });

$(document).on("submit", "#add_product_form", function () {  //===== ตกลงเพิ่มข้อมูล
    let my_form = $(this);
    const name_product = my_form.find("#name_product").val();
    const brand_product = my_form.find("#brand_product").val();
    const desc_product = my_form.find("#desc_product").val();
    const sel_type_index = document.getElementById("selType").selectedIndex;
    const sel_type = document.getElementById("selType").options[sel_type_index].text;
    if(sel_type_index !== 0 ){
        waiting();
        $.ajax({
        url: urlProduct,
        type: 'GET',
        crossDomain: true,
        data: { opt_k: 'add', opt_nm:name_product, opt_brand:brand_product, opt_type:sel_type, opt_desc:desc_product},
        success: function (result) {
            waiting(false);
            if(result == "success"){
            myAlert("success", "เพิ่มข้อมูล สำเร็จ");
            $("#add_product").html("");
            showProductTable(rowperpage, page_selected);
            }else if(result == "exits"){
            sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', name_product + ' ซ้ำ! มีการใช้ชื่อนี้แล้ว');
            }else{
            sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
            }          
        },
        error: function (err) {
            console.log("Add new type ERROR : " + err);
        }
        });
    }else{
        sw_Alert('warning', 'ข้อมูลไม่ครบ!', 'กรุณาระบุ ประเภทสินค้า');
    }
    return false;
});

function deleteProductRow(id) { //================================ ลบข้อมูล
    var del_name = $('#name' + id).html();
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
              url: urlProduct,
              type: 'GET',
              crossDomain: true,
              data: { opt_k:'del', opt_id:id },
              success: function (result) {
                waiting(false);
                if(result == "success"){
                  myAlert("success", "ข้อมูลถูกลบแล้ว !");
                  showProductTable(rowperpage, page_selected);
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

function editProductRow(id) { //================================ เปิดหน้าแก้ไขข้อมูล      
    var html = `     
    <div id="product_edit">    
      <form class="animate__animated animate__fadeIn" id="edit_product_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;"> แก้ไขข้อมูลสินค้า </div>     
        </div> 
        <div class="row mb-2" id="picProduct"> 
        <!--
            <div class="col-md-4 col-sm-6">
                <img id="picProduct1" class="img-thumbnail" src="images/product/noimage.jpg" alt="product1" >  
            </div>
            <div class="col-md-4 col-sm-6">
                <img id="picProduct2" class="img-thumbnail" src="images/product/noimage.jpg" alt="product2" >  
            </div>
            <div class="col-md-4 col-sm-6">
                <img id="picProduct3" class="img-thumbnail" src="images/product/noimage.jpg" alt="product3" >  
            </div>
            <div class="col-md-4 col-sm-6">
                <img id="picProduct4" class="img-thumbnail" src="images/product/noimage.jpg" alt="product4" >  
            </div>
            <div class="col-md-4 col-sm-6">
                <img id="picProduct5" class="img-thumbnail" src="images/product/noimage.jpg" alt="product5" >  
            </div>
            <div class="col-md-4 col-sm-6">
                <img id="picProduct6" class="img-thumbnail" src="images/product/noimage.jpg" alt="product6" >  
            </div>
            -->
        </div> 
        <!-- <div class="row mb-3 justify-content-center" style="position: relative;">
          <img id="picType" src="" alt="type" style="width:300px; outline:2px solid #c0c0c0; outline-offset: 1px;">  
          <label class="camera" for="upload_picType" title="อัพโหลดรูปใหม่">
            <i class="fa-solid fa-camera"></i>  
            <input type="file" id="upload_picType" name="upload_picType" style="display:none" accept="image/*">
          </label>
        </div>  -->
        <div class="row">        
            <div class="col-md">
                <div class="input-group mb-2">
                    <span class="input-group-text" style="width:80px;" >ชื่อสินค้า</span>
                    <input type="text" id="name_product" class="form-control" placeholder="ชื่อ-สินค้า" aria-label="product name" required>
                </div> 
                <div class="input-group mb-2">
                    <span class="input-group-text" style="width:80px;" >ยี่ห้อ</span>
                    <input type="text" id="brand_product" class="form-control" placeholder="ยี่ห้อ/รุ่น" aria-label="product brand" required>
                </div> 
                <div class="input-group mb-2">
                    <label class="input-group-text" for="selType" style="width:80px;">ประเภท</label>
                    <select class="form-select" id="selType">
                        <option selected value="0">-- ประเภท --</option>
                    </select>
                </div>      
                <div class="input-group mb-4">
                    <span class="input-group-text" style="width:100px;" >รายละเอียด</span>
                    <input type="text" id="desc_product" class="form-control" placeholder="รายละเอียด-สินค้า" aria-label="product description" required>
                </div>   
                <div class="row justify-content-center" style="text-align: center;">
                    <button type="submit" class="mybtn btnOk">บันทึก</button>
                    <button type="button" class="mybtn btnCan" id="cancelEditProduct">ยกเลิก</button>
                    <input id="id_product" type="hidden">
                    <input id="url_Pic" type="hidden">
                </div>
            </div>
        </div>       
      </form>
    </div>  
    `;
    $("#edit_product").html(html);
    $("#id_product").val(id);   
    $("#name_product").val($("#name"+id).html()); 
    $("#brand_product").val($("#brand"+id).html()); 
    $("#desc_product").val($("#desc"+id).html()); 
    setDropdownList(urlProduct,'selType', 'type!A2:B', $("#type"+id).html(),0,1);

    /*var picType = ($("#t_urlpic"+id).val() == '' || $("#t_urlpic"+id).val() == 'undefined')?pic_no: $("#t_urlpic"+id).val()
    $('#picType').attr('src',picType);
    $("#url_Pic").val(picType);*/
    $("#table_product").html("");
    addNoPic();
    
  }

  $(document).on("click", "#cancelEditProduct", function () { //========== ยกเลิกการแก้ไขข้อมูล
    clsProductShow();
    showProductTable(rowperpage, page_selected);
  });

  function addNoPic(){
    let picSet = document.getElementById("picProduct");
    let picDiv = document.createElement('div');
    let picImg = document.createElement('img');
    picDiv.classList.add("col-md-4");
    picDiv.classList.add("col-sm-6");
    picDiv.id = 'addPicClick';
    picImg.classList.add("img-thumbnail")
    picImg.setAttribute('src','images/product/addPic.png');
    picImg.setAttribute('style','cursor:pointer');
    picImg.setAttribute('onclick','addPic();');
    picDiv.appendChild(picImg);
    picSet.appendChild(picDiv);
  }

  function addPic(){
    let picSet = document.getElementById("picProduct");
    let picDiv = document.createElement('div');
    let picImg = document.createElement('img');
    let picI = document.createElement('i');
    picDiv.classList.add("col-md-4");
    picDiv.classList.add("col-sm-6");
    let numPic = (picSet.children.length - 1);
    picDiv.id = 'picD'+ numPic;
    picDiv.setAttribute('style','position:relative; ');
    picImg.classList.add("img-thumbnail")
    picImg.setAttribute('src','images/ME.jpg');
    picImg.id = 'pic'+ numPic;
    picI.classList.add("fa-solid");
    picI.classList.add("fa-circle-xmark");
    picI.setAttribute('style','color: #fb3737; cursor:pointer; position:absolute; right:12px; background:#fff; border-radius:50%;');
    picI.setAttribute('onclick','delPic('+ numPic +');');
    picDiv.appendChild(picImg);
    picDiv.appendChild(picI);
    picSet.insertBefore(picDiv,picSet.firstChild);
    console.log($('#pic'+ numPic).attr('src'));
    if(picSet.children.length > 6){
        $("#addPicClick").css("display", "none");
    }
  }

  function delPic(id){
    let picSet = document.getElementById("picProduct");
    
    
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'mybtn btnOk',
            cancelButton: 'mybtn btnCan'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'ลบรูปภาพ ',
        text: "โปรดยืนยัน ตกลงหรือไม่ ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '&nbsp;&nbsp;ตกลง&nbsp;&nbsp;',
        cancelButtonText: '&nbsp;&nbsp;ไม่&nbsp;&nbsp;',
        reverseButtons: false
    }).then((result) => {
        if (result.isConfirmed) {
            $("#picD"+id).remove();
            if(picSet.children.length <= 6){
                $("#addPicClick").css("display", "block");
            }
            /*waiting();
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
            });   */      
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            /*swalWithBootstrapButtons.fire(
                'ยกเลิก',
                'ข้อมูลของคุณยังไม่ถูกลบ :)',
                'error'
            )*/
        }
    })
  }