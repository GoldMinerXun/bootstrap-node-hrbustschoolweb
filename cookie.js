class cookieControl{
      constructor(){
          this.tokenArr = [];
      }
      getToken(){
          var token = "";
          var str = '635465678sadfasd8f7a86swert*^&^%&$^$$%^*((*&('
          //位数
          for(var i = 0 ; i < 20 ; i++){
              if( i % 5 == 0 && i!= 0){
                  token += '-'
              }
              else{
                token += str[parseInt(Math.random() * str.length)]
              }
          }
          this.tokenArr.push(token)
          return token
      }
      checkToken(token){
        //   console.log(tokenArr)
          for(var i = 0 ; i < this.tokenArr.length ; i++){
              if(this.tokenArr[i] == token){
                  return true;
              }
              else{
                  return false;
              }
          }
      }
      removeToken(){
        for(var i = 0 ; i < this.tokenArr.length ; i++){
            if(this.tokenArr[i] == token){
                this.tokenArr.splice(i,1);
                return true
            }
            else{
                return false;
            }
        }
      }
}

// module.exports = cookieControl
exports.cookieControl=cookieControl