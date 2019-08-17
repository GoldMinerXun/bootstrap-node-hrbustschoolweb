var index = 0
var ifgo = true

$('#gopre').on('click', function () {
    $('.picture').eq(index).toggleClass('active')
    index -= 1
    if (index == -1) {
        index = 4
    }
    $('.picture').eq(index).toggleClass('active')
    ifgo = false
})

$('#gonext').on('click', function () {
    $('.picture').eq(index).toggleClass('active')
    index += 1
    if (index == 5) {
        index = 0
    }
    $('.picture').eq(index).toggleClass('active')
    ifgo = false
})

var gonext = function () {
    $('.picture').eq(index).toggleClass('active')
    index += 1
    if (index == 5) {
        index = 0
    }
    $('.picture').eq(index).toggleClass('active')
}

setInterval(function () {
    if (ifgo) {
        gonext()
    }
}, 5000)

var deal = document.getElementById('deal')
var deal2 = document.getElementById('deal2')

var handle = function () {
    var deal = document.getElementById('deal')
    var deal2 = document.getElementById('deal2')
    var judge = document.getElementById('judge')
    if (judge.getAttribute('data-value') == '') {
        deal.innerText = '登陆'
        deal2.innerText = '注册'
    } else {
        deal.innerText = `欢迎用户${judge.getAttribute('data-value')}`
        deal.removeAttribute('href')
        deal2.innerText = '注销'
        deal2.addEventListener('click', function () {
            function getCookie(name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            }
            function delCookie(name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval = getCookie(name);
                if (cval != null)
                    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
            }
            delCookie('id')
        })
        deal2.href = '/'
    }
}
handle()

