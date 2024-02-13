
//============================  Main App  ==============================================
goBack();
waiting(false);

function showLogin(){
    document.getElementById("content").style.display = "none";    
    document.getElementById("login_form").reset();
    document.getElementById("setting").style.display = "none";
    document.getElementById("main_setting").style.display = "none";
    document.getElementById("login").style.display = "block";
}

function goBack(){    
    document.getElementById("login").style.display = "none";
    document.getElementById("setting").style.display = "none";
    document.getElementById("main_setting").style.display = "none";    
    document.getElementById("content").style.display = "block";
    showCommNew();
    showProduct();
}

function showSetting(){
    document.getElementById("content").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("setting").style.display = "block";
    document.getElementById("main_setting").style.display = "block";
    show_home();
}

$(".offcanvas .myNavItem").click(function(){
    $('.offcanvas').offcanvas('hide');
});

$(document).on("click", "#bt_back", function () {
    show_home();
});

function pagination_show(page, pageall, per, fn) { //======== แสดงตัวจัดการหน้าข้อมูล Pagination      
    let max_p = parseInt(pageall);
    let p = parseInt(page);
    let p_prev = (p > 1) ? p - 1 : 1;
    let p_next = (p < max_p) ? p + 1 : max_p;
    let sortTxt = ','+ col_sort + ',' + is_sort + ',' + raw_sort;
    let pag_h = `<div class="pagination justify-content-center">`;
    let pag_prev = `<a href="#" id="pag_prev" title="Previous" onclick=` + fn + `(` + per + `,` + p_prev + sortTxt +`)><i class="fa-solid fa-angles-left"></i></a>`; //&laquo;
    let pag_next = `<a href="#" id="pag_next" title="Next" onclick=` + fn + `(` + per + `,` + p_next + sortTxt +`)><i class="fa-solid fa-angles-right"></i></a></div>`;           //&raquo;  
    let pag_in = "";
    let h2 = 0;
    let h1 = 0;
    page_sel = page;
    if (max_p <= 7) {
        let act = "";
        for (var j = 1; j <= max_p; j++) {
            if (p == 1) { pag_prev = ''; }
            if (p == max_p) { pag_next = `</div>`; }
            if (p == j) {
                //pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + j + `)>` + j + `</a> `;
                pag_in += `<a href="#" class="active" >` + j + `</a> `;
            } else {
                pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + j + sortTxt + `)>` + j + `</a> `;
            }
        }
    } else {
        if (p < 5) {  //เลือกหน้าที่น้อยกว่าหน้าที่ 5
            for (var k = 1; k <= p + 2; k++) {
                if (p == 1) { pag_prev = ''; }
                if (p == k) {
                    //pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + k + `)>` + k + `</a> `;
                    pag_in += `<a href="#" class="active" >` + k + `</a> `;
                } else {
                    pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + k + sortTxt +`)>` + k + `</a> `;
                }
            }
            h2 = Math.ceil((4 + max_p - 1) / 2);
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h2 + `)>...</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + (max_p - 1) + sortTxt +`)>` + (max_p - 1) + `</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + (max_p) + sortTxt +`)>` + (max_p) + `</a> `;

        } else if (p > (max_p - 4)) { //เลือกหน้าที่ก่อนถึงหน้าสุดท้าย อยู่ 4 หน้า
            h1 = Math.ceil((2 + max_p - 3) / 2);
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,'1'`+ sortTxt +`)>1</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,'2'`+ sortTxt +`)>2</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h1 + sortTxt +`)>...</a> `;
            for (var m = (p - 2); m <= max_p; m++) {
                if (p == max_p) { pag_next = `</div>`; }
                if (p == m) {
                    //pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + m + `)>` + m + `</a> `;
                    pag_in += `<a href="#" class="active" >` + m + `</a> `;
                } else {
                    pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + m + sortTxt +`)>` + m + `</a> `;
                }
            }

        } else { //เลือกหน้าที่อยู่ระหว่างหน้าที่ 5 และก่อนถึงหน้าสุดท้ายอยู่ 4 หน้า
            h1 = Math.ceil((p - 2) / 2);
            h2 = Math.ceil((p + 2 + max_p) / 2);
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,'1'`+ sortTxt +`)>1</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h1 + sortTxt +`)>...</a> `;

            for (var k = (p - 2); k <= p + 2; k++) {
                if (p == k) {
                    //pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + k + `)>` + k + `</a> `;
                    pag_in += `<a href="#" class="active" >` + k + `</a> `;
                } else {
                    pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + k + sortTxt +`)>` + k + `</a> `;
                }

            }
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h2 + sortTxt +`)>...</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + (max_p) + sortTxt +`)>` + (max_p) + `</a> `;
        }
    }

    $("#pagination").html(pag_h + pag_prev + pag_in + pag_next);
}

function waiting(order = true) {
    if (order) {
        $(".myWaiting").show();
    } else {
        $(".myWaiting").hide();
    }
}

function linkPic(id,pic){
    var lk = '';
    if(id === '' || id === null || id === undefined || id === 'undefined'){
        lk = pic;
    }else{
        //lk = 'https://drive.google.com/uc?id=' + id;
        //lk = 'https://drive.google.com/uc?export=download&id=' + id; //for download  
        //lk = 'https://drive.google.com/uc?export=view&id=' + id;
        lk = "https://drive.google.com/thumbnail?id="+ id +"&sz=w1000";
    }
    return lk
}

function showCommNew() { //======================== แสดงจำนวนข้อความใหม่
    document.getElementById("cmNew").style.display = "none";
    $.ajax({
        url: urlComm,
        type: 'GET',
        crossDomain: true,
        data: { opt_k: 'new', opt_comed: comed },
        success: function (result) {
            const myArr = JSON.parse(JSON.stringify(result));
            let cm_new = myArr.cmNew;
            if(+cm_new > 10){
                document.getElementById("cmNew").style.display = "block";                
                document.getElementById("cmNew").innerHTML = "10+";
            }else if(+cm_new > 0){
                document.getElementById("cmNew").style.display = "block";   
                document.getElementById("cmNew").innerHTML = cm_new;
            }else{
                document.getElementById("cmNew").style.display = "none";   

            }
            document.getElementById("comePage").innerHTML = "( "+ numWithCommas(myArr.comePage) + "  )";
            comed = true;
            document.getElementById("promText").innerHTML = myArr.promText;
            document.getElementById("promCode").innerHTML = "Code : "+ myArr.promCode;
            
        },
        error: function (err) {
            console.log("The server  ERROR says: " + err);
        }
    });
}


function initDropdownList(url,id, data,descTxt = false) { 
    $.ajax({ // (urlAppscript, idSelect , lenghtData, idcol, namecol) initDropdownList(urlUser,'selPos','dataset!A2:B',0,1);
        url: url,
        type: 'GET',
        crossDomain: true,
        data: { opt_k: 'readDataSel', opt_data:data},
        success: function (result) {
            const myArr = JSON.parse(JSON.stringify(result));
            var option;
            select = document.getElementById(id);
            /*while (select.options.length > 0) { //== delete
                select.remove(0);
            }*/
            for (let i = 0; i <= myArr.length - 1; i++) {
                option = document.createElement('option');
                option.value = myArr[i].id;
                if(descTxt){
                    option.text = myArr[i].name + '--' + myArr[i].desc;
                }else{
                    option.text = myArr[i].name;    
                }
                
                select.add(option);
            }
        },
        error: function (err) {
            console.log("readDataSel ERROR : " + err);
        }
    });

}

function setDropdownList(url, id, data, txt) { 
    $.ajax({ //setDropdownList(urlUser,'selBranch','branch!A2:B',document.getElementById('branch'+id).innerHTML);
        url: url,
        type: 'GET',
        crossDomain: true,
        data: { opt_k: 'readDataSel', opt_data:data},
        success: function (result) {
            const myArr = JSON.parse(JSON.stringify(result));
            var option;
            var select = document.getElementById(id);
            while (select.options.length > 0) {
                select.remove(0);
            }
            for (let i = 0; i <= myArr.length - 1; i++) {
                option = document.createElement('option');
                option.value = myArr[i].id;
                option.text = myArr[i].name + "--" + myArr[i].desc;
                select.add(option);
            }
            $('#' + id + ' option').each(function () {
                if (($(this).text()).split("--")[0] == txt) {
                    $(this).prop("selected", true);
                }
            });
        },
        error: function (err) {
            console.log("readDataSel ERROR : " + err);
        }
    });
}

function showProduct(show = true) {
    
    $.ajax({
        url: urlProduct,
        type: 'GET',
        crossDomain: true,
        data: { opt_k: 'readAll'},
        success: function (result) {
            dataAllShow = result;
            sortByCol(dataAllShow, 15, 1); //==== เรียงข้อมูลตาม rate col=15, เรียงจากมากไปน้อย=1(0,1)
            let products = document.getElementById("products");
            
            let tt = '';
            for(let i = 0; i < dataAllShow.length; i++){
                if (dataAllShow[i][14] === "TRUE") {
                    let id = dataAllShow[i][0]
                    let title = dataAllShow[i][1]
                    let cost = numWithCommas(+dataAllShow[i][13])
                    let qty = (+dataAllShow[i][11] > 0)?"จำนวนคงเหลือ "+dataAllShow[i][11]:"*** สินค้าหมด ***"
                    let qty_col = (+dataAllShow[i][11] > 0)?"color:#004030":"color:#ee2222"
                    let overview = dataAllShow[i][4]
                    let oldPrice = numWithCommas(dataAllShow[i][16])
                    let pic = ''
                    if (dataAllShow[i][5] !== ''){
                        pic = dataAllShow[i][5]
                    }else if(dataAllShow[i][6] !== ''){
                        pic = dataAllShow[i][6]
                    }else if(dataAllShow[i][7] !== ''){
                        pic = dataAllShow[i][7]
                    }else if(dataAllShow[i][8] !== ''){
                        pic = dataAllShow[i][8]
                    }else if(dataAllShow[i][9] !== ''){
                        pic = dataAllShow[i][9]
                    }else if(dataAllShow[i][10] !== ''){
                        pic = dataAllShow[i][10]
                    }else {
                        pic = ''
                    }
                    
                    tt = tt +`
                <div class="myProd">
                    <div class="borderPic" onclick="showProductPreview(${id})">
                        <img src="${linkPic(pic,pic_no)}" alt="product" class="img-fluid">
                    </div>
                    <div class="title">${title}</div>
                    <div class="myProd-info">                 
                        <div class="myProd-price">
                            <strong> ราคา <del> ${oldPrice} </del>&nbsp;&nbsp;<span>${cost}</span> บาท </strong>
                        </div>   
                        <strong style="${qty_col}">${qty}</strong>
                    </div>
                    <div class="myProd-overview">${overview}</div>
                    <input type="hidden" id="id_pic1_${id}" value="${dataAllShow[i][5]}" />
                    <input type="hidden" id="id_pic2_${id}" value="${dataAllShow[i][6]}" />
                    <input type="hidden" id="id_pic3_${id}" value="${dataAllShow[i][7]}" />
                    <input type="hidden" id="id_pic4_${id}" value="${dataAllShow[i][8]}" />
                    <input type="hidden" id="id_pic5_${id}" value="${dataAllShow[i][9]}" />
                    <input type="hidden" id="id_pic6_${id}" value="${dataAllShow[i][10]}" />
                </div>
                        `;         
                }
            }
            $("#products").html(tt);   
        },
        error: function (err) {
            console.log("The server  ERROR says: " + err);
        }
    });
  }

  const showProductPreview = (id) =>{
    let textContent_body ='';
    let textContent_btt ='';
    let textContent = '';
    for(let i=1;i<=6;i++){
      let pic =   document.getElementById("id_pic"+i+"_"+id)
        if( pic.value !== ''){
            let act = (i===1)?'active':'';
            let act_butt = (i===1)?' class="active" aria-current="true" ':'';
            textContent_btt = textContent_btt + `
            <button type="button" data-bs-target="#carouselProdShow" data-bs-slide-to="${i-1}" ${act_butt} aria-label="Slide ${i}"></button>
            `;

            textContent = textContent+`
            <div class="carousel-item ${act}">
                <img src="${linkPic(pic.value,pic_no)}" class="d-block w-100" alt="product picture" >
            </div>
            `;
        }
    }

    textContent_body =`
    <div id="carouselProdShow" class="carousel slide animate__animated animate__fadeIn" data-bs-ride="carousel" data-bs-interval="false">
        <button type="button" id="closePicPreview" >&times;</button>
        <div class="carousel-indicators " >
            ${textContent_btt}
        </div>
        <div class="carousel-inner">
            ${textContent}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselProdShow" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselProdShow" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
    `;
    $("#previewPic").html(textContent_body);  
  }

$(document).on("click", "#closePicPreview, #sidebarMenu", function () {
    $("#previewPic").html(''); 
});

