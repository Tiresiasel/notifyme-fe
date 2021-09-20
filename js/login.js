var email = document.querySelector("[type='email']");
var alertInvalidEmail = document.querySelector(".invalid-email");
var alertEmailNotExist = document.querySelector(".email-not-exist");
var password = document.querySelector(".password");
var submit = document.querySelector(".submit");

// const axiosInstance = axios.create({
//   baseURL: "http://127.0.0.1:5050",
//   // timeout: 1000,
//   headers: { "Access-Control-Allow-Origin": "*" },
// });

function checkIfEmailExist(email) {
  var xhr = new XMLHttpRequest();
  xhr.open("get", "http://127.0.0.1:5050/api/user/email?email=" + email, true);
  xhr.send();
  xhr.onreadystatechange = function () {
    var status = JSON.parse(xhr.responseText).data["email_exist"];
    if (status == true) {
      console.log("邮箱存在");
      alertEmailNotExist.style.display = "none";
    } else {
      console.log("邮箱不存在");
      alertEmailNotExist.style.display = "block";
    }
  };
  // return xhr.onreadystatechange;
}
// 点击邮箱提示消失
email.addEventListener("focus", function () {
  if (this.value == "email@website.com") {
    this.value = "";
  } else {
    this.value = this.value;
  }
});

email.addEventListener("blur", function () {
  var email_address = email.value;
  // 退出邮箱输入时，根据输入的内容决定是否要增加提示
  if (this.value == "") {
    this.value = "email@website.com";
    alertInvalidEmail.style.display = "none";
  } else {
    this.value = this.value;
  }
  // 邮箱格式正确时，判断邮箱是否存在
  if (alertInvalidEmail.style.display == "none") {
    checkIfEmailExist(email_address);
  }
});
// 根据正则判断是否是规范的邮箱
email.addEventListener("input", function () {
  var email = this.value;
  var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  if (reg.test(email)) {
    alertInvalidEmail.style.display = "none";
  } else {
    alertEmailNotExist.style.display = "none";
    alertInvalidEmail.style.display = "block";
  }
});

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
  console.log("blur")
  if (this.value == "") {
    this.type = "text";
    this.value = "至少8位字符，必须包含1位大写字母";
  }
});

// 提交密码跳转
submit.addEventListener("click", function () {
  var hashObj = new jsSHA("SHA-512", "TEXT", { numRounds: 1 });
  hashObj.update(password.value);
  var hashPassword = hashObj.getHash("HEX");
  console.log(
    "http://127.0.0.1:5050/api/user/login?email=" +
      email.value +
      "&password=" +
      hashPassword
  );
  var xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    "http://127.0.0.1:5050/api/user/login?email=" +
      email.value +
      "&password=" +
      hashPassword
  );
  xhr.send();
  xhr.onreadystatechange = function () {
    var res = JSON.parse(xhr.responseText)
    var code = res.code;
    var token = res.data.token;
    console.log(code);
    if (code == 200) {
      //登录成功
      location.href = "home.html";
      sessionStorage.setItem("token",token)
    } else {
      var wrongPassword = document.querySelector(".wrong-password");
      wrongPassword.style.display = "block";
    }
  };
});

// 只要输入的邮箱存在问题，则登录按钮不可点击
email.addEventListener("submit", function () {
  //FIXME “判断邮箱是否存在”有延迟
  if (
    alertEmailNotExist.style.display == "block" ||
    alertInvalidEmail.style.display == "block" ||
    password.type == "text"
  ) {
    submit.style.background = "#CECAED";
    submit.style.cursor = "default";
  } else {
    submit.style.background = "#4D35E6";
    submit.style.cursor = "pointer";
  }
});
