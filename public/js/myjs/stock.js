/*===============================  การจัดการสต็อกสินค้า =================================*/
$(document).on("click", "#stock_mng", function () {
    page_selected = 1;
    is_sort = true;
    col_sort = 1;
    raw_sort = 0;
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
                            <input type="text" id="search_stock" onkeypress="handle_stockSearch(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search">
                            <button class="b-success" type="button" id="bt_search_stock" title="ค้นหา"><i class="fas fa-search"></i></button>
                            <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                        </div>
                    </div>
                </div>
              </form> 
          </div>          
      </div>   
      <div class="row">  
          <div class="col-lg-7 col-md-9 col-sm-12 mx-auto" id="add_stock"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="edit_stock"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-12 mx-auto" id="table_stock"></div>
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
});

$(document).on('change', "#datefm", function () { 
    dT.fmShot = this.value;
    dT.fmTs = ymdToTimestamp(this.value + " 00:00:01")
});

$(document).on('change', "#dateto", function () { 
    dT.toShot = this.value;
    dT.toTs = ymdToTimestamp(this.value + " 23:59:59")
});

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
    let array_Arg = new Array();
    for(let i = 0; i < dataAllShow.length; i++){
      const condition = search_str.some(el => dataAllShow[i][2].includes(el));  //lot_no
      const condition2 = search_str.some(el => dataAllShow[i][3].includes(el));  //ชื่อ
      const condition3 = search_str.some(el => dataAllShow[i][4].includes(el));  //ประเภท
      const condition4 = search_str.some(el => dataAllShow[i][7].includes(el));  //ผู้ที่ขาย
      const condition5 = search_str.some(el => dataAllShow[i][8].includes(el));  //ที่จัดเก็บ
      const condition6 = search_str.some(el => dataAllShow[i][9].includes(el));  //รายละเอียด
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
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem;">
              <label  for="rowShow_stock">แถวแสดง:</label>
              <input type="number" id="rowShow_stock" name="rowShow_stock" min="1" max="99" step="1" value="" style="text-align:center;">
            </div>
            <div class="col-sm-6 mb-2">
              <div id="pagination"></div>
            </div>
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem; text-align:right;">
              <label id="record"></label>
            </div>
          </div>                     
        `;
      $("#table_stock").html(tt);
      document.getElementById("rowShow_stock").value = rowperpage.toString();
      document.getElementById("record").innerHTML = "ทั้งหมด : " + rec_all + " รายการ";
      for (let i = 0; i < myArr.length - 1; i++) {
        n++;
        listStockTable(myArr[i], n);
      }
      pagination_show(p, page_all, rowperpage, 'showStockTable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
}

$(document).on("change", "#rowShow_Stock", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
  rowperpage = +$("#rowShow_Stock").val();
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
    col[4].innerHTML = `<div id="amount` + ob.id + `" class="text-center">` + ob.amount + `</div>`;
    col[5].innerHTML = `<div id="price` + ob.id + `" class="text-end">` + ob.price + `</div>`;
    col[6].innerHTML = `<div id="from` + ob.id + `" class="text-right">` + ob.from + `</div>`;
    col[7].innerHTML = `<div id="shelf` + ob.id + `" class="text-center">` + ob.shelf + `</div>`;
    col[8].innerHTML = `<div id="comm` + ob.id + `" class="text-right">` + ob.comm + `</div>`;
    col[9].innerHTML = `<div id="point` + ob.id + `" class="text-center">` + ob.point + `</div>`;
    col[n_col - 1].innerHTML = `
      <input type="hidden" id="id_stock` + ob.id + `" value="` + ob.id + `" /> 
      <i class="fas fa-edit me-3" onclick="editStockRow(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
      `+ txtDel;
    col[n_col - 1].style = "text-align: center;";
}