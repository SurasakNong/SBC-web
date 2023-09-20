/*===============================  การขายสินค้า =================================*/
function openSale() {
  page_selected = 1;
  is_sort = true;
  col_sort = 1;
  raw_sort = 0;
  sale = { id: '', dt: '', bill: '', mem: 'ทั่วไป', qty: 0, price: 0, disc: 0, sumPrice: 0, discBill: 0, priceBill: 0, cashBill: 0 };
  saleList = 0;
  var html = `
    <div class="container-fluid">
      <div class="row mt-">                
          <div class="col-lg-12 mx-auto mt-4">
              <label class="fn_name" ><i class="fa-solid fa-cart-arrow-down"></i>&nbsp; งานขาย</label>
              <form id="fmsearch_sale" >
                <div class="row mt-1">
                    <div class="col-md-4">
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <label class="input-group-text " style="width: 50px;" for="datefm_sale">วันที่</label>
                            </div>
                            <input name="datefm_sale" type="date" value='' id="datefm_sale" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <label class="input-group-text " style="width: 50px;" for="dateto_sale">ถึง</label>
                            </div>
                            <input name="dateto_sale" type="date" value='' id="dateto_sale" class="form-control">
                        </div>
                    </div>
                    <div class="col">
                        <div class="input-group mb-2">                  
                            <input type="text" id="search_sale" onkeypress="handle_saleSearch(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search"
                            style="border-radius:18px 0 0 18px;">
                            <button class="b-success" type="button" id="bt_search_sale" title="ค้นหา" style="border-radius:0 18px 18px 0;"><i class="fas fa-search"></i></button>
                            <button class="b-add ms-2" id="btAddSale" type="button" title="เพิ่มข้อมูล"><i class="fa-solid fa-plus fa-lg"></i></button>
                            <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                        </div>
                    </div>
                </div>
              </form> 
          </div>          
      </div>   
      <div class="row">  
          <div class="col-lg-11 col-md-11 col-sm-12 mx-auto" id="add_sale"></div>
      </div>   
      <div class="row">  
          <div class="ccol-lg-10 col-md-10 col-sm-12 mx-auto" id="edit_sale"></div>
      </div>   
      <div class="row">  
        <div id="table_sale_all">
          <div class="col-lg-12 mx-auto table-scroll mb-2" id="table_sale" style="height: calc(100vh-200px);"></div>
          <div class="row">
            <div class="col-auto me-auto" style="font-size: 0.8rem;">
              <label  for="rowShow_sale">แถวแสดง:</label>
              <input type="number" id="rowShow_sale" name="rowShow_sale" min="1" max="99" step="1" value="" style="text-align:center;">
            </div>
            <div class="col">
              <div id="pagination"></div>
            </div>
            <div class="col-auto" style="font-size: 0.8rem; text-align:right;">
              <label id="record"></label>
            </div>
          </div>   
        </div>
      </div>
      
      <div class="row justify-content-center">  
          <div class="col-lg-7 col-md-9 col-sm-11 mx-auto tableSelect animate__animated animate__fadeIn" id="table_sel_prod_sale">
            <div class="row mt-3 mb-2">  
              <div class="input-group">                  
                  <input type="text" id="search_sel_sale" onkeypress="handle_tableSaleSearch(event)" class="form-control" placeholder="คำค้นหา..สินค้า" 
                  aria-label="Search" aria-describedby="button-search" style="border-radius:18px 0 0 18px;">
                  <button class="b-success" type="button" id="bt_search_sel_sale" title="ค้นหา" style="border-radius:0 18px 18px 0;"><i class="fas fa-search"></i></button>
                  <button class="b-back ms-2" id="bt_sel_back_sale" name="bt_sel_back_sale" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
              </div>
            </div>
            <div class="row">  
              <div class="col-lg-12 mx-auto tableFixHead" id="table_sel_sale" style="height:420px;"></div>
            </div>
          </div>
      </div>
    </div>

      `;
  $("#main_setting").html(html);
  var dd = new Date();
  dT.fmShot = dd.getFullYear() + "-" + ("0" + (dd.getMonth() - 2)).slice(-2) + "-" + "01";
  dT.fmTs = dmyToTimestamp("01/" + ("0" + (dd.getMonth() - 2)).slice(-2) + "/" + dd.getFullYear() + " 00:00:01");
  dT.toShot = date_Now("y-m-d");
  dT.toTs = dmyToTimestamp(("0" + dd.getDate()).slice(-2) + "/" + ("0" + (dd.getMonth() + 1)).slice(-2) + "/" + dd.getFullYear() + " 23:59:59");
  $("#datefm_sale").val(dT.fmShot);
  $("#dateto_sale").val(dT.toShot);
  loadDataSale();
  document.getElementById("table_sel_prod_sale").style.display = "none";
  loadDataSaleSelect();
}

$(document).on('change', "#datefm_sale", function () {
  dT.fmShot = this.value;
  dT.fmTs = ymdToTimestamp(this.value + " 00:00:01");
  page_selected = 1;
  loadDataSale();
});

$(document).on('change', "#dateto_sale", function () {
  dT.toShot = this.value;
  dT.toTs = ymdToTimestamp(this.value + " 23:59:59");
  page_selected = 1;
  loadDataSale();
});

function loadDataSale(show = true) {
  if (show === true) waiting();
  $.ajax({
    url: urlSale,
    type: 'GET',
    crossDomain: true,
    data: { opt_k: 'readAllSetDate', opt_data: 'sale', opt_dtFm: dT.fmTs, opt_dtTo: dT.toTs },
    success: function (result) {
      dataAllShow = result;
      if (show === true) showSaleTable(rowperpage, page_selected); //<<<<<< แสดงตาราง rowperpage,page_sel   
      waiting(false);
    },
    error: function (err) {
      console.log("The server  ERROR says: " + err);
    }
  });
}

function mySaleData(shText = "", colSort = 0, isSort = false, rawSort = 0, page = 1, perPage = 10) {
  const search_str = shText.toLowerCase().split(",");
  if (isSort = true) sortByCol(dataAllShow, colSort, rawSort); //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
  var sumQty = 0;
  var sumPrice = 0;
  let array_Arg = new Array();
  for (let i = 0; i < dataAllShow.length; i++) {
    const condition = search_str.some(el => dataAllShow[i][2].toLowerCase().includes(el));  //bill_no
    const condition2 = search_str.some(el => dataAllShow[i][3].toLowerCase().includes(el));  //ชื่อ
    const condition3 = search_str.some(el => dataAllShow[i][4].toLowerCase().includes(el));  //ประเภท
    const condition4 = search_str.some(el => dataAllShow[i][5].toLowerCase().includes(el));  //ที่จัดเก็บ
    const condition5 = search_str.some(el => dataAllShow[i][8].toLowerCase().includes(el));  //สมาชิก
    if (condition || condition2 || condition3 || condition4 || condition5) {
      let jsonArg = new Object();
      jsonArg.id = dataAllShow[i][0];
      jsonArg.dt = dataAllShow[i][1];
      jsonArg.bill = dataAllShow[i][2];
      jsonArg.prod = dataAllShow[i][3];
      jsonArg.type = dataAllShow[i][4];
      jsonArg.shelf = dataAllShow[i][5];
      jsonArg.qty = dataAllShow[i][6];
      jsonArg.price = dataAllShow[i][7];
      jsonArg.mem = dataAllShow[i][8];
      jsonArg.disc = dataAllShow[i][9];
      sumQty = sumQty + +dataAllShow[i][6];
      sumPrice = sumPrice + (+dataAllShow[i][6] * +dataAllShow[i][7]);
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
  pageAll.sumQty = sumQty;
  pageAll.sumPrice = sumPrice;
  array_Data.push(pageAll);
  return array_Data;
}

function clsSaleShow() {
  $("#add_sale").html("");
  $("#edit_sale").html("");
  $("#table_sale").html("");
  document.getElementById("table_sale_all").style.display = "none";
}

$(document).on('click', "#bt_search_sale", function () {  //ค้นหารายการ
  showSaleTable(rowperpage, 1);
});

function handle_saleSearch(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    showSaleTable(rowperpage, 1);
  }
}

function showSaleTable(per = 10, p = 1, colSort = 1, isSort = true, rawSort = 0) { //======================== แสดงตาราง
  var strSearch = document.getElementById('search_sale').value;
  var n = ((p - 1) * per);
  const myArr = mySaleData(strSearch, colSort, isSort, rawSort, p, per);
  let page_all = myArr[myArr.length - 1].page;
  let rec_all = myArr[myArr.length - 1].rec;
  let sum_qty = myArr[myArr.length - 1].sumQty;
  let sum_price = myArr[myArr.length - 1].sumPrice.toFixed(2);

  page_selected = (p >= page_all) ? page_all : p;
  is_sort = isSort;
  col_sort = colSort;
  raw_sort = rawSort;
  let on_clk = ['', '', '', '', '', '', '', '', ''];
  let sortTxt = ['', '', '', '', '', '', '', '', ''];
  for (let j = 0; j < on_clk.length; j++) {
    if (j == colSort) {
      if (rawSort == 0) {
        on_clk[j] = 'showSaleTable(rowperpage,1,' + j + ',true,1);';
        sortTxt[j] = '<i class="fa-solid fa-sort-up"></i>';

      } else {
        on_clk[j] = 'showSaleTable(rowperpage,1,' + j + ',true,0);';
        sortTxt[j] = '<i class="fa-solid fa-sort-down"></i>';
      }
    } else {
      on_clk[j] = 'showSaleTable(rowperpage,1,' + j + ',true,0);';
      sortTxt[j] = '<i class="fa-solid fa-sort"></i>';
    }
  }
  var tt = `
            <table class="list-table table animate__animated animate__fadeIn" id="saleTable" >
              <thead>
                <tr id="saleHeadTb">
                  <th class="text-center sort-hd" onclick="`+ on_clk[1] + `">` + sortTxt[1] + `&nbsp; วันที่</th> 
                  <th class="text-start sort-hd" onclick="`+ on_clk[2] + `">` + sortTxt[2] + `&nbsp; Bill No</th>
                  <th class="text-start sort-hd" onclick="`+ on_clk[3] + `">` + sortTxt[3] + `&nbsp; รายการ</th>
                  <th class="text-start sort-hd" onclick="`+ on_clk[4] + `">` + sortTxt[4] + `&nbsp; ประเภท</th>
                  <th class="text-start sort-hd" onclick="`+ on_clk[5] + `">` + sortTxt[5] + `&nbsp; ที่จัดเก็บ</th>
                  <th class="text-center">จำนวน</th>
                  <th class="text-end">@</th>
                  <th class="text-center sort-hd" onclick="`+ on_clk[8] + `">` + sortTxt[8] + `&nbsp; สมาชิก</th>
                  <th class="text-end">ส่วนลด</th>
                  <th class="text-center">แก้ไข&nbsp;&nbsp;&nbsp;ลบ</th>                  
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>                                 
            `;
  document.getElementById("table_sale_all").style.display = "block";
  $("#table_sale").html(tt);
  document.getElementById("rowShow_sale").value = rowperpage.toString();
  document.getElementById("record").innerHTML = "รวม " + rec_all + " รายการ = " + sum_qty + " หน่วย = " + numWithCommas(sum_price) + " บาท";
  for (let i = 0; i < myArr.length - 1; i++) {
    n++;
    listSaleTable(myArr[i], n);
  }
  pagination_show(p, page_all, rowperpage, 'showSaleTable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
}

$(document).on("change", "#rowShow_sale", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
  rowperpage = +$("#rowShow_sale").val();
  showSaleTable(rowperpage, 1);
});

function listSaleTable(ob, i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางประเเภท
  let tableName = document.getElementById('saleTable');
  let prev = tableName.rows.length;
  let row = tableName.insertRow(prev);
  row.id = "row" + ob.id;
  row.style.verticalAlign = "top";
  row.style.color = (ob.st == "TRUE") ? "#a0a0a0" : "#000000";
  txtDel = `<i class="fa-solid fa-xmark" onclick="delete_sale_Row(` + ob.id + `)" style="cursor:pointer; color:#d9534f;"></i>`;
  let n_col = 10;
  let col = [];
  for (let ii = 0; ii < n_col; ii++) {
    col[ii] = row.insertCell(ii);
  }
  col[0].innerHTML = `<div id="dt` + ob.id + `" class="text-center">` + tsToDateShort(+ob.dt) + `</div>`;
  col[1].innerHTML = `<div id="lot` + ob.id + `" class="text-start">` + ob.bill + `</div>`;
  col[2].innerHTML = `<div id="prod` + ob.id + `" class="text-start">` + ob.prod + `</div>`;
  col[3].innerHTML = `<div id="type` + ob.id + `" class="text-start">` + ob.type + `</div>`;
  col[4].innerHTML = `<div id="shelf` + ob.id + `" class="text-center">` + ob.shelf + `</div>`;
  col[5].innerHTML = `<div id="qty` + ob.id + `" class="text-center">` + ob.qty + `</div>`;
  col[6].innerHTML = `<div id="price` + ob.id + `" class="text-end">` + (+ob.price).toFixed(2) + `</div>`;
  col[7].innerHTML = `<div id="mem` + ob.id + `" class="text-center">` + ob.mem + `</div>`;
  col[8].innerHTML = `<div id="disc` + ob.id + `" class="text-end">` + (+ob.disc).toFixed(2) + `</div>`;
  col[n_col - 1].innerHTML = `
          <input type="hidden" id="id_sale` + ob.id + `" value="` + ob.id + `" /> 
          <input type="hidden" id="dt_sale` + ob.id + `" value="` + ob.dt + `" /> 
          <i class="fas fa-edit me-3" onclick="editSaleRow(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
          `+ txtDel;
  col[n_col - 1].style = "text-align: center;";
}

$(document).on("click", "#btAddSale", function () { //========== เปิดเพิ่มข้อมูล
  clsSaleShow();
  var html = `     
          <div id="sale_add" class="main_form" style="position:relative;">    
            <button class="b-top"  type="button" title="ยกเลิก" id="cancel_add_sale">
            <i class="fa-solid fa-xmark fa-lg"></i></button>
            <form class="animate__animated animate__fadeIn" id="add_sale_form" style="padding:20px;">
              <div class="row mb-2 justify-content-md-center" >
                <div class="main_form_head"> เปิดรายการขาย </div>                
              </div>
              <div class="row mb-1">
                <div class="col-md-4">
                  <div class="input-group mb-1">
                    <div class="input-group-prepend">
                      <label class="input-group-text " style="width: 65px; background-color:#fcdfe4;" for="date_sale">วันที่</label>
                    </div>
                      <input class="form-control" type="date" id="date_sale" name="date_sale" value=''>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 65px; background-color:#fcdfe4;" for="bill_sale">เลขที่</label>
                    <input type="text" id="bill_sale" class="form-control" placeholder="เลขที่เอกสาร" aria-label="sale bill" required>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group mb-1">
                    <!-- <label class="input-group-text " style="width: 65px;">สมาชิก</label> -->
                    <input type="text" id="name_member" class="form-control" aria-label="member" placeholder="เลือกสมาชิก..." disabled>
                    <button class="b-success" type="button" id="bt_open_sel" title="เลือกสมาชิก"><i class="fa-solid fa-user"></i></button>
                  </div>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-4">
                  <div class="input-group mb-1">
                    <!-- <label class="input-group-text " style="width: 65px; background-color:#fcdfe4;">สินค้า</label> -->
                    <input type="text" id="name_product" class="form-control" aria-label="product"  placeholder="เลือกสินค้า..." disabled>
                    <button class="b-success" type="button" id="bt_open_sel_sale" title="เลือกสินค้า"><i class="fa-solid fa-list"></i></button>
                  </div>
                </div>
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 65px; background-color:#fcdfe4;" for="qty_sale">จำนวน</label>
                    <input type="number" id="qty_sale" class="form-control" value="1" aria-label="sale Qty" min="1" step="1">
                  </div>
                </div>
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 65px;" for="lot_sale">ส่วนลด</label>
                    <input type="number" id="disc_sale" class="form-control" value="0" aria-label="sale discount" min="0" step="0.1" >     
                    <button class="b-add ms-2" type="button" id="bt_add_sale" title="เพิ่มรายการ"><i class="fa-solid fa-plus"></i></button>                                
                  </div>                  
                </div>   
              </div>

            <div class="row mb-3">
                <div class="col-lg-12 mx-auto table-scroll" id="table_sale" style="height: calc(100vh - 410px);">
                    <table class="list-table table animate__animated animate__fadeIn" id="saleTable">
                        <thead>
                        <tr>
                            <th class="text-center"></th>
                            <th class="text-center">ลำดับ</th>
                            <th class="text-left">สินค้า</th>
                            <th class="text-left">ประเภท</th>
                            <th class="text-left">ช่องจัดเก็บ</th>
                            <th class="text-end">จำนวน</th>
                            <th class="text-end">@</th>
                            <th class="text-end">ส่วนลด</th>
                            <th class="text-end">รวม</th>
                        </tr>
                        </thead>
                        <tbody id="listSale">
                        </tbody>
                        <tfoot>
                          <tr style="background-color:var(--primary-color); color:#fff; font-size:1.2rem;">
                            <td class="text-end" colspan="5">รวมทั้งหมด = </td> 
                            <td class="text-end" id="sumSaleQty">0</td>                            
                            <td class="text-end" id="sumSalePrice">0.00</td>
                            <td class="text-end" id="sumSaleDisc">0.00</td> 
                            <td class="text-end" id="sumSaleSum">0.00</td>                            
                          </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                  <div class="input-group">
                      <label class="input-group-text " style="width: 65px; background-color:#fcdfe4;" for="disc_bill">ส่วนลด</label>
                      <input type="number" id="disc_bill" class="form-control" value='0' aria-label="discount bill" min="0" step="0.1" >                                     
                  </div>  
                </div>
                <div class="col-md-3">
                    <div class="input-group">
                        <label class="input-group-text " for="sum_of_bill">สุทธิ</label>
                        <input type="text" id="sum_of_bill" class="form-control" aria-label="sum of bill" disabled>                                     
                    </div>
                </div>
                <div class="col-md-3">
                  <div class="input-group">
                      <!--<label class="input-group-text" for="selType" style="width:80px;">ประเภท</label> -->
                      <select class="form-select" id="selTypeCash">
                          <option selected value="0">-- การชำระเงิน --</option>
                          <option value="1">เต็มจำนวน</option>
                          <option value="2">บางส่วน</option>
                      </select>
                  </div>
                </div>    
                <div class="col-md-3">
                  <div class="input-group">
                      <label class="input-group-text " style="background-color:#fcdfe4;" for="cash_bill">ชำระ</label>
                      <input type="number" id="cash_bill" class="form-control me-2" value='0.00' aria-label="cash bill" min="0" step="0.1" > 
                      <button class="b-success" type="button" id="bt_cash_bill" title="บันทึกการชำระเงิน"><i class="fa-solid fa-baht-sign"></i></button>                                    
                  </div>  
                </div>                
            </div>
            </form>            
          </div>  
          `;
  $("#add_sale").html(html);
  $("#date_sale").val((sale.dt == '') ? date_Now("y-m-d") : sale.dt);
  $("#lot_sale").val(stk.lot);
  document.getElementById('cash_bill').disabled = true;
  document.getElementById('bt_cash_bill').disabled = true;
  //initDropdownList(urlData,'selShelf','shelf',true)

});

$(document).on('change', "#selTypeCash", function () {
  if ($(this).val() == '0') {
    document.getElementById('cash_bill').disabled = true;
    document.getElementById('bt_cash_bill').disabled = true;
    $("#cash_bill").val('0.00');
  } else if ($(this).val() == '1') {
    document.getElementById('cash_bill').disabled = true;
    $("#cash_bill").val((sale.priceBill).toFixed(2));
    document.getElementById('bt_cash_bill').disabled = false;
  } else {
    document.getElementById('cash_bill').disabled = false;
    document.getElementById('bt_cash_bill').disabled = false;
    $("#cash_bill").val('0.00');
    $("#cash_bill").focus();
    $("#cash_bill").select();
  }
});

$(document).on('change', "#disc_sale", function () {
  saleSel.disc = $(this).val();
  $("#sum_of_bill").val(sale.sumPrice - +$("#disc_bill").val());
});

$(document).on('change', "#disc_bill", function () {
  sale.discBill = +$(this).val();
  sale.priceBill = sale.sumPrice - +$(this).val();
  $("#sum_of_bill").val(numWithCommas((sale.priceBill).toFixed(2)));

});

/*================================================= Select ====================================================================== */
$(document).on("click", "#bt_open_sel_sale", function () {
  document.getElementById("table_sel_prod_sale").style.display = "block";
  showSelectSaleTable();
});

$(document).on("click", "#bt_sel_back_sale", function () {
  document.getElementById("table_sel_prod_sale").style.display = "none";
});

$(document).on('click', "#bt_search_sel_sale", function () {  //ค้นหารายการ
  showSelectSaleTable();
});

function handle_tableSaleSearch(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    showSelectSaleTable();
  }
}

function loadDataSaleSelect(show = true) {
  if (show === true) waiting();
  $.ajax({
    url: urlStock,
    type: 'GET',
    crossDomain: true,
    data: { opt_k: 'readAll' },
    success: function (result) {
      dataAllSel = result;
      if (show === true) showSelectSaleTable(); //<<<<<< แสดงตาราง rowperpage,page_sel           
      waiting(false);
    },
    error: function (err) {
      console.log("The server  ERROR says: " + err);
    }
  });
}

function showSelectSaleTable(isSort = true, colSort = 3) { //======================== แสดงตาราง
  var strSearch = document.getElementById('search_sel_sale').value;
  const myArr = mySelectSaleData(strSearch, isSort, colSort);
  var tt = `
        <table class="list-selTable table animate__animated animate__fadeIn" id="selectSaleTable" >
          <thead>
            <tr>
              <th class="text-start">สินค้า</th>
              <th class="text-start">ประเภท</th>
              <th class="text-start">ช่องเก็บ</th>
              <th class="text-end">จำนวน</th>    
              <th class="text-end">Cost</th>
              <th class="text-end">@</th>        
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>                     
        `;
  $("#table_sel_sale").html(tt);
  for (let i = 0; i < myArr.length; i++) {
    listSelectSaleTable(myArr[i]);
  }
}

function mySelectSaleData(shText = "", isSort = true, colSort = 3) {
  const search_str = shText.toLowerCase().split(",");
  if (isSort == true) sortByCol(dataAllSel, colSort, 0); //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
  let array_Arg = new Array();
  for (let i = 0; i < dataAllSel.length; i++) {
    const condition = search_str.some(el => dataAllSel[i][3].toLowerCase().includes(el));   //ชื่อ
    const condition2 = search_str.some(el => dataAllSel[i][4].toLowerCase().includes(el));  //ประเภท
    const condition3 = search_str.some(el => dataAllSel[i][8].toLowerCase().includes(el));  //ช่อง
    const condition4 = search_str.some(el => dataAllSel[i][2].toLowerCase().includes(el));  //Lot
    if (condition || condition2 || condition3 || condition4) {
      let jsonArg = new Object();
      jsonArg.id = dataAllSel[i][0];
      jsonArg.dt = dataAllSel[i][1];
      jsonArg.lot = dataAllSel[i][2];
      jsonArg.prod = dataAllSel[i][3];
      jsonArg.type = dataAllSel[i][4];
      jsonArg.qty = dataAllSel[i][5];
      jsonArg.cost = dataAllSel[i][6];
      jsonArg.shelf = dataAllSel[i][8];
      jsonArg.point = dataAllSel[i][10];
      jsonArg.saleQty = dataAllSel[i][11];
      jsonArg.price = dataAllSel[i][12];
      array_Arg.push(jsonArg);
    }
  }
  return array_Arg;
}

function listSelectSaleTable(ob) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางข้อมูล
  let tableName = document.getElementById('selectSaleTable');
  let prev = tableName.rows.length;
  let row = tableName.insertRow(prev);
  row.id = "row" + ob.id;
  row.style.verticalAlign = "top";
  let n_col = 6;
  let col = [];
  for (let ii = 0; ii < n_col; ii++) {
    col[ii] = row.insertCell(ii);
  }
  col[0].innerHTML = `<div id="prod` + ob.id + `" class="text-left" onclick="selectedSaleData(` + ob.id + `);">` + ob.prod + `</div>`;
  col[1].innerHTML = `<div id="type` + ob.id + `" class="text-left" onclick="selectedSaleData(` + ob.id + `);">` + ob.type + `</div>`;
  col[2].innerHTML = `<div id="shelf` + ob.id + `" class="text-left" onclick="selectedSaleData(` + ob.id + `);">` + ob.shelf + `</div>`;
  col[3].innerHTML = `<div id="qty` + ob.id + `" class="text-left" onclick="selectedSaleData(` + ob.id + `);">` + (+ob.qty - +ob.saleQty) + `</div>`;
  col[4].innerHTML = `<div id="cost` + ob.id + `" class="text-left" onclick="selectedSaleData(` + ob.id + `);">` + (+ob.cost).toFixed(2) + `</div>`;
  col[n_col - 1].innerHTML = `<div id="price` + ob.id + `" class="text-end" onclick="selectedSaleData(` + ob.id + `);">` + (+ob.price).toFixed(2) + `</div>
    <input type="hidden" id="id` + ob.id + `" value="` + ob.id + `" /> `;
}

function selectedSaleData(id) {
  saleSel = {
    id: $("#id" + id).val(),
    prod: $("#prod" + id).html(),
    type: $("#type" + id).html(),
    shelf: $("#shelf" + id).html(),
    qty: +($("#qty" + id).html()),
    cost: +($("#cost" + id).html()),
    price: +($("#price" + id).html()),
    disc: +($("#disc_sale").val())
  }
  loadDataSaleSelect(false);
  $("#name_product").val(saleSel.prod);
  document.getElementById("table_sel_prod_sale").style.display = "none";
}
/*========================================= End Select ==============================================================*/

$(document).on("click", "#bt_add_sale", function () { //========== เพิ่มรายการขาย
  if ($("#name_product").val() !== '') {
    if (+saleSel.qty >= +$('#qty_sale').val()) {
      saleList++;
      let tableName = document.getElementById('listSale');
      //let prev = tableName.rows.length;
      //let row = tableName.insertRow(prev);
      let row = tableName.insertRow(0);
      row.id = "rowListSale" + saleSel.id;
      row.style.verticalAlign = "top";
      let n_col = 9;
      let col = [];
      for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
      }
      col[0].innerHTML = `<div class="text-center"><i class="fa-solid fa-xmark" onclick="delete_sale_Row(` + saleSel.id + `)" style="cursor:pointer; color:#d9534f;"></i></div>`
      col[1].innerHTML = `<div id="no` + saleSel.id + `" class="text-center">` + saleList + `</div>`;
      col[2].innerHTML = `<div id="prod` + saleSel.id + `" class="text-start">` + saleSel.prod + `</div>`;
      col[3].innerHTML = `<div id="type` + saleSel.id + `" class="text-start">` + saleSel.type + `</div>`;
      col[4].innerHTML = `<div id="shelf` + saleSel.id + `" class="text-start">` + saleSel.shelf + `</div>`;
      col[5].innerHTML = `<div id="qty` + saleSel.id + `" class="text-end">` + $('#qty_sale').val() + `</div>`;
      col[6].innerHTML = `<div id="price` + saleSel.id + `" class="text-end">` + (+saleSel.price).toFixed(2) + `</div>`;
      col[7].innerHTML = `<div id="disc` + saleSel.id + `" class="text-end">` + (+saleSel.disc).toFixed(2) + `</div>`;
      col[8].innerHTML = `<div id="sum` + saleSel.id + `" class="text-end">` + ((+saleSel.qty * +saleSel.price) - +saleSel.disc).toFixed(2) + `</div>`;

      $("#name_product").val('');
      $("#qty_sale").val('1');
      $("#disc_sale").val('0');

      sale.dt = ymdToTimestamp($("#date_sale").val() + " 00:00:01");
      sale.bill = $("#bill_sale").val();
      sale.mem = ($("#name_member").val() == '') ? 'ทั่วไป' : $("#name_member").val();

      sale.qty = +sale.qty + +saleSel.qty;
      sale.price = +sale.price + +(+saleSel.price * +saleSel.qty);
      sale.disc = +sale.disc + +saleSel.disc;
      sale.sumPrice = sale.price - +saleSel.disc;
      sale.discBill = +$("#disc_bill").val();
      sale.priceBill = sale.sumPrice - +$("#disc_bill").val();
      $("#sumSaleQty").html(sale.qty);
      $("#sumSalePrice").html(numWithCommas((sale.price).toFixed(2)));
      $("#sumSaleDisc").html(numWithCommas((sale.disc).toFixed(2)));
      $("#sumSaleSum").html(numWithCommas((sale.sumPrice).toFixed(2)));
      $("#sum_of_bill").val(numWithCommas((sale.priceBill).toFixed(2)));
    } else {
      sw_Alert('warning', 'เพิ่มข้อมูล ไม่สำเร็จ', 'จำนวนสินค้า มีน้อยกว่าที่ระบุ');
    }

  } else {
    sw_Alert('warning', 'เพิ่มข้อมูล ไม่สำเร็จ', 'คุณยังไม่เลือกสินค้า');
  }
});

function delete_sale_Row(id) {
  sale.qty = +sale.qty - +$("#qty" + id).html();
  sale.price = +sale.price - +(+$("#price" + id).html() * +$("#qty" + id).html());
  sale.disc = +sale.disc - +$("#disc" + id).html();
  sale.sumPrice = +sale.price - +sale.disc;
  sale.priceBill = sale.sumPrice - +$("#disc_bill").val();
  $("#sumSaleQty").html(sale.qty);
  $("#sumSalePrice").html(numWithCommas((sale.price).toFixed(2)));
  $("#sumSaleDisc").html(numWithCommas((sale.disc).toFixed(2)));
  $("#sumSaleSum").html(numWithCommas((sale.sumPrice).toFixed(2)));
  $("#sum_of_bill").val(numWithCommas((sale.priceBill).toFixed(2)));

  $("#rowListSale" + id).remove();

  let tableName = document.getElementById('listSale');
  let n = tableName.rows.length;
  saleList = n;
  if (n > 0) {
    for (let a = 0; a < n; a++) {
      var rec = (tableName.rows.item(a).cells[1].innerHTML).split('>')[0];
      tableName.rows.item(a).cells[1].innerHTML = rec + '>' + (n - a) + '</div>';
    }
  }
}

$(document).on("click", "#cancel_add_sale", function () { //========== ยกเลิกการเพิ่มข้อมูล
  clsSaleShow();
  showSaleTable(rowperpage, page_selected);
});


$(document).on("click", "#bt_cash_bill", function () {  //===== ตกลงเพิ่มข้อมูล
  sale.cashBill = +$('#cash_bill').val();
  
  let tableName = document.getElementById('listSale');
  let n = tableName.rows.length;
  let array_data = new Array();

  var dataIn = (i,c) => ((tableName.rows.item(i).cells[c].innerHTML).split('">')[1]).split('</')[0];
  
  if (n > 0) {
    for (let a = 0; a < n; a++) {
      let array_cell = new Array();
      array_cell[0] = sale.dt;
      array_cell[1] = sale.bill;
      array_cell[2] = dataIn(a,2);
      array_cell[3] = dataIn(a,3);
      array_cell[4] = dataIn(a,4);
      array_cell[5] = +dataIn(a,5);
      array_cell[6] = +dataIn(a,6);
      array_cell[7] = sale.mem;
      array_cell[8] = +dataIn(a,7);
      array_cell[9] = sale.discBill;
      array_cell[10] = sale.priceBill;
      array_cell[11] = sale.cashBill;      
      array_data.push(array_cell);            
    }  
    console.log(array_data);
    waiting();
    $.ajax({
      url: urlSale,
      type: 'GET',
      crossDomain: true,
      data: { opt_k:'add', opt_data: JSON.stringify(array_data) },
      success: function (result) {
        waiting(false);
        if (result == "success") {
          myAlert("success", "เพิ่มข้อมูล สำเร็จ");
        
        } else {
          sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }
      },
      error: function (err) {
        console.log("Add new stock ERROR : " + err);
        waiting(false);
      }
    });
    return false;
  }else{
    sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ไม่มีรายการสินค้า');
    return false;
  }
});

