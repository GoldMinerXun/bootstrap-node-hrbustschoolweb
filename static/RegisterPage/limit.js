var numinput = document.getElementById('numinput')
var classinput = document.getElementById('classinput')
var pasinput = document.getElementById('passwordinput')

var state = {
    num: '',
    class: '',
    password: ''
}

var setState = function (newstate) {
    state = {
        ...state,
        ...newstate
    }
}

var handlenum = function (e) {
    console.log(typeof(e))
    if (e.length > 10) {
        $('#numinput').val(state.num)
        return
    }
    else {
        setState(
            {
                num: e
            }
        )
        $('#numinput').val(state.num)
    }
}

var handlepas = function (e) {
    if (e.length>16) {
        $('#passwordinput').val(state.password)
        return
    }
    else {
        setState(
            {
                password: e
            }
        )
        $('#passwordinput').val(state.password)
    }
}

$("#numinput").bind("input propertychang", function (event) {
    handlenum(this.value)
});

$("#passwordinput").bind("input propertychang", function (event) {
    handlepas(this.value)
});