var email = document.querySelector("[type='email']");
var alertInvalidEmail = document.querySelector(".invalid-email");
var alertEmailAlreadyExist = document.querySelector(".email-already-exist");
var password = document.querySelector(".password");
var submit = document.querySelector("[type='submit']");
var confirmPassword = document.querySelector(".comfirm-password");
// 3个flag决定submit button 是否可以高亮
var emailFlag = false;
var passwordFlag = false;
var checkPasswordFlag = false;

function enableButton() {
console.log(emailFlag,passwordFlag,checkPasswordFlag)
  if (emailFlag && passwordFlag && checkPasswordFlag) {
    submit.style.background = "#4D35E6";
    submit.style.cursor = "pointer";
  }
}

email.addEventListener("input", function () {
  var email = this.value;
  var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  if (reg.test(email)) {
    alertInvalidEmail.style.display = "none";
    emailFlag = true;
    
  } else {
    alertEmailAlreadyExist.style.display = "none";
    alertInvalidEmail.style.display = "block";
  }
});

email.addEventListener("blur", function () {
  var email_address = email.value;
  // 退出邮箱输入时，根据输入的内容决定是否要增加提示
  if (this.value == "") {
    this.value = "email@website.com";
    alertInvalidEmail.style.display = "none";
    enableButton();
  } 
  // 邮箱格式正确时，判断邮箱是否存在
  if (alertInvalidEmail.style.display == "none") {
    checkIfEmailExist(email_address);
    enableButton();
    
  }
});

//password function
password.addEventListener("focus", function () {
  if (
    (this.value != "") &
    (this.value == "至少八个字符，至少一个字母和一个数字")
  ) {
    this.type = "password";
    this.value = "";
  } else if (
    (this.value != "") &
    (this.value != "至少八个字符，至少一个字母和一个数字")
  ) {
    this.type = "password";
  }
});
password.addEventListener("blur", function () {
  if (this.value == "") {
    this.type = "text";
    this.value = "至少八个字符，至少一个字母和一个数字";
  }
});

//comfirmPassword function
confirmPassword.addEventListener("focus", function () {
  if (
    (this.value != "") &
    (this.value == "至少八个字符，至少一个字母和一个数字")
  ) {
    this.type = "password";
    this.value = "";
  } else if (
    (this.value != "") &
    (this.value != "至少八个字符，至少一个字母和一个数字")
  ) {
    this.type = "password";
  }
});
confirmPassword.addEventListener("blur", function () {
  if (this.value == "") {
    this.type = "text";
    this.value = "至少八个字符，至少一个字母和一个数字";
  } else {
    this.value = this.value;
  }
});

//
function checkPasswordFormat(password) {
  var reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$/;
  var alertWrongPassword = document.querySelector(".wrong-format-password");
  if (reg.test(password)) {
    console.log(reg.test(password));
    alertWrongPassword.style.display = "none";
    passwordFlag = true;
    enableButton()
  } else {
    console.log(reg.test(password));
    alertWrongPassword.style.display = "block";
  }
}

//如果不符合password的标准，
password.addEventListener("blur", function () {
  checkPasswordFormat(this.value);
});

confirmPassword.addEventListener("input", function () {
  var differentPassword = document.querySelector(".different-password");
  if (this.value != password.value) {
    differentPassword.style.display = "block";
  } else {
    differentPassword.style.display = "none";
    checkPasswordFlag = true;
    enableButton();
  }
});

submit.addEventListener("submit", function () {
    var hashObj = new jsSHA("SHA-512", "TEXT", { numRounds: 1 });
    hashObj.update(password.value);
    var hashPassword = hashObj.getHash("HEX");
    var xhr = new XMLHttpRequest();
    xhr.open("post","http://127.0.0.1:5050/api/user/register?email="+email.value+"&password="+hashPassword)
    xhr.send()
    xhr.onreadystatechange = function () {
        var code = JSON.parse(xhr.responseText).code;
        console.log(code);
        if (code == 201) {
          //创建成功
          location.href = "login.html";
        } else {
            alert("由于未知原因注册失败，请稍后再试")
        }
    }})