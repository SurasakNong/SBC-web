/*===============================  การขายสินค้า =================================*/
const openSale = () => {
  page_selected = 1;
  is_sort = true;
  col_sort = 1;
  raw_sort = 0;
  sale = { id: '', dt: '', bill: '', mem: 'ทั่วไป', qty: 0, price: 0, disc: 0, sumPrice: 0, discBill: 0, priceBill: 0, cashBill: 0 };
  let html = `
    <div class="container-fluid">
      <div class="row mt-">                
          <div class="col-lg-12 mx-auto mt-4">
              <a class="fn_name" ><i class="fa-solid fa-cart-arrow-down"></i>&nbsp; งานขาย</a>
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
          <div class="col-lg-11 col-md-11 col-sm-12 mx-auto" id="edit_sale"></div>
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
              <a id="record"></a>
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
  let dd = new Date();
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

const loadDataSale = (show = true) => {
  if (show === true) waiting();
  $.ajax({
    url: urlSale,
    type: 'GET',
    //crossDomain: true,
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
  let sumQty = 0;
  let sumPrice = 0;
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
      jsonArg.discBill = dataAllShow[i][10];
      jsonArg.priceBill = dataAllShow[i][11];
      jsonArg.cashBill = dataAllShow[i][12];
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
  document.getElementById("fmsearch_sale").style.display = "none";
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

function showSaleTable(per = 10, p = 1, colSort = 1, isSort = true, rawSort = 1) { //======================== แสดงตาราง
  const strSearch = document.getElementById('search_sale').value;
  const myArr = mySaleData(strSearch, colSort, isSort, rawSort, p, per);
  const page_all = myArr[myArr.length - 1].page;
  const rec_all = myArr[myArr.length - 1].rec;
  const sum_qty = myArr[myArr.length - 1].sumQty;
  const sum_price = myArr[myArr.length - 1].sumPrice.toFixed(2);
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
  let tt = `
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
    listSaleTable(myArr[i]);
  }
  pagination_show(p, page_all, rowperpage, 'showSaleTable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
}

$(document).on("change", "#rowShow_sale", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
  rowperpage = +$("#rowShow_sale").val();
  showSaleTable(rowperpage, 1);
});

function listSaleTable(ob) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางประเเภท
  const tableName = document.getElementById('saleTable');
  const prev = tableName.rows.length;
  let row = tableName.insertRow(prev);
  row.id = "row" + ob.id;
  row.style.verticalAlign = "top";
  row.style.color = (ob.st == "TRUE") ? "#a0a0a0" : "#000000";
  txtDel = `<i class="fa-solid fa-xmark" onclick="delete_sale_bill(` + ob.dt + `,'` + ob.bill + `')" style="cursor:pointer; color:#d9534f;"></i>`;
  const n_col = 10;
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
          <input type="hidden" id="discBill` + ob.id + `" value="` + ob.discBill + `" /> 
          <input type="hidden" id="priceBill` + ob.id + `" value="` + ob.priceBill + `" /> 
          <input type="hidden" id="cashBill` + ob.id + `" value="` + ob.cashBill + `" /> 
          <i class="fas fa-edit me-3" onclick="editSaleRow(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
          `+ txtDel;
  col[n_col - 1].style = "text-align: center;";
}

function delete_sale_bill(dt, bill) { //================================ ลบข้อมูล 
  const del_name = bill + ' (' + tsToDateShort(dt, "dmy") + ')';
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'mybtn btnOk me-3',
      cancelButton: 'mybtn btnCan'
    },
    buttonsStyling: false
  })
  swalWithBootstrapButtons.fire({
    title: "โปรดยืนยัน",
    text: 'ต้องการลบ บิล ' + del_name + ' หรือไม่',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '&nbsp;&nbsp;ตกลง&nbsp;&nbsp;',
    cancelButtonText: '&nbsp;&nbsp;ไม่&nbsp;&nbsp;',
    reverseButtons: false
  }).then((result) => {
    if (result.isConfirmed) {
      waiting();
      $.ajax({
        url: urlSale,
        type: 'GET',
        crossDomain: true,
        data: { opt_k: 'del', opt_oldDt: dt, opt_oldBill: bill },
        success: function (result) {
          waiting(false);
          if (result == "success") {
            myAlert("success", "ข้อมูลถูกลบแล้ว !");
            loadDataSale();
          } else {
            sw_Alert('error', 'ลบข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
          }
        },
        error: function (err) {
          console.log("Delete Sale bill ERROR : " + err);
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

$(document).on("click", "#btAddSale", function () { //========== เปิดเพิ่มข้อมูล  
  clsSaleShow();
  sale = { id: '', dt: '', bill: '', mem: 'ทั่วไป', qty: 0, price: 0, disc: 0, sumPrice: 0, discBill: 0, priceBill: 0, cashBill: 0 };
  id_row_list_sale = 0;
  let html = `     
          <div id="sale_add" class="main_form" style="position:relative;">    
            <button class="b-top"  type="button" title="ยกเลิก" id="cancel_add_sale">
            <i class="fa-solid fa-xmark fa-lg"></i></button>
            <form class="animate__animated animate__fadeIn" id="add_sale_form" style="padding:20px;">
              <div class="row mb-2 justify-content-md-center" >
                <div class="main_form_head"> เปิดรายการขาย </div>                
              </div>
              <div class="row">
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
                    <input type="text" id="name_member" class="form-control" aria-label="member" placeholder="เลือกสมาชิก...">
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
                    <label class="input-group-text " style="width: 65px;" for="disc_sale">ส่วนลด</label>
                    <input type="number" id="disc_sale" class="form-control" value="0" aria-label="sale discount" min="0" step="1" >     
                    <button class="b-add ms-2" type="button" id="bt_add_sale" title="เพิ่มรายการ"><i class="fa-solid fa-plus"></i></button>                                
                  </div>                  
                </div>   
              </div>

            <div class="row mb-3">
                <div class="col-lg-12 mx-auto table-scroll" id="table_sale" style="height: calc(100vh - 350px);">
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
                            <td class="text-end" colspan="5">รวมทั้งหมด ==> </td> 
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
                <div class="col-md-4 mb-1">
                  <div class="input-group">
                      <label class="input-group-text " style="width: 65px; background-color:#fcdfe4;" for="disc_bill">ส่วนลด</label>
                      <input type="number" id="disc_bill" class="form-control" value='0' aria-label="discount bill" min="0" step="1" >                                     
                  </div>  
                </div>
                <div class="col-md-4 mb-1">
                    <div class="input-group">
                        <label class="input-group-text " for="sum_of_bill">สุทธิ</label>
                        <input type="text" id="sum_of_bill" class="form-control" aria-label="sum of bill" disabled>                                     
                    </div>
                </div>                    
                <div class="col-md-4 mb-1">
                  <div class="input-group">
                      <button class="b-add" type="button" id="bt_cash_rec" onclick="openRecModal();" title="รับเงิน"><i class="fa-solid fa-hand-holding-dollar fa-lg"></i></button> 
                      <!--<label class="input-group-text " style="background-color:#fcdfe4;" for="cash_bill">ชำระ</label>-->
                      <input type="number" id="cash_bill" class="form-control me-2" value='0.00' aria-label="cash bill" min="0" step="1" > 
                      <button class="b-success" type="button" id="bt_cash_bill" title="บันทึกการชำระเงิน"><i class="fa-regular fa-floppy-disk fa-lg"></i></button>                                    
                  </div>  
                </div>  

            </div>
            </form>   
            <div class="modal fade " tabindex="-1" id="recMod">
              <div class="modal-dialog modal-dialog-centered" >
                <div class="modal-content" style="background-color: rgba(255,255,255,0.4); backdrop-filter: blur(5px); border-radius:20px 0 20px 0;">
                  <div class="modal-header">
                    <h5 class="modal-title">คำนวณการรับเงิน</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="col mx-2">
                        <div class="input-group input-group-lg mb-2">
                          <label class="input-group-text " style="width: 100px; background-color:#9BCDD2;" for="sumBath">ยอดรวม</label>
                          <input type="number" id="sumBath" class="form-control" value="0.00" aria-label="sale price" disabled>
                        </div>
                        <div class="input-group input-group-lg mb-2">
                          <label class="input-group-text " style="width: 100px; background-color:#A4D0A4;" for="recBath">รับเงินมา</label>
                          <input type="number" id="recBath" class="form-control" value="0.00" aria-label="sale recive" min="1" step="1" >
                        </div>
                        <div class="input-group input-group-lg mb-2">
                          <label class="input-group-text " style="width: 100px; background-color:#fcdfe4;" for="difBath">เงินทอน</label>
                          <input type="number" id="difBath" class="form-control" value="0.00" aria-label="sale different" disabled>
                        </div>
                      </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal">ปิด</button>
                  </div>
                </div>
              </div>
            </div>         
          </div>  
          `;
  $("#add_sale").html(html);
  $("#date_sale").val((sale.dt == '') ? date_Now("y-m-d") : sale.dt);
  $("#lot_sale").val(stk.lot);
});

const openRecModal = () => {
  $("#recMod").modal("show");
  $("#sumBath").val((sale.priceBill).toFixed(2));
  document.getElementById("recBath").focus();
  //$("#recBath").focus();  
  $("#recBath").select();

}
$(document).on('change', "#recBath", function () {
  $("#difBath").val((+$("#recBath").val() - sale.priceBill).toFixed(2));
});

$(document).on('change', "#disc_sale", function () {
  saleSel.disc = $(this).val();
});

$(document).on('change', "#disc_bill", function () {
  sale.discBill = +$(this).val();
  sale.priceBill = sale.sumPrice - +$(this).val();
  $("#sum_of_bill").val(numWithCommas((sale.priceBill).toFixed(2)));
  sale.cashBill = sale.priceBill;
  $("#cash_bill").val(numWithCommas((sale.priceBill).toFixed(2)));
});

$(document).on('change', "#cash_bill", function () {
  sale.cashBill = +$(this).val();
});


/*================================================= Select ====================================================================== */
$(document).on("click", "#bt_open_sel_sale, #bt_open_sel_sale_edit", function () {
  document.getElementById("table_sel_prod_sale").style.display = "block";
  showSelectSaleTable();
});

$(document).on("click", "#bt_sel_back_sale", function () {
  document.getElementById("table_sel_prod_sale").style.display = "none";
});

$(document).on('click', "#bt_search_sel_sale", function () {  //ค้นหารายการ
  showSelectSaleTable();
});

const handle_tableSaleSearch = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    showSelectSaleTable();
  }
}


const loadDataSaleSelect = (show = true) => {
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

const showSelectSaleTable = (isSort = true, colSort = 3) => { //======================== แสดงตาราง
  const strSearch = document.getElementById('search_sel_sale').value;
  const myArr = mySelectSaleData(strSearch, isSort, colSort);
  let tt = `
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

const mySelectSaleData = (shText = "", isSort = true, colSort = 3) => {
  const search_str = shText.toLowerCase().split(",");
  if (isSort == true) sortByCol(dataAllSel, colSort, 0); //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
  let array_Arg = new Array();
  for (let i = 0; i < dataAllSel.length; i++) {
    const condition = search_str.some(el => dataAllSel[i][3].toLowerCase().includes(el));   //ชื่อ
    const condition2 = search_str.some(el => dataAllSel[i][4].toLowerCase().includes(el));  //ประเภท
    const condition3 = search_str.some(el => dataAllSel[i][8].toLowerCase().includes(el));  //ช่อง
    const condition4 = search_str.some(el => dataAllSel[i][2].toLowerCase().includes(el));  //Lot
    if ((condition || condition2 || condition3 || condition4) && (+dataAllSel[i][5] > +dataAllSel[i][11])) {
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

const listSelectSaleTable = (ob) => {  //========== ฟังก์ชั่นเพิ่ม Row ตารางข้อมูล
  const tableName = document.getElementById('selectSaleTable');
  const prev = tableName.rows.length;
  let row = tableName.insertRow(prev);
  row.id = "row" + ob.id;
  row.style.verticalAlign = "top";
  const n_col = 6;
  let col = [];
  for (let ii = 0; ii < n_col; ii++) {
    col[ii] = row.insertCell(ii);
  }
  col[0].innerHTML = `<div id="prodSel` + ob.id + `" class="text-start" onclick="selectedSaleData(` + ob.id + `);">` + ob.prod + `</div>`;
  col[1].innerHTML = `<div id="typeSel` + ob.id + `" class="text-start" onclick="selectedSaleData(` + ob.id + `);">` + ob.type + `</div>`;
  col[2].innerHTML = `<div id="shelfSel` + ob.id + `" class="text-start" onclick="selectedSaleData(` + ob.id + `);">` + ob.shelf + `</div>`;
  col[3].innerHTML = `<div id="qtySel` + ob.id + `" class="text-end" onclick="selectedSaleData(` + ob.id + `);">` + (+ob.qty - +ob.saleQty) + `</div>`;
  col[4].innerHTML = `<div id="costSel` + ob.id + `" class="text-end" onclick="selectedSaleData(` + ob.id + `);">` + (+ob.cost).toFixed(2) + `</div>`;
  col[n_col - 1].innerHTML = `<div id="priceSel` + ob.id + `" class="text-end" onclick="selectedSaleData(` + ob.id + `);">` + (+ob.price).toFixed(2) + `</div>
    <input type="hidden" id="idSel` + ob.id + `" value="` + ob.id + `" /> `;
}

const selectedSaleData = (id) => {
  saleSel = {
    id: $("#idSel" + id).val(),
    prod: $("#prodSel" + id).html(),
    type: $("#typeSel" + id).html(),
    shelf: $("#shelfSel" + id).html(),
    qty: +($("#qtySel" + id).html()),
    cost: +($("#costSel" + id).html()),
    price: +($("#priceSel" + id).html()),
    disc: 0
  }
  loadDataSaleSelect(false);
  $("#name_product").val(saleSel.prod);
  document.getElementById("table_sel_prod_sale").style.display = "none";
}
/*========================================= End Select ==============================================================*/

$(document).on("click", "#bt_add_sale", function () { //========== เพิ่มรายการขาย
  const tableName = document.getElementById('listSale');
  let ckQtySel = 0;
  for (let r = 0; r < tableName.rows.length; r++) {
    const p = ((tableName.rows.item(r).cells[2].innerHTML).split('">')[1]).split('</')[0];
    const q = ((tableName.rows.item(r).cells[5].innerHTML).split('">')[1]).split('</')[0];
    const s = ((tableName.rows.item(r).cells[4].innerHTML).split('">')[1]).split('</')[0];
    if (saleSel.prod == p && saleSel.shelf == s) {
      ckQtySel = ckQtySel + +q;
    }
  }
  if ($("#name_product").val() !== '') {
    if (+saleSel.qty >= (+$('#qty_sale').val() + ckQtySel)) {
      //let prev = tableName.rows.length;
      //let row = tableName.insertRow(prev);
      id_row_list_sale++;
      let row = tableName.insertRow(0);
      row.id = "rowListSale" + id_row_list_sale;
      row.style.verticalAlign = "top";
      const n_col = 9;
      let col = [];
      for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
      }
      col[0].innerHTML = `<div class="text-center"><i class="fa-solid fa-xmark" onclick="delete_sale_Row(` + id_row_list_sale + `)" style="cursor:pointer; color:#d9534f;"></i></div>`
      col[1].innerHTML = `<div id="no_` + saleSel.id + `_` + id_row_list_sale + `" class="text-center"></div>`;
      col[2].innerHTML = `<div id="prod` + id_row_list_sale + `" class="text-start">` + saleSel.prod + `</div>`;
      col[3].innerHTML = `<div id="type` + id_row_list_sale + `" class="text-start">` + saleSel.type + `</div>`;
      col[4].innerHTML = `<div id="shelf` + id_row_list_sale + `" class="text-start">` + saleSel.shelf + `</div>`;
      col[5].innerHTML = `<div id="qty` + id_row_list_sale + `" class="text-end">` + $('#qty_sale').val() + `</div>`;
      col[6].innerHTML = `<div id="price` + id_row_list_sale + `" class="text-end">` + (+saleSel.price).toFixed(2) + `</div>`;
      col[7].innerHTML = `<div id="disc` + id_row_list_sale + `" class="text-end">` + (+saleSel.disc).toFixed(2) + `</div>`;
      col[8].innerHTML = `<div id="sum` + id_row_list_sale + `" class="text-end">` + ((+$('#qty_sale').val() * +saleSel.price) - +saleSel.disc).toFixed(2) + `</div>`;

      sale.dt = ymdToTimestamp($("#date_sale").val() + " 00:00:01");
      sale.bill = $("#bill_sale").val();
      sale.mem = ($("#name_member").val() == '') ? 'ทั่วไป' : $("#name_member").val();
      $("#name_product").val('');
      $("#qty_sale").val('1');
      $("#disc_sale").val('0');
      setListSale();
    } else {
      sw_Alert('warning', 'จำนวนคงเหลือไม่พอ', 'คุณเลือกสินค้าเกินจำนวนที่มีอยู่จริง');
    }

  } else {
    sw_Alert('warning', 'เพิ่มข้อมูล ไม่สำเร็จ', 'คุณยังไม่เลือกสินค้า');
  }
});

const setListSale = () => {
  const tableName = document.getElementById('listSale');
  let n = tableName.rows.length;
  if (n > 0) {
    let qty = 0, price = 0, disc = 0, sumPr = 0;
    for (let a = 0; a < n; a++) {
      const rec = (tableName.rows.item(a).cells[1].innerHTML).split('>')[0];
      qty = qty + +((tableName.rows.item(a).cells[5].innerHTML).split('>')[1]).split('</')[0];
      price = price + (+((tableName.rows.item(a).cells[6].innerHTML).split('>')[1]).split('</')[0] * +((tableName.rows.item(a).cells[5].innerHTML).split('>')[1]).split('</')[0]);
      disc = disc + +((tableName.rows.item(a).cells[7].innerHTML).split('>')[1]).split('</')[0];
      sumPr = sumPr + +((tableName.rows.item(a).cells[8].innerHTML).split('>')[1]).split('</')[0];
      tableName.rows.item(a).cells[1].innerHTML = rec + '>' + (n - a) + '</div>';
    }
    sale.discBill = +$("#disc_bill").val();
    sale.sumPrice = sumPr;
    sale.priceBill = sumPr - sale.discBill;
    sale.cashBill = sale.priceBill;
    $("#sumSaleQty").html(qty);
    $("#sumSalePrice").html(numWithCommas((price).toFixed(2)));
    $("#sumSaleDisc").html(numWithCommas((disc).toFixed(2)));
    $("#sumSaleSum").html(numWithCommas((sumPr).toFixed(2)));
    $("#sum_of_bill").val((sumPr - sale.discBill).toFixed(2));
    $("#cash_bill").val((sumPr - sale.discBill).toFixed(2));
  } else {
    $("#sumListSaleQty").html(0);
    $("#sumListSalePrice").html(numWithCommas((0).toFixed(2)));
    $("#sumListSaleDisc").html(numWithCommas((0).toFixed(2)));
    $("#sumListSaleSum").html(numWithCommas((0).toFixed(2)));
    $("#sum_of_bill").val((0).toFixed(2))
  }
}

const delete_sale_Row = (id) => {
  const txt = 'ต้องการลบ "' + $("#prod" + id).html() + '" หรือไม่';
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'mybtn btnOk me-3',
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
      $("#rowListSale" + id).remove();
      setListSale();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      /*swalWithBootstrapButtons.fire(
          'ยกเลิก',
          'ข้อมูลของคุณยังไม่ถูกลบ :)',
          'error'
      )*/
    }
  })
}

$(document).on("click", "#cancel_add_sale, #cancel_edit_sale", function () { //========== ยกเลิกการเพิ่มข้อมูล
  clsSaleShow();
  document.getElementById("fmsearch_sale").style.display = "block";
  showSaleTable(rowperpage, page_selected);
});


$(document).on("click", "#bt_cash_bill", function () {  //===== ตกลงเพิ่มข้อมูล
  sale.cashBill = +$('#cash_bill').val();
  let tableName = document.getElementById('listSale');
  if ($('#bill_sale').val() == '') {
    sw_Alert('error', 'ข้อมูลไม่ครบถ้วน', 'กรุณาระบุเลขที่เอกสาร');
    return false;
  }
  let n = tableName.rows.length;
  let array_data = new Array();
  var dataIn = (i, c) => ((tableName.rows.item(i).cells[c].innerHTML).split('">')[1]).split('</')[0];
  if (n > 0) {
    const txt = 'ต้องการบันทึก "' + sale.bill + ' (' + tsToDateShort(sale.dt, "dmy") + ')' + '" หรือไม่';
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'mybtn btnOk me-3',
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
        for (let a = 0; a < n; a++) {
          let array_cell = new Array();
          array_cell[0] = sale.dt;
          array_cell[1] = sale.bill;
          array_cell[2] = dataIn(a, 2);
          array_cell[3] = dataIn(a, 3);
          array_cell[4] = dataIn(a, 4);
          array_cell[5] = +dataIn(a, 5);
          array_cell[6] = +dataIn(a, 6);
          array_cell[7] = sale.mem;
          array_cell[8] = +dataIn(a, 7);
          array_cell[9] = sale.discBill;
          array_cell[10] = sale.priceBill;
          array_cell[11] = sale.cashBill;
          array_cell[12] = (tableName.rows.item(a).cells[1].innerHTML).split('_')[1];
          array_data.push(array_cell);
        }
        waiting();
        $.ajax({
          url: urlSale,
          type: 'GET',
          crossDomain: true,
          data: { opt_k: 'add', opt_data: JSON.stringify(array_data) },
          success: function (result) {
            waiting(false);
            if (result == "success") {
              myAlert("success", "เพิ่มข้อมูล สำเร็จ");
              clsSaleShow();
              document.getElementById("fmsearch_sale").style.display = "block";
              loadDataSale();
            } else {
              sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
            }
          },
          error: function (err) {
            console.log("Add new sale ERROR : " + err);
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

  } else {
    sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ไม่มีรายการสินค้า');
    return false;
  }
});


/*=========================== EDIt Sale =========================================================*/
const editSaleRow = (id) => { //========== เปิดเพิ่มข้อมูล  
  sale = {
    id: $("#id_sale" + id).val(),
    dt: $("#dt_sale" + id).val(),
    bill: $("#lot" + id).html(),
    mem: $("#mem" + id).html(),
    qty: +$("#qty" + id).html(),
    price: +$("#price" + id).html(),
    disc: +$("#disc" + id).html(),
    sumPrice: +$("#priceBill" + id).val() + +$("#discBill" + id).val(),
    discBill: +$("#discBill" + id).val(),
    priceBill: +$("#priceBill" + id).val(),
    cashBill: +$("#cashBill" + id).val()
  };
  id_row_list_sale = 0;
  clsSaleShow();
  let html = `     
          <div id="sale_edit" class="main_form" style="position:relative;">    
            <button class="b-top"  type="button" title="ยกเลิก" id="cancel_edit_sale">
            <i class="fa-solid fa-xmark fa-lg"></i></button>
            <form class="animate__animated animate__fadeIn" id="add_edit_form" style="padding:20px;">
              <div class="row mb-2 justify-content-md-center" >
                <div class="main_form_head"> แก้ไขรายการขาย </div>                
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="input-group mb-1">
                    <div class="input-group-prepend">
                      <label class="input-group-text " style="width: 65px; background-color:#fcdfe4;" for="date_sale_edit">วันที่</label>
                    </div>
                      <input class="form-control" type="date" id="date_sale_edit" name="date_sale_edit" value=''>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 65px; background-color:#fcdfe4;" for="bill_sale_edit">เลขที่</label>
                    <input type="text" id="bill_sale_edit" class="form-control" placeholder="เลขที่เอกสาร" aria-label="sale bill" required>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="input-group mb-1">
                    <!-- <label class="input-group-text " style="width: 65px;">สมาชิก</label> -->
                    <input type="text" id="name_member_edit" class="form-control" aria-label="member" placeholder="เลือกสมาชิก..." >
                    <button class="b-success" type="button" id="bt_open_sel_mem" title="เลือกสมาชิก"><i class="fa-solid fa-user"></i></button>
                  </div>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-md-4">
                  <div class="input-group mb-1">
                    <!-- <label class="input-group-text " style="width: 65px; background-color:#fcdfe4;">สินค้า</label> -->
                    <input type="text" id="name_product" class="form-control" aria-label="product"  placeholder="เลือกสินค้า..." disabled>
                    <button class="b-success" type="button" id="bt_open_sel_sale_edit" title="เลือกสินค้า"><i class="fa-solid fa-list"></i></button>
                  </div>
                </div>
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 65px; background-color:#fcdfe4;" for="qty_sale_edit">จำนวน</label>
                    <input type="number" id="qty_sale_edit" class="form-control" value="1" aria-label="sale Qty" min="1" step="1">
                  </div>
                </div>
                <div class="col-md">
                  <div class="input-group mb-1">
                    <label class="input-group-text " style="width: 65px;" for="disc_sale_edit">ส่วนลด</label>
                    <input type="number" id="disc_sale_edit" class="form-control" value="0" aria-label="sale discount" min="0" step="1" >     
                    <button class="b-add ms-2" type="button" id="bt_add_sale_edit" title="เพิ่มรายการ"><i class="fa-solid fa-plus"></i></button>                                
                  </div>                  
                </div>   
              </div>

            <div class="row mb-3">
                <div class="col-lg-12 mx-auto table-scroll" id="table_sale_edit" style="height: calc(100vh - 350px);">
                    <table class="list-table table animate__animated animate__fadeIn" id="saleTable_edit">
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
                        <tbody id="listSaleEdit">
                        </tbody>
                        <tfoot>
                          <tr style="background-color:var(--primary-color); color:#ffffff; font-size:1.2rem;">
                            <td class="text-end" colspan="5">รวมทั้งหมด</td> 
                            <td class="text-end" id="sumListSaleQty">0</td>                            
                            <td class="text-end" id="sumListSalePrice">0.00</td>
                            <td class="text-end" id="sumListSaleDisc">0.00</td> 
                            <td class="text-end" id="sumListSaleSum">0.00</td>                            
                          </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-1">
                  <div class="input-group">
                      <label class="input-group-text " style="width: 65px; background-color:#fcdfe4;" for="disc_bill_edit">ส่วนลด</label>
                      <input type="number" id="disc_bill_edit" class="form-control" value='0' aria-label="discount bill" min="0" step="1" >                                     
                  </div>  
                </div>
                <div class="col-md-4 mb-1">
                    <div class="input-group">
                        <label class="input-group-text " for="sum_of_bill_edit">สุทธิ</label>
                        <input type="text" id="sum_of_bill_edit" class="form-control" aria-label="sum of bill" disabled>                                     
                    </div>
                </div>
                <div class="col-md-4 mb-1">
                  <div class="input-group">
                      <label class="input-group-text " style="background-color:#fcdfe4;" for="cash_bill_edit">ชำระ</label>
                      <input type="number" id="cash_bill_edit" class="form-control me-2" value='0.00' aria-label="cash bill" min="0" step="1" > 
                      <button class="b-success" type="button" id="bt_cash_bill_edit" title="บันทึกการแก้ไข"><i class="fa-regular fa-floppy-disk fa-lg"></i></button>                                    
                  </div>  
                </div>                
            </div>
            </form>            
          </div>  
          `;
  $("#edit_sale").html(html);
  $("#date_sale_edit").val(tsToDateShort(sale.dt, 'y-m-d'));
  $("#bill_sale_edit").val(sale.bill);
  $("#name_member_edit").val(sale.mem);

  $("#disc_bill_edit").val((sale.discBill).toFixed(2));
  $("#sum_of_bill_edit").val((sale.priceBill).toFixed(2));
  $("#cash_bill_edit").val((sale.cashBill).toFixed(2));
  showListSaleTable(sale.dt, sale.bill);

  /*document.getElementById('cash_bill').disabled = true;
  document.getElementById('bt_cash_bill').disabled = true;*/
}

const myListSaleData = (dt, bill) => {
  const listData = dataAllShow;
  sortByCol(listData, 3, 0); //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
  let sumDisc = 0;
  let sumQty = 0;
  let sumPrice = 0;
  let billDisc = 0;
  let billPrice = 0;
  let billCash = 0;
  let array_Arg = new Array();
  for (let i = 0; i < listData.length; i++) {
    if (dt === listData[i][1] && bill === listData[i][2]) {
      let jsonArg = new Object();
      jsonArg.id = listData[i][0];
      jsonArg.dt = listData[i][1];
      jsonArg.bill = listData[i][2];
      jsonArg.prod = listData[i][3];
      jsonArg.type = listData[i][4];
      jsonArg.shelf = listData[i][5];
      jsonArg.qty = listData[i][6];
      jsonArg.price = listData[i][7];
      jsonArg.mem = listData[i][8];
      jsonArg.disc = listData[i][9];
      jsonArg.discBill = +listData[i][10];
      jsonArg.priceBill = +listData[i][11];
      jsonArg.cashBill = +listData[i][12];
      jsonArg.idStk = +listData[i][13];
      sumDisc = sumDisc + +listData[i][9];
      sumQty = sumQty + +listData[i][6];
      sumPrice = sumPrice + (+listData[i][6] * +listData[i][7]);
      billDisc = +listData[i][10];
      billPrice = +listData[i][11];
      billCash = +listData[i][12];
      array_Arg.push(jsonArg);
    }
  }
  const nAllData = array_Arg.length;        //==จำนวนข้อมูลทั้งหมด  
  let array_Data = new Array();
  for (let i = 0; i < array_Arg.length; i++) {
    if (array_Arg[i] != null) {
      array_Data.push(array_Arg[i]);
    }
  }
  let pageAll = new Object();
  pageAll.rec = nAllData;
  pageAll.sumDisc = sumDisc;
  pageAll.sumQty = sumQty;
  pageAll.sumPrice = sumPrice;
  pageAll.billDisc = billDisc;
  pageAll.billPrice = billPrice;
  pageAll.billCash = billCash;
  array_Data.push(pageAll);
  return array_Data;
}

const showListSaleTable = (dt, bill) => { //======================== แสดงตาราง
  const myArr = myListSaleData(dt, bill);
  const lastData = myArr.length - 1
  const tableName = document.getElementById('listSaleEdit');
  for (let i = 0; i < lastData; i++) {
    listSaleListTable(myArr[i]);
    const rec = (tableName.rows.item(i).cells[1].innerHTML).split('>')[0];
    tableName.rows.item(i).cells[1].innerHTML = rec + '>' + (lastData - i) + '</div>';
  }
  $("#sumListSaleQty").html(myArr[lastData].sumQty);
  $("#sumListSalePrice").html(numWithCommas((myArr[lastData].sumPrice).toFixed(2)));
  $("#sumListSaleDisc").html(numWithCommas((myArr[lastData].sumDisc).toFixed(2)));
  $("#sumListSaleSum").html(numWithCommas((myArr[lastData].sumPrice - myArr[lastData].sumDisc).toFixed(2)));
}

const listSaleListTable = (ob) => {  //========== ฟังก์ชั่นเพิ่ม Row ตารางข้อมูล
  const tableName = document.getElementById('listSaleEdit');
  const prev = tableName.rows.length;
  let row = tableName.insertRow(prev);
  id_row_list_sale++;
  row.id = "rowListSaleEdit" + id_row_list_sale;
  row.style.verticalAlign = "top";
  const n_col = 9;
  let col = [];
  for (let ii = 0; ii < n_col; ii++) {
    col[ii] = row.insertCell(ii);
  }
  col[0].innerHTML = `<div class="text-center"><i class="fa-solid fa-xmark" onclick="delete_listSale_Row(` + id_row_list_sale +
    `)" style="cursor:pointer; color:#d9534f;" title="ลบออก"></i></div>`
  col[1].innerHTML = `<div id="no_` + ob.idStk + `_` + id_row_list_sale + `" class="text-center">0</div>`;
  col[2].innerHTML = `<div id="prod` + id_row_list_sale + `" class="text-start">` + ob.prod + `</div>`;
  col[3].innerHTML = `<div id="type` + id_row_list_sale + `" class="text-start">` + ob.type + `</div>`;
  col[4].innerHTML = `<div id="shelf` + id_row_list_sale + `" class="text-start">` + ob.shelf + `</div>`;
  col[5].innerHTML = `<div id="qty` + id_row_list_sale + `" class="text-end">` + ob.qty + `</div>`;
  col[6].innerHTML = `<div id="price` + id_row_list_sale + `" class="text-end">` + (+ob.price).toFixed(2) + `</div>`;
  col[7].innerHTML = `<div id="disc` + id_row_list_sale + `" class="text-end">` + (+ob.disc).toFixed(2) + `</div>`;
  col[8].innerHTML = `<div id="sum` + id_row_list_sale + `" class="text-end">` + ((+ob.qty * +ob.price) - +ob.disc).toFixed(2) + `</div>`;
}

const delete_listSale_Row = (id) => {
  const txt = 'ต้องการลบ "' + $("#prod" + id).html() + '" หรือไม่';
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'mybtn btnOk me-3',
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
      $("#rowListSaleEdit" + id).remove();
      setListEdit();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      /*swalWithBootstrapButtons.fire(
          'ยกเลิก',
          'ข้อมูลของคุณยังไม่ถูกลบ :)',
          'error'
      )*/
    }
  })

}

$(document).on('change', "#disc_sale_edit", function () {
  saleSel.disc = $(this).val();
});

$(document).on('change', "#disc_bill_edit", function () {
  sale.discBill = +$(this).val();
  sale.priceBill = sale.sumPrice - +$(this).val();
  $("#sum_of_bill_edit").val((sale.priceBill).toFixed(2));
});

$(document).on('change', "#cash_bill_edit", function () {
  sale.cashBill = +$(this).val();
});

$(document).on("click", "#bt_add_sale_edit", function () { //========== เพิ่มรายการขาย โหมด แก้ไข
  const tableName = document.getElementById('listSaleEdit');
  if ($("#name_product").val() !== '') {
    if (+saleSel.qty >= (+$('#qty_sale_edit').val())) {
      //let prev = tableName.rows.length;
      //let row = tableName.insertRow(prev);
      id_row_list_sale++;
      let row = tableName.insertRow(0);
      row.id = "rowListSaleEdit" + id_row_list_sale;
      row.style.verticalAlign = "top";
      const n_col = 9;
      let col = [];
      for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
      }
      col[0].innerHTML = `<div class="text-center"><i class="fa-solid fa-xmark" onclick="delete_listSale_Row(` + id_row_list_sale + `)" style="cursor:pointer; color:#d9534f;"></i></div>`
      col[1].innerHTML = `<div id="no_` + saleSel.id + `_` + id_row_list_sale + `" class="text-center">0</div>`;
      col[2].innerHTML = `<div id="prod` + id_row_list_sale + `" class="text-start">` + saleSel.prod + `</div>`;
      col[3].innerHTML = `<div id="type` + id_row_list_sale + `" class="text-start">` + saleSel.type + `</div>`;
      col[4].innerHTML = `<div id="shelf` + id_row_list_sale + `" class="text-start">` + saleSel.shelf + `</div>`;
      col[5].innerHTML = `<div id="qty` + id_row_list_sale + `" class="text-end">` + $('#qty_sale_edit').val() + `</div>`;
      col[6].innerHTML = `<div id="price` + id_row_list_sale + `" class="text-end">` + (+saleSel.price).toFixed(2) + `</div>`;
      col[7].innerHTML = `<div id="disc` + id_row_list_sale + `" class="text-end">` + (+saleSel.disc).toFixed(2) + `</div>`;
      col[8].innerHTML = `<div id="sum` + id_row_list_sale + `" class="text-end">` + ((+$('#qty_sale_edit').val() * +saleSel.price) - +saleSel.disc).toFixed(2) + `</div>`;

      sale.dt = ymdToTimestamp($("#date_sale_edit").val() + " 00:00:01");
      sale.bill = $("#bill_sale_edit").val();
      sale.mem = ($("#name_member_edit").val() == '') ? 'ทั่วไป' : $("#name_member_edit").val();
      $("#name_product").val('');
      $("#qty_sale_edit").val('1');
      $("#disc_sale_edit").val('0');
      setListEdit();
    } else {
      sw_Alert('warning', 'จำนวนคงเหลือไม่พอ', 'คุณเลือกสินค้าเกินจำนวนที่มีอยู่จริง');
    }

  } else {
    sw_Alert('warning', 'เพิ่มข้อมูล ไม่สำเร็จ', 'คุณยังไม่เลือกสินค้า');
  }
});

const setListEdit = () => {
  const tableName = document.getElementById('listSaleEdit');
  let n = tableName.rows.length;
  if (n > 0) {
    let qty = 0, price = 0, disc = 0, sumPr = 0;
    for (let a = 0; a < n; a++) {
      const rec = (tableName.rows.item(a).cells[1].innerHTML).split('>')[0];
      qty = qty + +((tableName.rows.item(a).cells[5].innerHTML).split('>')[1]).split('</')[0];
      price = price + (+((tableName.rows.item(a).cells[6].innerHTML).split('>')[1]).split('</')[0] * +((tableName.rows.item(a).cells[5].innerHTML).split('>')[1]).split('</')[0]);
      disc = disc + +((tableName.rows.item(a).cells[7].innerHTML).split('>')[1]).split('</')[0];
      sumPr = sumPr + +((tableName.rows.item(a).cells[8].innerHTML).split('>')[1]).split('</')[0];
      tableName.rows.item(a).cells[1].innerHTML = rec + '>' + (n - a) + '</div>';
    }
    sale.discBill = +$("#disc_bill_edit").val();
    sale.sumPrice = sumPr;
    sale.priceBill = sumPr - sale.discBill;
    //sale.cashBill = sale.priceBill;
    $("#sumListSaleQty").html(qty);
    $("#sumListSalePrice").html(numWithCommas((price).toFixed(2)));
    $("#sumListSaleDisc").html(numWithCommas((disc).toFixed(2)));
    $("#sumListSaleSum").html(numWithCommas((sumPr).toFixed(2)));
    $("#sum_of_bill_edit").val((sumPr - sale.discBill).toFixed(2));
    //$("#cash_bill_edit").val((sumPr - sale.discBill).toFixed(2));
  } else {
    $("#sumListSaleQty").html(0);
    $("#sumListSalePrice").html(numWithCommas((0).toFixed(2)));
    $("#sumListSaleDisc").html(numWithCommas((0).toFixed(2)));
    $("#sumListSaleSum").html(numWithCommas((0).toFixed(2)));
    $("#sum_of_bill_edit").val((0).toFixed(2))
  }
}

$(document).on("click", "#bt_cash_bill_edit", function () {  //===== ตกลงเพิ่มข้อมูล
  if ($('#bill_sale_edit').val() == '') {
    sw_Alert('error', 'ข้อมูลไม่ครบถ้วน', 'กรุณาระบุเลขที่เอกสาร');
    return false;
  }
  const tableName = document.getElementById('listSaleEdit');
  const oldDt = sale.dt;
  const oldBill = sale.bill;
  sale.dt = ymdToTimestamp($('#date_sale_edit').val() + " 00:00:01");
  sale.bill = $('#bill_sale_edit').val();
  sale.mem = ($('#name_member_edit').val() == '') ? 'ทั่วไป' : $('#name_member_edit').val();
  sale.discBill = +$("#disc_bill_edit").val();
  sale.priceBill = +$("#sum_of_bill_edit").val();
  sale.cashBill = +$("#cash_bill_edit").val();
  const n = tableName.rows.length;
  let array_data = new Array();
  let dataIn = (i, c) => ((tableName.rows.item(i).cells[c].innerHTML).split('">')[1]).split('</')[0];
  if (n > 0) {
    const txt = 'บันทึกการแก้ไข "' + oldBill + ' (' + tsToDateShort(oldDt, 'dmy') + ')" หรือไม่';
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'mybtn btnOk me-3',
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
        for (let a = 0; a < n; a++) {
          let array_cell = new Array();
          array_cell[0] = sale.dt;
          array_cell[1] = sale.bill;
          array_cell[2] = dataIn(a, 2);
          array_cell[3] = dataIn(a, 3);
          array_cell[4] = dataIn(a, 4);
          array_cell[5] = +dataIn(a, 5);
          array_cell[6] = +dataIn(a, 6);
          array_cell[7] = sale.mem;
          array_cell[8] = +dataIn(a, 7);
          array_cell[9] = sale.discBill;
          array_cell[10] = sale.priceBill;
          array_cell[11] = sale.cashBill;
          array_cell[12] = (tableName.rows.item(a).cells[1].innerHTML).split('_')[1];
          array_data.push(array_cell);
        }
        console.log(array_data);
        waiting();
        $.ajax({
          url: urlSale,
          type: 'GET',
          crossDomain: true,
          data: { opt_k: 'edit', opt_data: JSON.stringify(array_data), opt_oldDt: oldDt, opt_oldBill: oldBill },
          success: function (result) {
            waiting(false);
            if (result == "success") {
              myAlert("success", "แก้ไขข้อมูล สำเร็จ");
              clsSaleShow();
              document.getElementById("fmsearch_sale").style.display = "block";
              loadDataSale();

            } else {
              sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
            }
          },
          error: function (err) {
            console.log("Edit sale ERROR : " + err);
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
  } else {
    sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ไม่มีรายการสินค้า');
    return false;
  }
});

    
