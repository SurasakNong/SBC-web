function show_home() { //========================== แสดงหน้าหลัก  
    var html = `
    <div class="container animate__animated animate__fadeInDown">
        <div class="row mt-4 animate__animated animate__bounceInRight animate__delay-1s"> 
            <h3>SBC Sytem</h3>
        </div>
      <div class="row gy-5 mt-1">  

        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="ele-fn ms-auto me-auto">
                <div class"col">
                    <i class="fa-solid fa-cart-arrow-down"></i>
                </div>                
                <div class="w-100"></div>
                <div class"col">
                    <a>งานขาย</a>
                </div>        
            </div>
        </div>

        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="ele-fn ms-auto me-auto">
                <div class"col">
                    <i class="fa-solid fa-cubes"></i>
                </div>                
                <div class="w-100"></div>
                <div class"col">
                    <a>รับเข้าสต็อก</a>
                </div>        
            </div>
        </div>

        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="ele-fn ms-auto me-auto">
                <div class"col">
                    <i class="fa-solid fa-receipt"></i>                    
                </div>                
                <div class="w-100"></div>
                <div class"col">
                    <a>สรุปสต็อกสินค้า</a>
                </div>        
            </div>
        </div>

        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="ele-fn ms-auto me-auto">
                <div class"col">
                    <i class="fa-solid fa-box-open"></i>
                </div>                
                <div class="w-100"></div>
                <div class"col">
                    <a>ตรวจนับสต็อก</a>
                </div>        
            </div>
        </div>
        
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="ele-fn ms-auto me-auto">
                <div class"col">
                    <i class="fa-solid fa-store"></i>
                </div>                
                <div class="w-100"></div>
                <div class"col">
                    <a>แสดงสินค้า</a>
                </div>        
            </div>
        </div>

        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="ele-fn ms-auto me-auto">
                <div class"col">
                    <i class="fa-regular fa-comment-dots"></i>
                </div>                
                <div class="w-100"></div>
                <div class"col">
                    <a>ความคิดเห็น</a>
                </div>        
            </div>
        </div>

        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="ele-fn ms-auto me-auto">
                <div class"col">
                    <i class="fa-solid fa-clipboard-list"></i>
                </div>                
                <div class="w-100"></div>
                <div class"col">
                    <a>รายการสินค้า</a>
                </div>        
            </div>
        </div>

      </div>
    </div>
      `;
    $("#main_setting").html(html);
    document.getElementById("pic_user").src = user.pic;
    document.getElementById('pic_user').setAttribute('title', user.name + ' (' + user.uname + ')');
        
}

$(document).on('click', ".ele-fn", function () {  //ค้นหารายการ
    new Promise((resolve, reject) => {
        const animationName = `animate__bounceIn`; // `animate__bounceOut`;
        this.classList.add(`animate__animated`, animationName);
        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            this.classList.remove(`animate__animated`, animationName);
            resolve('Animation ended');
            var dom = this.childNodes[5].innerHTML.split('<a>')[1].split('</a>')[0];
            selM(dom);
        }
        this.addEventListener('animationend', handleAnimationEnd, { once: true });
    });

    function selM(selMenu){
    //var selMenu = this.childNodes[5].innerHTML.split('<a>')[1].split('</a>')[0];
    //console.log(selMenu);
    if(selMenu === 'รับเข้าสต็อก'){
        openStock();
    }else if(selMenu === 'รายการสินค้า'){
        openProduct();
    }else if(selMenu === 'ความคิดเห็น'){
        openComment();
    }else if(selMenu === 'รายการสินค้า'){
        openProduct();
    }else if(selMenu === 'รายการสินค้า'){
        openProduct();
    }else{
        openStock();
    }
}

    
});