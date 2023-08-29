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
      document.getElementById("rowShow_product").value = rowperpage.toString();
      document.getElementById("record").innerHTML = "ทั้งหมด : " + rec_all + " รายการ";
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
