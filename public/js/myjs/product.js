/*===============================  การจัดการสินค้า =================================*/
var openProduct = () =>{
  page_selected = 1;
  is_sort = true;
  col_sort = 1;
  raw_sort = 0;
  let html = `
  <div class="container-fluid">
    <div class="row">                
        <div class="col-lg-12 mx-auto mt-4">
            <a class="fn_name" ><i class="fa-regular fa-rectangle-list fa-lg"></i> &nbsp; รายการสินค้า</a>
            <form id="fmsearch_product" >
                <div class="input-group mb-2">
                    <input type="text" id="search_product" onkeypress="handle_productSearch(event)" class="form-control" placeholder="คำค้นหา.."
                     aria-label="Search" aria-describedby="button-search" style="border-radius:18px 0 0 18px;">
                    <button class="b-success" type="button" id="bt_search_product" title="ค้นหา" style="border-radius:0 18px 18px 0;"><i class="fas fa-search"></i></button>
                    <button class="b-add ms-2" id="btAddProduct" type="button" title="เพิ่มข้อมูล"><i class="fa-solid fa-plus fa-lg"></i></button>
                    <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                </div>
            </form> 
        </div>          
    </div>   
    <div class="row">  
        <div class="col-lg-10 col-md-10 col-sm-12 mx-auto" id="add_product"></div>
    </div>   
    <div class="row">  
        <div class="col-lg-10 col-md-11 col-sm-12 mx-auto" id="edit_product"></div>
    </div>   
    <div class="row">  
      <div id="table_product_all">
        <div class="col-lg-12 mx-auto table-scroll mb-2" id="table_product" style="height: calc(100vh - 200px);"></div>
        <div class="row">
          <div class="col-auto me-auto" style="font-size: 0.8rem;">
            <label  for="rowShow_product">แถวแสดง:</label>
            <input type="number" id="rowShow_product" name="rowShow_product" min="1" max="99" step="1" value="" style="text-align:center;">
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
  </div>
    `;      
  $("#main_setting").html(html);
  loadDataProduct();
}

function loadDataProduct(show = true) {
  if(show === true) waiting();
  $.ajax({
      url: urlProduct,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'readAll'},
      success: function (result) {
          dataAllShow = result;
          if(show === true) showProductTable(rowperpage, page_selected); //<<<<<< แสดงตาราง rowperpage,page_sel   
          waiting(false);
      },
      error: function (err) {
          console.log("The server  ERROR says: " + err);
      }
  });
}

function myProductData(shText = "", colSort = 0, isSort = false, rawSort = 0, page = 1, perPage = 10){
  const search_str = shText.toLowerCase().split(",");
  if(isSort == true ) sortByCol(dataAllShow, colSort, rawSort); //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
  let array_Arg = new Array();
  let sumData = [0,0,0];
  for(let i = 0; i < dataAllShow.length; i++){
      const showOnPage =( dataAllShow[i][14] == 'TRUE')?"enable":"disable"      //ข้อมูลแสดงสินค้าบนเพจ
      const forSearch = dataAllShow[i][1]+dataAllShow[i][2]+dataAllShow[i][3]+dataAllShow[i][4]+showOnPage+""
      const condition = search_str.some(el => forSearch.toLowerCase().includes(el))
      if (condition) {
          let jsonArg = new Object();
          jsonArg.id = dataAllShow[i][0];
          jsonArg.name = dataAllShow[i][1]; 
          jsonArg.brand = dataAllShow[i][2]; 
          jsonArg.type = dataAllShow[i][3]; 
          jsonArg.desc = dataAllShow[i][4]; 
          jsonArg.urlpic1 = dataAllShow[i][5];  
          jsonArg.urlpic2 = dataAllShow[i][6]; 
          jsonArg.urlpic3 = dataAllShow[i][7]; 
          jsonArg.urlpic4 = dataAllShow[i][8]; 
          jsonArg.urlpic5 = dataAllShow[i][9]; 
          jsonArg.urlpic6 = dataAllShow[i][10]; 
          jsonArg.qty = dataAllShow[i][11]; 
          jsonArg.cost = dataAllShow[i][12]; 
          jsonArg.price = dataAllShow[i][13]; 
          jsonArg.show = dataAllShow[i][14]; 
          jsonArg.rate = dataAllShow[i][15]; 
          jsonArg.oldPrice = dataAllShow[i][16]; 
          sumData[0] = sumData[0] + +dataAllShow[i][11];
          sumData[1] = sumData[1] + (+dataAllShow[i][11] * +dataAllShow[i][12]);
          sumData[2] = sumData[2] + (+dataAllShow[i][11] * +dataAllShow[i][13]);
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
  pageAll.qty = sumData[0];
  pageAll.cost = sumData[1];
  pageAll.price = sumData[2];
  array_Data.push(pageAll);
  return array_Data;
}

function clsProductShow(){
  $("#add_product").html("");
  $("#edit_product").html("");
  $("#table_product").html("");
  document.getElementById("table_product_all").style.display = "none";

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

function showProductTable(per=10, p=1, colSort=1, isSort=true, rawSort=0) { //======================== แสดงตาราง
  const strSearch = document.getElementById('search_product').value;
  let n = ((p - 1) * per);
    const myArr = myProductData(strSearch, colSort, isSort, rawSort, p, per);
    let page_all = myArr[myArr.length - 1].page;
    let rec_all = myArr[myArr.length - 1].rec;
    let sum_qty = myArr[myArr.length - 1].qty;
    let sum_cost = myArr[myArr.length - 1].cost;
    let sum_price = myArr[myArr.length - 1].price;
    page_selected = (p >= page_all) ? page_all : p;
    is_sort = isSort;
    col_sort = colSort;
    raw_sort = rawSort;
    let on_clk = ['','','','','']; 
    let sortTxt = ['','','','',''];  
    for(let j=0; j < on_clk.length; j++){
      if(j == colSort){
          if(rawSort == 0){
              on_clk[j] = 'showProductTable(rowperpage,1,'+j+',true,1);';
              sortTxt[j] = '<i class="fa-solid fa-sort-up"></i>';
              
          }else{
              on_clk[j] = 'showProductTable(rowperpage,1,'+j+',true,0);';
              sortTxt[j] = '<i class="fa-solid fa-sort-down"></i>';
          }        
      }else{
          on_clk[j] = 'showProductTable(rowperpage,1,'+j+',true,0);';
          sortTxt[j] = '<i class="fa-solid fa-sort"></i>';
      }
    }
    let tt = `
      <table class="list-table table animate__animated animate__fadeIn" id="productTable" >
        <thead>
          <tr>
            <th class="text-center" style="width:5%">ลำดับ</th> 
            <th class="text-start sort-hd" onclick="`+on_clk[1]+`">`+sortTxt[1]+`&nbsp; สินค้า</th>
            <th class="text-start sort-hd" onclick="`+on_clk[2]+`">`+sortTxt[2]+`&nbsp; ยี่ห้อ</th>
            <th class="text-start sort-hd" onclick="`+on_clk[3]+`">`+sortTxt[3]+`&nbsp; ประเภท</th>
            <th class="text-start sort-hd" onclick="`+on_clk[4]+`">`+sortTxt[4]+`&nbsp; รายละเอียด</th>
            <th class="text-end">จำนวน</th>
            <th class="text-end">Cost</th>
            <th class="text-end">@</th>
            <th class="text-center">แก้ไข&nbsp;&nbsp;&nbsp;ลบ</th>                
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table> 
      `;      
    document.getElementById("table_product_all").style.display = "block";
    $("#table_product").html(tt);    
    $("#rowShow_product").val(rowperpage.toString());
    $("#record").html("รวม "+ rec_all + " รายการ = "+ sum_qty +" หน่วย = "+ numWithCommas(sum_cost) +" / "+ numWithCommas(sum_price) +" บาท");
    for (let i = 0; i < myArr.length - 1; i++) {
      n++;
      listProductTable(myArr[i], n);
    }
    pagination_show(p, page_all, rowperpage, 'showProductTable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
}

$(document).on("change", "#rowShow_product", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
  rowperpage = +$("#rowShow_product").val();
  showProductTable(rowperpage, 1);
});

function listProductTable(ob, i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางข้อมูล
  const tableName = document.getElementById('productTable');
  const prev = tableName.rows.length;
  let row = tableName.insertRow(prev);
  row.id = "row" + ob.id;
  row.style.verticalAlign = "top";
  txtDel = `<i class="fas fa-trash-alt" onclick="deleteProductRow(` + ob.id + `)" style="cursor:pointer; color:#d9534f;"></i>`;
  txtColorShow = (ob.show == 'TRUE')?' style="color:#000066;" ':'';
  const n_col = 9;
  let col = [];
  for (let ii = 0; ii < n_col; ii++) {
      col[ii] = row.insertCell(ii);
  }
  col[0].innerHTML = `<div id="no" class="text-center">` + i_no + `</div>`;
  col[1].innerHTML = `<div id="name` + ob.id + `" class="text-start" ${txtColorShow} >` + ob.name + `</div>`;
  col[2].innerHTML = `<div id="brand` + ob.id + `" class="text-start">` + ob.brand + `</div>`;
  col[3].innerHTML = `<div id="type` + ob.id + `" class="text-start">` + ob.type + `</div>`;
  col[4].innerHTML = `<div id="desc` + ob.id + `" class="text-start">` + ob.desc + `</div>`;
  col[5].innerHTML = `<div id="qty` + ob.id + `" class="text-end">` + ob.qty + `</div>`;
  col[6].innerHTML = `<div id="cost` + ob.id + `" class="text-end">` + ob.cost + `</div>`;
  col[7].innerHTML = `<div id="price_show` + ob.id + `" class="text-end">` + ob.price + `</div>`;

  col[n_col - 1].innerHTML = `
    <input type="hidden" id="id_product` + ob.id + `" value="` + ob.id + `" />
    <input type="hidden" id="p_urlpic1_` + ob.id + `" value="` + ob.urlpic1 + `" />
    <input type="hidden" id="p_urlpic2_` + ob.id + `" value="` + ob.urlpic2 + `" />
    <input type="hidden" id="p_urlpic3_` + ob.id + `" value="` + ob.urlpic3 + `" />
    <input type="hidden" id="p_urlpic4_` + ob.id + `" value="` + ob.urlpic4 + `" />
    <input type="hidden" id="p_urlpic5_` + ob.id + `" value="` + ob.urlpic5 + `" />
    <input type="hidden" id="p_urlpic6_` + ob.id + `" value="` + ob.urlpic6 + `" />
    <input type="hidden" id="price` + ob.id + `" value="` + ob.price + `" />
    <input type="hidden" id="show` + ob.id + `" value="` + ob.show + `" />
    <input type="hidden" id="rate` + ob.id + `" value="` + ob.rate + `" />
    <input type="hidden" id="oldPrice` + ob.id + `" value="` + ob.oldPrice + `" />
    
    <i class="fas fa-edit me-3" onclick="editProductRow(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
    `+ txtDel;
  col[n_col - 1].style = "text-align: center;";
}


$(document).on("click", "#btAddProduct", function () { //========== เปิดเพิ่มข้อมูล
  clsProductShow();
  let html = `     
    <div id="product_add" class="main_form">    
      <form class="animate__animated animate__fadeIn" id="add_product_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div class="main_form_head"> เพิ่มรายการสินค้า </div>     
        </div> 
        <div class="row">
          <div class="col-md-12">
            <div class="input-group mb-2">
              <span class="input-group-text" style="width:80px;" >ชื่อสินค้า</span>
              <input type="text" id="name_product" class="form-control" placeholder="ชื่อ-สินค้า" aria-label="product name" required>
            </div>
          </div>           
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="input-group mb-2">
              <span class="input-group-text" style="width:80px;" >ยี่ห้อ</span>
              <input type="text" id="brand_product" class="form-control" placeholder="ยี่ห้อ/รุ่น" aria-label="product brand">
            </div>  
          </div> 
          <div class="col-md-6">
            <div class="input-group mb-2">
              <label class="input-group-text" for="selType" style="width:80px;">ประเภท</label>
              <select class="form-select" id="selType">
                  <option selected value="0">-- ประเภท --</option>
              </select>
            </div>   
          </div> 
        </div> 

        <div class="row">          
          <div class="col-md-6">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 80px; background:#ee8080; color:#fff;" for="oldPrice_product">ราคาเดิม</label>
              <input type="number" id="oldPrice_product" class="form-control" aria-label="old product price" min="0" step="0.1" value="0">
              
            </div> 
          </div>
          <div class="col-md-6">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 80px;" for="price_product">ราคาขาย</label>
              <input type="number" id="price_product" class="form-control" aria-label="product price" min="0" step="0.1" value="0">
            </div> 
          </div> 
        </div> 

        <div class="row">
          <div class="col-md-12">
            <div class="input-group mb-2"> 
             <textarea rows="4" id="desc_product" class="form-control" placeholder="รายละเอียด-สินค้า"></textarea>
            </div> 
          </div>           
        </div> 

        <div class="row">        
        <div class="col-md-6">
          <div class="form-check form-switch d-flex justify-content-center pt-2 mb-3">
            <input class="form-check-input" type="checkbox" id="showCheck" name="showCheck">
            <label class="form-check-label" for="showCheck"> &nbsp; &nbsp;แสดงสินค้าบนเพจ</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="input-group mb-2">
            <label class="input-group-text " style="width: 80px; background:#20aaee; color:#fff" for="rate_product">Rate</label>
            <input type="number" id="rate_product" class="form-control" aria-label="product rate" min="0" max="10" step="1" value="0">
          </div>     
        </div>
      </div>

        <div class="row justify-content-center mt-4" style="text-align: center;">
          <button type="submit" class="mybtn btnOk me-4">บันทึก</button>
          <button type="button" class="mybtn btnCan ms-4" id="cancel_add_product">ยกเลิก</button>
        </div>  

      </form>
    </div>  
    `;
  $("#add_product").html(html);
  initDropdownList(urlData,'selType', 'type');
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
  const price_product = my_form.find("#price_product").val();
  const sel_type_index = document.getElementById("selType").selectedIndex;
  const sel_type = (document.getElementById("selType").options[sel_type_index].text).split("--")[0];
  const show = (my_form.find('#showCheck').prop("checked"))?"TRUE":"FALSE";
  const rate = my_form.find("#rate_product").val();
  const oldPrice = my_form.find("#oldPrice_product").val();
  if(sel_type_index !== 0 ){
      waiting();
      $.ajax({
      url: urlProduct,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'add', opt_nm:name_product, opt_brand:brand_product, opt_type:sel_type, opt_desc:desc_product, opt_price:price_product,
              opt_show:show, opt_rate:rate, opt_oldPrice:oldPrice},
      success: function (result) {
          waiting(false);
          if(result == "success"){
          myAlert("success", "เพิ่มข้อมูล สำเร็จ");
          $("#add_product").html("");
          loadDataProduct();
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
  const del_name = $('#name' + id).html();
  const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
          confirmButton: 'mybtn btnOk me-4',
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
                loadDataProduct();
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
  let html = `     
  <div id="product_edit" class="main_form mb-4">    
    <form class="animate__animated animate__fadeIn" id="edit_product_form" style="padding:20px;">
      <div class="row mb-3 justify-content-md-center">
        <div class="main_form_head"> แก้ไขข้อมูลสินค้า </div>     
      </div> 
      <div class="row mb-2 " id="picProduct"> 
      </div> 
      <div class="row">        
        <div class="col-md-12">
          <div class="input-group mb-2">
              <span class="input-group-text" style="width:80px;" >ชื่อสินค้า</span>
              <input type="text" id="name_product" class="form-control" placeholder="ชื่อ-สินค้า" aria-label="product name" required>
          </div> 
        </div>        
      </div>

      <div class="row">   
        <div class="col-md-6">
          <div class="input-group mb-2">
            <span class="input-group-text" style="width:80px;" >ยี่ห้อ</span>
            <input type="text" id="brand_product" class="form-control" placeholder="ยี่ห้อ/รุ่น" aria-label="product brand" required>
          </div> 
        </div> 
        <div class="col-md-6">
          <div class="input-group mb-2">
              <label class="input-group-text" for="selType" style="width:80px;">ประเภท</label>
              <select class="form-select" id="selType">
                  <option selected value="0">-- ประเภท --</option>
              </select>
          </div>
        </div>                    
      </div>

      <div class="row">   
        <div class="col-md-6">
          <div class="input-group mb-2">
            <label class="input-group-text " style="width: 80px; background:#ee8080; color:#fff;" for="oldPrice_product">ราคาเดิม</label>
            <input type="number" id="oldPrice_product" class="form-control" aria-label="Old product price" min="0" step="0.1" value="0">
          </div>
        </div> 
        <div class="col-md-6">
          <div class="input-group mb-2">
            <label class="input-group-text " style="width: 80px;" for="price_product">ราคาขาย</label>
            <input type="number" id="price_product" class="form-control" aria-label="product price" min="0" step="0.1" value="0">
          </div>     
        </div>
      </div>

      <div class="row">        
        <div class="col-md-12">
          <div class="input-group mb-2">
              <textarea rows="4" id="desc_product" class="form-control" placeholder="รายละเอียด-สินค้า"></textarea>
          </div> 
        </div>        
      </div>

      <div class="row">        
        <div class="col-md-6">
          <div class="form-check form-switch d-flex justify-content-center pt-2 mb-3">
            <input class="form-check-input" type="checkbox" id="showCheck" name="showCheck">
            <label class="form-check-label" for="showCheck"> &nbsp; &nbsp;แสดงสินค้าบนเพจ</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="input-group mb-2">
            <label class="input-group-text " style="width: 80px; background:#20aaee; color:#fff;" for="rate_product">Rate</label>
            <input type="number" id="rate_product" class="form-control" aria-label="product rate" min="0" max="10" step="1" value="0">
          </div>     
        </div>
      </div>

      <div class="row justify-content-center mt-4" style="text-align: center;">
        <button type="submit" class="mybtn btnOk me-4">บันทึก</button>
        <button type="button" class="mybtn btnCan ms-4" id="cancelEditProduct">ยกเลิก</button>
        <input id="id_product" type="hidden">
        <input id="url_Pic1" type="hidden">
        <input id="url_Pic2" type="hidden">
        <input id="url_Pic3" type="hidden">
        <input id="url_Pic4" type="hidden">
        <input id="url_Pic5" type="hidden">
        <input id="url_Pic6" type="hidden">        
      </div>     
    </form>

<div class="modal fade " id="imagemodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen-md-down">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <img  src="" id="imagepreview" style="width:100%;" >
      </div>
    </div>
  </div>
</div>

  </div>  
  `;
  $("#edit_product").html(html);
  $("#id_product").val(id);   
  $("#name_product").val($("#name"+id).html()); 
  $("#brand_product").val($("#brand"+id).html()); 
  $("#desc_product").val($("#desc"+id).html()); 
  $("#price_product").val($("#price"+id).val()); 
  $("#oldPrice_product").val($("#oldPrice"+id).val());
  $("#rate_product").val($("#rate"+id).val());  
  $('#showCheck').prop('checked', ($("#show"+id).val()=="TRUE")?true:false);
  //console.log($('#showCheck').prop("checked") ? 1 : 0 )
  
  for(let i=1; i <= 6; i++){
    if($("#p_urlpic"+i+"_"+id).val() == undefined || $("#p_urlpic"+i+"_"+id).val() == "" || $("#p_urlpic"+i+"_"+id).val() == "undefined"){
      picUrlAdd[i-1] = ""
    }else{
      picUrlAdd[i-1] = $("#p_urlpic"+i+"_"+id).val()
    }
    $("#url_Pic"+i).val($("#p_urlpic"+i+"_"+id).val());
  }
  showProductPicPreviewEdit(id);
  setDropdownList(urlData,'selType', 'type', $("#type"+id).html());
  $("#table_product").html("");    
  document.getElementById("table_product_all").style.display = "none";
}

const showProductPicPreviewEdit = (idP) =>{
  let textContent_body ='';
  let textContent_btt ='';
  let textContent = '';
  let n_pic = 0;
  for(let i=1;i<=6;i++){
    let pic = document.getElementById("url_Pic"+i)
      if( pic.value !== '' ){          
        let act = (n_pic===0)?'active':'';
        let act_butt = (n_pic===0)?' class="active" aria-current="true" ':'';
        textContent_btt = textContent_btt + `
        <button type="button" data-bs-target="#carouselProdEdit" data-bs-slide-to="${n_pic}" ${act_butt} aria-label="รูปสินค้า ${n_pic}" ></button>
        `;
        textContent = textContent+`
        <div class="carousel-item ${act}">            
          <img src="${linkPic(pic.value,pic_no)}" class="d-block w-100" alt="product picture" onclick="showPic(${i})">
          <div class="carousel-caption d-block" id="delPicPreviewEditBtn" title="ลบรูปภาพนี้" onclick="delProdPicEdit(${idP},${i})">
            <i class="fas fa-trash-alt" style="position:absolute; top:14px; left:16px;"></i>
          </div>
        </div>
        `;
        n_pic++;
      }
  }
  let showAddPic = (n_pic >= 6)?'':`    
      <label id="addPicPreviewEdit" for="uploadPicProd" title="อัพโหลดรูปใหม่">
        <i class="fa-solid fa-plus" style="position:absolute; top:14px; left:16px;"></i>
        <input type="file" id="uploadPicProd" style="display:none" accept="image/*">
      </label>
       `;
  textContent_body =`
  <div id="carouselProdEdit" class="carousel slide animate__animated animate__fadeIn" data-bs-ride="carousel" data-bs-interval="false">  
    ${showAddPic}  
    <div class="carousel-indicators">
        ${textContent_btt}
    </div>
    <div class="carousel-inner">
        ${textContent}
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselProdEdit" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselProdEdit" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
  </div>
  `;
  if(n_pic == 0){
    textContent_body =`
    <div id="addPicEditClick">
      <label for="uploadPicProd2" title="อัพโหลดรูปใหม่" style="color:#909090; width:100%; height:150px; background:#e5e5e5; font-size:50px; text-align:center; padding:38px 0; cursor: pointer;" >
        <i class="fa-regular fa-square-plus"></i>
        <input type="file" id="uploadPicProd2" style="display:none" accept="image/*">
      </label>
    </div>    
    `;
  }
  $("#picProduct").html(textContent_body);  
}

$(document).on("click", "#cancelEditProduct", function () { //========== ยกเลิกการแก้ไขข้อมูล
  clsProductShow();
  showProductTable(rowperpage, page_selected);
});

function delProdPicEdit(id_prod,nPic){
  const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
          confirmButton: 'mybtn btnOk me-4',
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
          waiting();
          $.ajax({
            url: urlProduct,
            type: 'GET',
            crossDomain: true,
            data: { opt_k:'delPic', opt_id:id_prod , opt_picNo:nPic},
            success: function (result) {
              waiting(false);
              if(result == "success"){
                loadDataProduct(false);
                $("#url_Pic"+nPic).val('')
                picUrlAdd[nPic-1] = ""
                showProductPicPreviewEdit(id_prod)
                myAlert("success", "รูปภาพถูกลบแล้ว !");
              }else{
                sw_Alert('error', 'ลบรูปภาพ ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
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

/*
function addPicPre(no,picId){  
  let picSet = document.getElementById("picProduct");
  let picDiv = document.createElement('div');
  let picImg = document.createElement('img');
  let picI = document.createElement('i');
  picDiv.classList.add("col-md-2");
  picDiv.classList.add("col-sm-3");
  picDiv.classList.add("animate__animated") 
  picDiv.classList.add("animate__fadeIn")
  picDiv.id = 'picD_'+ no;
  picDiv.setAttribute('style','position:relative; ');
  picImg.classList.add("imgShow");
  picImg.classList.add("img-thumbnail");
  picImg.setAttribute('src',linkPic(picId, pic_no));
  picImg.id = 'pic_'+ no;
  picImg.setAttribute('onclick','showPic('+ no +');');
  picI.classList.add("fa-solid");
  picI.classList.add("fa-square-xmark");
  picI.classList.add("fa-lg");
  picI.setAttribute('style','color:#FEA1A1; cursor:pointer; position:absolute; top:10px; right:20px; height:15px; background:#fff; padding-top:6px; ');
  picI.setAttribute('onclick','delPic('+ no +');');
  picDiv.appendChild(picImg);
  picDiv.appendChild(picI);    
  picSet.insertBefore(picDiv,picSet.children[picSet.children.length-1]);
  if(picSet.children.length > 6){
      $("#addPicClick").css("display", "none");
  }
}

*/


function addPic(picId){
  let picSet = document.getElementById("picProduct");
  let picDiv = document.createElement('div');
  let picImg = document.createElement('img');
  let picI = document.createElement('i');
  picDiv.classList.add("col-md-2");
  picDiv.classList.add("col-sm-3");    
  picUrlAdd[picNoAdd-1] = picId;
  picDiv.id = 'picD_'+ picNoAdd;
  picDiv.setAttribute('style','position:relative; ');
  picImg.classList.add("imgShow");
  picImg.classList.add("img-thumbnail");
  picImg.setAttribute('src',linkPic(picId, pic_no));
  picImg.id = 'pic_'+ picNoAdd;
  picImg.setAttribute('onclick','showPic('+ picNoAdd +');');
  picI.classList.add("fa-solid");
  picI.classList.add("fa-square-xmark");
  picI.classList.add("fa-lg");
  picI.setAttribute('style','color:#FEA1A1; cursor:pointer; position:absolute; top:10px; right:20px; height:15px; background:#fff; padding-top:6px;');
  picI.setAttribute('onclick','delPic('+ picNoAdd +');');
  picDiv.appendChild(picImg);
  picDiv.appendChild(picI);    
  if(picSet.children.length == 1){
    picSet.insertBefore(picDiv,picSet.children[picSet.children.length-1]);
  }else{
    picSet.insertBefore(picDiv,picSet.children[picNoAdd-1]);
  }
  //console.log($('#pic_'+ picNoAdd).attr('src'));
  if(picSet.children.length > 6){
      $("#addPicClick").css("display", "none");
  }
  //console.log(picUrlAdd);
}

function showPic(id){
  $('#imagepreview').attr('src', linkPic(picUrlAdd[id-1],pic_no));
  $('#imagemodal').modal('show');  
}

function delPic(id){
  const idProduct = $("#id_product").val();
  let picSet = document.getElementById("picProduct");      
  const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
          confirmButton: 'mybtn btnOk me-4',
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
          $("#picD_"+id).remove();
          picUrlAdd[id-1] = "";
          if(picSet.children.length <= 6){
              $("#addPicClick").css("display", "block");
          }
          waiting();
          $.ajax({
            url: urlProduct,
            type: 'GET',
            crossDomain: true,
            data: { opt_k:'delPic', opt_id:idProduct , opt_picNo:id},
            success: function (result) {
              waiting(false);
              if(result == "success"){
                  loadDataProduct(false);
                  myAlert("success", "รูปภาพถูกลบแล้ว !");
              }else{
                sw_Alert('error', 'ลบรูปภาพ ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
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

$(document).on("change", "#uploadPicProd, #uploadPicProd2", function (e) {
  if(+e.target.files[0].size > (1024*1024*20)){ //ไม่เกิน 10 MB
    sw_Alert("warning", "ขนาดไฟล์ มากกว่า 10MB " ,"กรุณาลดขนาดไฟล์ก่อน หรือเลือกไฟล์ใหม่");
  }else if (e.target.files) {
      waiting();
      for(let i=0; i<6; i++){ //หาช่องเก็บภาพที่ว่างอยู่
        if(picUrlAdd[i] == ''){
          picNoAdd = i+1;
          i = 6;
        }
      }
      const idProduct = $("#id_product").val();
      const n_file = 'prod_' + idProduct + '_' + picNoAdd;
      let imageFile = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
          var img = document.createElement("img");
          img.onload = function (event) {
              var c = document.createElement('canvas'),
                  ctx = c.getContext("2d");
              var canvas = document.createElement('canvas'),
                  ctx_s = canvas.getContext("2d");
              var width = (img.width>1200)?1200:img.width; //img.width; //กำหนดความกว้างที่ต้องการ
              var height = (img.height>1200)?1200:img.height; //img.height; //กำหนดความสูงที่ต้องการ
              
              const sqr = false; /*<<==== กำหนดว่าภาพเป็นสี่เหลี่ยมจตุรัสหรือไม่ false/true */
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

              var id_pic_del = picUrlAdd[picNoAdd-1];
              const obj = {
                  opt_k: "upProductPic",
                  id: idProduct,
                  fName: n_file,
                  noPic: picNoAdd,
                  idPicDel: id_pic_del,
                  fileName: imageFile.name,
                  mimeType: imageFile.type,
                  fdata: vals
              }
              fetch(urlProduct, {
                  method: "POST",
                  body: JSON.stringify(obj)
              }).then(function (response) {
                      return response.text()
                  }).then(function (data) {
                      let res = JSON.parse(data);
                      if (res.result == "success") {
                        picUrlAdd[picNoAdd-1] = res.id;
                        $("#url_Pic"+picNoAdd).val(res.id);
                        showProductPicPreviewEdit(idProduct)
                        myAlert("success", "อัพโหลดรูปภาพ สำเร็จ");
                      } else {
                          console.log("Upload picture Product ERROR : ");
                      }
                      waiting(false);
                  });
          }
          img.src = e.target.result;
          
      }
      reader.readAsDataURL(imageFile);
  }
});


$(document).on("submit", "#edit_product_form", function () {  //===== ตกลงแก้ไข/เปลี่ยนข้อมูล
let my_form = $(this);
const id_product = my_form.find("#id_product").val();
const name_product = my_form.find("#name_product").val();
const brand_product = my_form.find("#brand_product").val();
const desc_product = my_form.find("#desc_product").val();
const price_product = my_form.find("#price_product").val();
const type_product = (document.getElementById("selType").options[document.getElementById("selType").selectedIndex].text).split("--")[0];
const productPic1 = picUrlAdd[0];
const productPic2 = picUrlAdd[1];
const productPic3 = picUrlAdd[2];
const productPic4 = picUrlAdd[3];
const productPic5 = picUrlAdd[4];
const productPic6 = picUrlAdd[5];
const show = (my_form.find('#showCheck').prop("checked"))?"TRUE":"FALSE";
const rate = my_form.find("#rate_product").val();
const oldPrice = my_form.find("#oldPrice_product").val();
waiting();
$.ajax({
  url: urlProduct,
  type: 'GET',
  crossDomain: true,
  data: { opt_k: 'edit', opt_id:id_product, opt_nm:name_product, opt_brand:brand_product, opt_type:type_product, 
          opt_desc:desc_product, opt_urlPic1:productPic1, opt_urlPic2:productPic2, opt_urlPic3:productPic3, 
          opt_urlPic4:productPic4, opt_urlPic5:productPic5, opt_urlPic6:productPic6, opt_price:price_product,
          opt_show:show, opt_rate:rate, opt_oldPrice:oldPrice},
  success: function (result) {
      waiting(false); 
      if(result == "success"){
        myAlert("success", "แก้ไขข้อมูล สำเร็จ");
        clsProductShow();
        loadDataProduct();
      }else if(result == "exits"){
      sw_Alert('error', 'แก้ไขข้อมูล ไม่สำเร็จ', name_product + ' ซ้ำ! มีการใช้ชื่อนี้แล้ว');
      }else{
      sw_Alert('error', 'แก้ไขข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');

      }          
  },
  error: function (err) {
      console.log("Edit Product ERROR : " + err);
  }
  });

return false;
});