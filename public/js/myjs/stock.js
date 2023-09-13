/*===============================  การจัดการสต็อกสินค้า =================================*/
$(document).on("click", "#stock_mng", function () {
    page_selected = 1;
    is_sort = true;
    col_sort = 1;
    raw_sort = 0;
    stk.dt = '';
    stk.lot = '';
    var html = `
    <div class="container-fluid">
      <div class="row mt-">                
          <div class="col-lg-12 mx-auto mt-4">
              <label class="fn_name" ><i class="fa-solid fa-cubes"></i>&nbsp; สต็อกสินค้า</label>
              <form id="fmsearch_stock" >
                <div class="row mt-1">
                    <div class="col-md-4">
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <label class="input-group-text " style="width: 50px;" for="datefm">วันที่</label>
                            </div>
                            <input name="datefm" type="date" value='' id="datefm" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <label class="input-group-text " style="width: 50px;" for="dateto">ถึง</label>
                            </div>
                            <input name="dateto" type="date" value='' id="dateto" class="form-control">
                        </div>
                    </div>
                    <div class="col">
                        <div class="input-group mb-2">                  
                            <input type="text" id="search_stock" onkeypress="handle_stockSearch(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search">
                            <button class="b-success" type="button" id="bt_search_stock" title="ค้นหา"><i class="fas fa-search"></i></button>
                            <button class="b-add ms-2" id="btAddStock" type="button" title="เพิ่มข้อมูล"><i class="fa-solid fa-plus fa-lg"></i></button>
                            <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                        </div>
                    </div>
                </div>
              </form> 
          </div>          
      </div>   
      <div class="row">  
          <div class="col-lg-10 col-md-10 col-sm-12 mx-auto" id="add_stock"></div>
      </div>   
      <div class="row">  
          <div class="ccol-lg-10 col-md-10 col-sm-12 mx-auto" id="edit_stock"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-12 mx-auto" id="table_stock"></div>
      </div>
      <div class="row justify-content-center">  
          <div class="col-lg-6 col-md-8 col-sm-10 mx-auto tableSelect animate__animated animate__fadeIn" id="table_sel_prod">
            <div class="row mt-3 mb-2">  
              <div class="input-group">                  
                  <input type="text" id="search_sel" onkeypress="handle_tableSearch(event)" class="form-control" placeholder="คำค้นหา..สินค้า" aria-label="Search" aria-describedby="button-search">
                  <button class="b-success" type="button" id="bt_search_sel" title="ค้นหา"><i class="fas fa-search"></i></button>
                  <button class="b-back ms-2" id="bt_sel_back" name="bt_sel_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
              </div>
            </div>
            <div class="row">  
              <div class="col-lg-12 mx-auto tableFixHead" id="table_sel"></div>
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
    loadDataStock();
    document.getElementById("table_sel_prod").style.display = "none";
    loadDataSelect(false);
});

$(document).on('change', "#datefm", function () { 
    dT.fmShot = this.value;
    dT.fmTs = ymdToTimestamp(this.value + " 00:00:01")
});

$(document).on('change', "#dateto", function () { 
    dT.toShot = this.value;
    dT.toTs = ymdToTimestamp(this.value + " 23:59:59")
});
/*================================================= Select ====================================================================== */
$(document).on("click", "#bt_open_sel", function () { 
  document.getElementById("table_sel_prod").style.display = "block";
  showSelectTable();
});

$(document).on("click", "#bt_sel_back", function () { 
  document.getElementById("table_sel_prod").style.display = "none";
});

$(document).on('click', "#bt_search_sel", function () {  //ค้นหารายการ
  showSelectTable();
});

function handle_tableSearch(e) {
  if (e.keyCode === 13) {
      e.preventDefault();
      showSelectTable();
  }
}

function loadDataSelect(show = true) {
  if(show === true) waiting();
  $.ajax({
      url: urlProduct,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'readAll'},
      success: function (result) {
          dataAllSel = result;
          if(show === true) showSelectTable(); //<<<<<< แสดงตาราง rowperpage,page_sel           
          waiting(false);
      },
      error: function (err) {
          console.log("The server  ERROR says: " + err);
      }
  });
}

function showSelectTable(isSort=true, colSort=1) { //======================== แสดงตาราง
  var strSearch = document.getElementById('search_sel').value;
    const myArr = mySelectData(strSearch, isSort, colSort); 
    var tt = `
      <table class="list-selTable table animate__animated animate__fadeIn" id="selectTable" >
        <thead>
          <tr>
            <th class="text-left">สินค้า</th>
            <th class="text-left">ประเภท</th>
            <th class="text-end">Qty.</th>          
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>                     
      `;
    $("#table_sel").html(tt);
    for (let i = 0; i < myArr.length - 1; i++) {
      listSelectTable(myArr[i]);
    }
    
}

function mySelectData(shText = "", isSort = true, colSort = 0){
  const search_str = shText.toLowerCase().split(",");
  if(isSort == true ) sortByCol(dataAllSel, colSort, 0); //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
  let array_Arg = new Array();
  for(let i = 0; i < dataAllSel.length; i++){
      const condition = search_str.some(el => dataAllSel[i][1].toLowerCase().includes(el));
      const condition2 = search_str.some(el => dataAllSel[i][2].toLowerCase().includes(el));  //รุ่น
      const condition3 = search_str.some(el => dataAllSel[i][3].toLowerCase().includes(el));  //ประเภท
      const condition4 = search_str.some(el => dataAllSel[i][4].toLowerCase().includes(el));  //รายละเอียด
      if (condition || condition2 || condition3 || condition4) {
          let jsonArg = new Object();
          jsonArg.id = dataAllSel[i][0];
          jsonArg.name = dataAllSel[i][1]; 
          jsonArg.brand = dataAllSel[i][2]; 
          jsonArg.type = dataAllSel[i][3]; 
          jsonArg.desc = dataAllSel[i][4]; 
          jsonArg.urlpic1 = dataAllSel[i][5];  
          jsonArg.urlpic2 = dataAllSel[i][6]; 
          jsonArg.urlpic3 = dataAllSel[i][7]; 
          jsonArg.urlpic4 = dataAllSel[i][8]; 
          jsonArg.urlpic5 = dataAllSel[i][9]; 
          jsonArg.urlpic6 = dataAllSel[i][10]; 
          jsonArg.qty = (dataAllSel[i][11] == undefined)?0:dataAllSel[i][11]; 
          jsonArg.price = dataAllSel[i][12]; 
          array_Arg.push(jsonArg);
      }
  }
  return array_Arg;
}

function listSelectTable(ob) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางข้อมูล
  let tableName = document.getElementById('selectTable');
  let prev = tableName.rows.length;
  let row = tableName.insertRow(prev);
  row.id = "row" + ob.id;
  row.style.verticalAlign = "top";
  let n_col = 3;
  let col = [];
  for (let ii = 0; ii < n_col; ii++) {
      col[ii] = row.insertCell(ii);
  }
  col[0].innerHTML = `<div id="name` + ob.id + `" class="text-left" onclick="selectedData(` + ob.id + `);">` + ob.name + `</div>`;
  col[1].innerHTML = `<div id="type` + ob.id + `" class="text-left" onclick="selectedData(` + ob.id + `);">` + ob.type + `</div>`;
  col[n_col-1].innerHTML = `<div id="desc` + ob.id + `" class="text-end" onclick="selectedData(` + ob.id + `);">` + ob.qty + `</div>`;

}

function selectedData(id){

  $("#name_product").val($("#name"+id).html());
  $("#type_product").val($("#type"+id).html());
  document.getElementById("table_sel_prod").style.display = "none";
}
/*========================================= End Select ==============================================================*/

function loadDataStock(show = true) {
  if(show === true) waiting();
  $.ajax({
      url: urlStock,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'readAll', opt_data:'stock'},
      success: function (result) {
          dataAllShow = result;
          if(show === true) showStockTable(rowperpage, page_selected); //<<<<<< แสดงตาราง rowperpage,page_sel   
          waiting(false);
      },
      error: function (err) {
          console.log("The server  ERROR says: " + err);
      }
  });
}

function myStockData(shText = "", colSort = 0, isSort = false, rawSort = 0, page = 1, perPage = 10){
    const search_str = shText.toLowerCase().split(",");
    if(isSort = true ) sortByCol(dataAllShow, colSort, rawSort); //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
    var sumQty = 0;
    var sumPrice = 0;
    let array_Arg = new Array();
    for(let i = 0; i < dataAllShow.length; i++){
      const condition = search_str.some(el => dataAllShow[i][2].toLowerCase().includes(el));  //lot_no
      const condition2 = search_str.some(el => dataAllShow[i][3].toLowerCase().includes(el));  //ชื่อ
      const condition3 = search_str.some(el => dataAllShow[i][4].toLowerCase().includes(el));  //ประเภท
      const condition4 = search_str.some(el => dataAllShow[i][7].toLowerCase().includes(el));  //ผู้ที่ขาย
      const condition5 = search_str.some(el => dataAllShow[i][8].toLowerCase().includes(el));  //ที่จัดเก็บ
      const condition6 = search_str.some(el => dataAllShow[i][9].toLowerCase().includes(el));  //รายละเอียด
      if (condition || condition2 || condition3 || condition4 || condition5 || condition6) {
        if (+dataAllShow[i][1] >= dT.fmTs && +dataAllShow[i][1] <= dT.toTs) {
            let jsonArg = new Object();
            jsonArg.id = dataAllShow[i][0];
            jsonArg.dt = dataAllShow[i][1]; 
            jsonArg.lot = dataAllShow[i][2];  
            jsonArg.prod = dataAllShow[i][3];  
            jsonArg.type = dataAllShow[i][4]; 
            jsonArg.amount = dataAllShow[i][5];  
            jsonArg.price = dataAllShow[i][6]; 
            jsonArg.from = dataAllShow[i][7]; 
            jsonArg.shelf = dataAllShow[i][8];  
            jsonArg.comm = dataAllShow[i][9]; 
            jsonArg.point = dataAllShow[i][10]; 
            sumQty = sumQty + +dataAllShow[i][5];
            sumPrice = sumPrice + (+dataAllShow[i][5] * +dataAllShow[i][6]);
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
    pageAll.sumQty = sumQty;
    pageAll.sumPrice = sumPrice;
    array_Data.push(pageAll);
    return array_Data;
  }
  
  function clsStockShow(){
      $("#add_stock").html("");
      $("#edit_stock").html("");
      $("#table_stock").html("");  
  }
  
  $(document).on('click', "#bt_search_stock", function () {  //ค้นหารายการ
      showStockTable(rowperpage, 1);
  });
  
  function handle_stockSearch(e) {
      if (e.keyCode === 13) {
          e.preventDefault();
          showStockTable(rowperpage, 1);
      }
  }
  
function showStockTable(per=10, p=1, colSort=1, isSort=true, rawSort=0) { //======================== แสดงตาราง
    var strSearch = document.getElementById('search_stock').value;
    var n = ((p - 1) * per);
    const myArr = myStockData(strSearch, colSort, isSort, rawSort, p, per);
    let page_all = myArr[myArr.length - 1].page;
      let rec_all = myArr[myArr.length - 1].rec;
      let sum_qty = myArr[myArr.length - 1].sumQty;
      let sum_price = myArr[myArr.length - 1].sumPrice.toFixed(2);
      page_selected = (p >= page_all) ? page_all : p;
      is_sort = isSort;
      col_sort = colSort;
      raw_sort = rawSort;
      let on_clk = ['','','','','','','','','','','']; 
      let sortTxt = ['','','','','','','','','','',''];  
      for(let j=0; j < on_clk.length; j++){
        if(j == colSort){
            if(rawSort == 0){
                on_clk[j] = 'showStockTable(rowperpage,1,'+j+',true,1);';
                sortTxt[j] = '<i class="fa-solid fa-sort-up"></i>';
                
            }else{
                on_clk[j] = 'showStockTable(rowperpage,1,'+j+',true,0);';
                sortTxt[j] = '<i class="fa-solid fa-sort-down"></i>';
            }        
        }else{
            on_clk[j] = 'showStockTable(rowperpage,1,'+j+',true,0);';
            sortTxt[j] = '<i class="fa-solid fa-sort"></i>';
        }
      }
      var tt = `
        <table class="list-table table animate__animated animate__fadeIn" id="stockTable" >
          <thead>
            <tr id="stockHeadTb">
              <th class="text-center sort-hd" onclick="`+on_clk[1]+`">`+sortTxt[1]+`&nbsp; วันที่</th> 
              <th class="text-left sort-hd" onclick="`+on_clk[2]+`">`+sortTxt[2]+`&nbsp; Lot</th>
              <th class="text-left sort-hd" onclick="`+on_clk[3]+`">`+sortTxt[3]+`&nbsp; รายการ</th>
              <th class="text-left sort-hd" onclick="`+on_clk[4]+`">`+sortTxt[4]+`&nbsp; ประเภท</th>
              <th class="text-center sort-hd" onclick="`+on_clk[5]+`">`+sortTxt[5]+`&nbsp; จำนวน</th>
              <th class="text-center">@</th>
              <th class="text-left sort-hd" onclick="`+on_clk[7]+`">`+sortTxt[7]+`&nbsp; รับมาจาก</th>
              <th class="text-left sort-hd" onclick="`+on_clk[8]+`">`+sortTxt[8]+`&nbsp; ที่จัดเก็บ</th>
              <th class="text-left sort-hd" onclick="`+on_clk[9]+`">`+sortTxt[9]+`&nbsp; หมายเหตุ</th>
              <th class="text-center">Point</th>
              <th class="text-center">แก้ไข&nbsp;&nbsp;&nbsp;ลบ</th>                  
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table> 
          <div class="row animate__animated animate__fadeIn">
            <div class="col-auto me-auto" style="font-size: 0.8rem;">
              <label  for="rowShow_stock">แถวแสดง:</label>
              <input type="number" id="rowShow_stock" name="rowShow_stock" min="1" max="99" step="1" value="" style="text-align:center;">
            </div>
            <div class="col">
              <div id="pagination"></div>
            </div>
            <div class="col-auto" style="font-size: 0.8rem; text-align:right;">
              <label id="record"></label>
            </div>
          </div>                     
        `;
      $("#table_stock").html(tt);
      document.getElementById("rowShow_stock").value = rowperpage.toString();
      document.getElementById("record").innerHTML = "ทั้งหมด : "+ sum_qty +" หนวย, "+ numWithCommas(sum_price) +" บาท, " + rec_all + " รายการ";
      for (let i = 0; i < myArr.length - 1; i++) {
        n++;
        listStockTable(myArr[i], n);
      }
      pagination_show(p, page_all, rowperpage, 'showStockTable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
}

$(document).on("change", "#rowShow_stock", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
  rowperpage = +$("#rowShow_stock").val();
  showStockTable(rowperpage, 1);
});

function listStockTable(ob, i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางประเเภท
    let tableName = document.getElementById('stockTable');
    let prev = tableName.rows.length;
    let row = tableName.insertRow(prev);
    row.id = "row" + ob.id;
    row.style.verticalAlign = "top";
    row.style.color = (ob.st == "TRUE")?"#a0a0a0":"#000000";
    //row.style.height = "50px";
    /*let txtDel = `<i class="fas fa-trash-alt" style="cursor:not-allowed; color:#939393;"></i>`;
    if(u_level == "0"){*/
    txtDel = `<i class="fa-solid fa-xmark" onclick="delete_stock_Row(` + ob.id + `)" style="cursor:pointer; color:#d9534f;"></i>`;
    //}
    let n_col = 11;
    let col = [];
    for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
    }
    col[0].innerHTML = `<div id="dt` + ob.id + `" class="text-center">` + tsToDateShort(+ob.dt) + `</div>`;
    col[1].innerHTML = `<div id="lot` + ob.id + `" class="text-left">` + ob.lot + `</div>`;
    col[2].innerHTML = `<div id="prod` + ob.id + `" class="text-left">` + ob.prod + `</div>`;
    col[3].innerHTML = `<div id="type` + ob.id + `" class="text-left">` + ob.type + `</div>`;
    col[4].innerHTML = `<div id="qty` + ob.id + `" class="text-center">` + ob.amount + `</div>`;
    col[5].innerHTML = `<div id="price` + ob.id + `" class="text-end">` + (+ob.price).toFixed(2) + `</div>`;
    col[6].innerHTML = `<div id="from` + ob.id + `" class="text-right">` + ob.from + `</div>`;
    col[7].innerHTML = `<div id="shelf` + ob.id + `" class="text-center">` + ob.shelf + `</div>`;
    col[8].innerHTML = `<div id="comm` + ob.id + `" class="text-right">` + ob.comm + `</div>`;
    col[9].innerHTML = `<div id="point` + ob.id + `" class="text-center">` + ob.point + `</div>`;
    col[n_col - 1].innerHTML = `
      <input type="hidden" id="id_stock` + ob.id + `" value="` + ob.id + `" /> 
      <input type="hidden" id="dt_stock` + ob.id + `" value="` + ob.dt + `" /> 
      <i class="fas fa-edit me-3" onclick="editStockRow(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
      `+ txtDel;
    col[n_col - 1].style = "text-align: center;";
}

$(document).on("click", "#btAddStock", function () { //========== เปิดเพิ่มข้อมูล
  clsStockShow();
  var html = `     
    <div id="stock_add" class="main_form">    
      <form class="animate__animated animate__fadeIn" id="add_stock_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;"> รับเข้าสต็อก </div>     
        </div> 
        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <label class="input-group-text " style="width: 75px; background-color:#fcdfe4" for="date_stock">วันที่</label>
              </div>
                <input class="form-control" type="date" id="date_stock" name="date_stock" value=''>
            </div>  
          </div>       
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px; background-color:#fcdfe4" for="lot_stock">Lot.No.</label>
              <input type="text" id="lot_stock" class="form-control" placeholder="เลขที่รับเข้า" aria-label="stock lot" required>
            </div>     
          </div>      
        </div>   

        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px; background-color:#fcdfe4">สินค้า</label>
              <input type="text" id="name_product" class="form-control" aria-label="product name" disabled><button class="b-success" type="button" id="bt_open_sel" title="เลือกสินค้า"><i class="fa-solid fa-list"></i></button>
            </div> 
          </div> 
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px;" for="type_product">ประเภท</label>
              <input type="text" id="type_product" class="form-control" aria-label="product type" disabled>
            </div>     
          </div>             
        </div>  

        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px;" for="qty_stock">จำนวน</label>
              <input type="number" id="qty_stock" class="form-control" aria-label="quantity stock" min="0" step="1" value="0">
            </div> 
          </div> 
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px;" for="price_stock">ราคา</label>
              <input type="number" id="price_stock" class="form-control" aria-label="stock price" min="0" step="0.10" value="0.00">
            </div>     
          </div>             
        </div>  

        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px;" for="from_stock">รับจาก</label>
              <input type="text" id="from_stock" class="form-control" aria-label="from stock">
            </div> 
          </div> 
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 90px;" for="comm_stock">รายละเอียด</label>
              <input type="text" id="comm_stock" class="form-control" aria-label="stock comment">
            </div>     
          </div>             
        </div>  

        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px;" for="point_product">Point</label>
              <input type="number" id="point_product" class="form-control" aria-label="product point" min="0" step="1" value="0">
            </div>     
          </div>  
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text" for="selShelf" style="width:90px;">ช่องจัดเก็บ</label>
              <select class="form-select" id="selShelf">
                  <!--<option selected value="0">A000--พื้นที่ตรวจรับของ</option>-->
              </select>
            </div> 
          </div>       
        </div>  

        <div class="row justify-content-center mt-3" style="text-align: center;">
          <button type="submit" class="mybtn btnOk">บันทึก</button>
          <button type="button" class="mybtn btnCan" id="cancel_add_stock">ยกเลิก</button>
        </div>             
        
      </form>
    </div>  
    `;
  $("#add_stock").html(html);
  $("#date_stock").val((stk.dt == '')?date_Now("y-m-d"):stk.dt);
  $("#lot_stock").val(stk.lot);
  initDropdownList(urlData,'selShelf','shelf',true)

});


$(document).on("click", "#cancel_add_stock", function () { //========== ยกเลิกการเพิ่มข้อมูล
  clsStockShow();
  showStockTable(rowperpage, page_selected);
});

$(document).on("submit", "#add_stock_form", function () {  //===== ตกลงเพิ่มข้อมูล
  let my_form = $(this);
  const sel_prod = my_form.find("#name_product").val(); 
  var shelf_product = document.getElementById("selShelf").options[document.getElementById("selShelf").selectedIndex].text;  
  shelf_product = shelf_product.split("--")[0];
  if(sel_prod != ""){
    const d_stk = [
      ymdToTimestamp(my_form.find("#date_stock").val() + " 00:00:01"),
      my_form.find("#lot_stock").val(),
      sel_prod,
      my_form.find("#type_product").val(),
      my_form.find("#qty_stock").val(),
      my_form.find("#price_stock").val(),
      my_form.find("#from_stock").val(),
      my_form.find("#comm_stock").val(),
      my_form.find("#point_product").val(),
      shelf_product
    ];
    waiting();
    $.ajax({
      url: urlStock,
      type: 'GET',
      crossDomain: true,
      data: { opt_k:'add', opt_dt: d_stk[0] , opt_lot: d_stk[1], opt_prod: d_stk[2], opt_type: d_stk[3], opt_qty: d_stk[4],
    opt_price: d_stk[5], opt_from: d_stk[6], opt_comm: d_stk[7], opt_point: d_stk[8], opt_shelf: d_stk[9] },
      success: function (result) {
        waiting(false);
        if (result == "success") {
          myAlert("success", "เพิ่มข้อมูล สำเร็จ");
          stk.dt = my_form.find("#date_stock").val();
          stk.lot = d_stk[1];
          $("#search_stock").val(d_stk[1]);
          $("#add_stock").html("");
          loadDataStock();
        } else if (result == "exits") {
          sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', d_stk[1] + ' ซ้ำ! มีการใช้ชื่อนี้แล้ว');
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
    sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'กรุณาระบุสินค้าที่ต้องการรับเข้า');
    return false;
  }
});

 
function delete_stock_Row(id) { //================================ ลบข้อมูล  lot_stock
  var del_name = $('#prod' + id).html() + " ("+$('#lot' + id).html()+") ";
  const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
          confirmButton: 'mybtn btnOk',
          cancelButton: 'mybtn btnCan'
      },
      buttonsStyling: false
  })
  swalWithBootstrapButtons.fire({
      title: 'โปรดยืนยัน ',
      text: del_name + " ลบหรือไม่ ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '&nbsp;&nbsp;ตกลง&nbsp;&nbsp;',
      cancelButtonText: '&nbsp;&nbsp;ไม่&nbsp;&nbsp;',
      reverseButtons: false
  }).then((result) => {
      if (result.isConfirmed) {
          waiting();
          $.ajax({
            url: urlStock,
            type: 'GET',
            crossDomain: true,
            data: { opt_k:'del', opt_id:id },
            success: function (result) {
              waiting(false);
              if(result == "success"){
                myAlert("success", "ข้อมูลถูกลบแล้ว !");
                loadDataStock();
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


function editStockRow(id) { //================================ เปิดหน้าแก้ไขข้อมูล      
  var html = `     
  <div id="stock_edit" class="main_form">    
      <form class="animate__animated animate__fadeIn" id="edit_stock_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;"> แก้ไขข้อมูลสต็อก </div>     
        </div> 
        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <label class="input-group-text " style="width: 75px; background-color:#fcdfe4" for="date_stock">วันที่</label>
              </div>
                <input class="form-control" type="date" id="date_stock" name="date_stock" value=''>
            </div>  
          </div>       
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px; background-color:#fcdfe4" for="lot_stock">Lot.No.</label>
              <input type="text" id="lot_stock" class="form-control" placeholder="เลขที่รับเข้า" aria-label="stock lot" required>
            </div>     
          </div>      
        </div>   

        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px; background-color:#fcdfe4">สินค้า</label>
              <input type="text" id="name_product" class="form-control" aria-label="product name" disabled><button class="b-success" type="button" id="bt_open_sel" title="เลือกสินค้า"><i class="fa-solid fa-list"></i></button>
            </div> 
          </div> 
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px;" for="type_product">ประเภท</label>
              <input type="text" id="type_product" class="form-control" aria-label="product type" disabled>
            </div>     
          </div>             
        </div>  

        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px;" for="qty_stock">จำนวน</label>
              <input type="number" id="qty_stock" class="form-control" aria-label="quantity stock" min="0" step="1" value="0">
            </div> 
          </div> 
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px;" for="price_stock">ราคา</label>
              <input type="number" id="price_stock" class="form-control" aria-label="stock price" min="0" step="0.10" value="0.00">
            </div>     
          </div>             
        </div>  

        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px;" for="from_stock">รับจาก</label>
              <input type="text" id="from_stock" class="form-control" aria-label="from stock">
            </div> 
          </div> 
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 90px;" for="comm_stock">รายละเอียด</label>
              <input type="text" id="comm_stock" class="form-control" aria-label="stock comment">
            </div>     
          </div>             
        </div>  

        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text " style="width: 75px;" for="point_product">Point</label>
              <input type="number" id="point_product" class="form-control" aria-label="product point" min="0" step="1" value="0">
            </div>     
          </div>  
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text" for="selShelf" style="width:90px;">ช่องจัดเก็บ</label>
              <select class="form-select" id="selShelf">
                  <option selected value="0">A000--พื้นที่ตรวจรับของ</option>
              </select>
            </div> 
          </div>       
        </div>  

        <div class="row justify-content-center mt-3" style="text-align: center;">
          <button type="submit" class="mybtn btnOk">บันทึก</button>
          <button type="button" class="mybtn btnCan" id="cancelEditStock">ยกเลิก</button>
          <input id="id_stock" type="hidden">
        </div>             
        
      </form>
    </div>  
  `;
  $("#edit_stock").html(html);
  setDropdownList(urlData,'selShelf', 'shelf', $("#shelf"+id).html());
  $("#id_stock").val(id);    
  $("#date_stock").val(tsToDateShort($('#dt_stock' + id).val(),"y-m-d"));
  $("#lot_stock").val($('#lot' + id).html());
  $("#name_product").val($('#prod' + id).html());
  $("#type_product").val($('#type' + id).html());
  $("#qty_stock").val(+($('#qty' + id).html()));
  $("#price_stock").val(+($('#price' + id).html()));
  $("#from_stock").val($('#from' + id).html());  
  $("#comm_stock").val($('#comm' + id).html());
  $("#point_product").val($('#point' + id).html());
  $("#table_stock").html("");
  
}

$(document).on("click", "#cancelEditStock", function () { //========== ยกเลิกการแก้ไขข้อมูล
  clsStockShow();
  showStockTable(rowperpage, page_selected);
});

$(document).on("submit", "#edit_stock_form", function () {  //===== ตกลงแก้ไข/เปลี่ยนข้อมูล
  let my_form = $(this);
  const id_stock = my_form.find("#id_stock").val();
  const sel_prod = my_form.find("#name_product").val(); 
  var shelf_product = document.getElementById("selShelf").options[document.getElementById("selShelf").selectedIndex].text;  
  shelf_product = shelf_product.split("--")[0];  
    const d_stk = [
      ymdToTimestamp(my_form.find("#date_stock").val() + " 00:00:01"),
      my_form.find("#lot_stock").val(),
      sel_prod,
      my_form.find("#type_product").val(),
      my_form.find("#qty_stock").val(),
      my_form.find("#price_stock").val(),
      my_form.find("#from_stock").val(),
      my_form.find("#comm_stock").val(),
      my_form.find("#point_product").val(),
      shelf_product
    ];
  waiting();
  $.ajax({
    url: urlStock,
    type: 'GET',
    crossDomain: true,
    data: { opt_k: 'edit', opt_id: id_stock, opt_dt: d_stk[0] , opt_lot: d_stk[1], opt_prod: d_stk[2], opt_type: d_stk[3], opt_qty: d_stk[4],
    opt_price: d_stk[5], opt_from: d_stk[6], opt_comm: d_stk[7], opt_point: d_stk[8], opt_shelf: d_stk[9]},
    success: function (result) {
      console.log(result);
      waiting(false);
      if (result == "success") {
        waiting(false);
        myAlert("success", "แก้ไขข้อมูล สำเร็จ");
        clsStockShow();
        loadDataStock();
      } else {
        sw_Alert('error', 'แก้ไขข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
      }
    },
    error: function (err) {
      console.log("Edit stock ERROR : " + err);
    }
  });
  return false;
});