
/*
let menuList = document.querySelector('#listMenu');
let li = document.createElement('li');
let a = document.createElement('a');

li.classList.add("nav-item");

a.textContent = "Setting";
a.classList.add("nav-link");
a.setAttribute('href','#');
a.setAttribute('onclick','showLogin();');
a.classList.add("click-scroll");
li.appendChild(a);
menuList.appendChild(li);
*/
goBack();
waiting(false);

function showLogin(){
    document.getElementById("content").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("login_form").reset();
    document.getElementById("setting").style.display = "none";
    document.getElementById("main_setting").style.display = "none";
}

function goBack(){
    document.getElementById("content").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("setting").style.display = "none";
    document.getElementById("main_setting").style.display = "none";    
    showCommNew();
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

function pagination_show(page, pageall, per, fn) { //============== แสดงตัวจัดการหน้าข้อมูล Pagination      
    let max_p = parseInt(pageall);
    let p = parseInt(page);
    let p_prev = (p > 1) ? p - 1 : 1;
    let p_next = (p < max_p) ? p + 1 : max_p;
    let pag_h = `<div class="pagination justify-content-center">`;
    let pag_prev = `<a href="#" id="pag_prev" title="Previous" onclick=` + fn + `(` + per + `,` + p_prev + `)>&#11164;</a>`; //&laquo;
    let pag_next = `<a href="#" id="pag_next" title="Next" onclick=` + fn + `(` + per + `,` + p_next + `)>&#11166;</a></div>`;           //&raquo;  
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
                pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + j + `)>` + j + `</a> `;
            } else {
                pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + j + `)>` + j + `</a> `;
            }
        }
    } else {
        if (p < 5) {  //เลือกหน้าที่น้อยกว่าหน้าที่ 5
            for (var k = 1; k <= p + 2; k++) {
                if (p == 1) { pag_prev = ''; }
                if (p == k) {
                    pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + k + `)>` + k + `</a> `;
                } else {
                    pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + k + `)>` + k + `</a> `;
                }
            }
            h2 = Math.ceil((4 + max_p - 1) / 2);
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h2 + `)>...</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + (max_p - 1) + `)>` + (max_p - 1) + `</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + (max_p) + `)>` + (max_p) + `</a> `;

        } else if (p > (max_p - 4)) { //เลือกหน้าที่ก่อนถึงหน้าสุดท้าย อยู่ 4 หน้า
            h1 = Math.ceil((2 + max_p - 3) / 2);
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,'1')>1</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,'2')>2</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h1 + `)>...</a> `;
            for (var m = (p - 2); m <= max_p; m++) {
                if (p == max_p) { pag_next = `</div>`; }
                if (p == m) {
                    pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + m + `)>` + m + `</a> `;
                } else {
                    pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + m + `)>` + m + `</a> `;
                }
            }

        } else { //เลือกหน้าที่อยู่ระหว่างหน้าที่ 5 และก่อนถึงหน้าสุดท้ายอยู่ 4 หน้า
            h1 = Math.ceil((p - 2) / 2);
            h2 = Math.ceil((p + 2 + max_p) / 2);
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,'1')>1</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h1 + `)>...</a> `;

            for (var k = (p - 2); k <= p + 2; k++) {
                if (p == k) {
                    pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + k + `)>` + k + `</a> `;
                } else {
                    pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + k + `)>` + k + `</a> `;
                }

            }
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h2 + `)>...</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + (max_p) + `)>` + (max_p) + `</a> `;
        }
    }

    $("#pagination").html(pag_h + pag_prev + pag_in + pag_next);
}

$(document).on("click", "#bt_back", function () {
    show_home();
});


function waiting(order = true) {
    if (order) {
        $(".myWaiting").show();
    } else {
        $(".myWaiting").hide();
    }
}

function linkPic(id,pic){
    var lk = '';
    if(id == '' || id == null || id == undefined || id == 'undefined'){
        lk = pic;
    }else{
        //lk = 'https://drive.google.com/uc?id=' + id;
        //lk = 'https://drive.google.com/uc?export=download&id=' + id; //for download
        lk = 'https://drive.google.com/uc?export=view&id=' + id;
    }
    return lk
}

function showCommNew() { //======================== แสดงจำนวนข้อความใหม่
    document.getElementById("cmNew").style.display = "none";
    $.ajax({
        url: urlComm,
        type: 'GET',
        crossDomain: true,
        data: { opt_k: 'new' },
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
        },
        error: function (err) {
            console.log("The server  ERROR says: " + err);
        }
    });
}


function initDropdownList(url,id, data, idSel, nameSel) { 
    $.ajax({ // (urlAppscript, idSelect , lenghtData, idcol, namecol) initDropdownList(urlUser,'selPos','dataset!A2:B',0,1);
        url: url,
        type: 'GET',
        crossDomain: true,
        data: { opt_k: 'readDataSel', opt_dataSel:data, opt_selId:idSel, opt_selNm:nameSel },
        success: function (result) {
            const myArr = JSON.parse(JSON.stringify(result));
            var option;
            select = document.getElementById(id);
            /*while (select.options.length > 0) {
                select.remove(0);
            }*/
            for (let i = 0; i <= myArr.length - 1; i++) {
                option = document.createElement('option');
                option.value = myArr[i].id;
                option.text = myArr[i].name;
                select.add(option);
            }
        },
        error: function (err) {
            console.log("readDataSel ERROR : " + err);
        }
    });

}

function setDropdownList(url, id, data, txt, idCol, nameCol) { 
    $.ajax({ //setDropdownList(urlUser,'selBranch','branch!A2:B',document.getElementById('branch'+id).innerHTML,0,1);
        url: url,
        type: 'GET',
        crossDomain: true,
        data: { opt_k: 'readDataSel', opt_dataSel:data, opt_selId:idCol, opt_selNm:nameCol },
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
                option.text = myArr[i].name;
                select.add(option);
            }
            $('#' + id + ' option').each(function () {
                if ($(this).text() == txt) {
                    $(this).prop("selected", true);
                }
            });
        },
        error: function (err) {
            console.log("readDataSel ERROR : " + err);
        }
    });
}