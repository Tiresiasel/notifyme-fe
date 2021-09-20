var email = document.querySelector("[type='email']");
var alertInvalidEmail = document.querySelector(".invalid-email");
var alertEmailNotExist = document.querySelector(".email-not-exist");
var password = document.querySelector(".password");
var submit = document.querySelector(".submit");
var confirmPassword = document.querySelector("comfirm-password")

// const axiosInstance = axios.create({
//     baseURL: "http://127.0.0.1:5050",
//     // timeout: 1000,
//     headers: { "Access-Control-Allow-Origin": "*" },
//   });

// 点击邮箱提示消失
email.addEventListener("focus", function () {
    if (this.value == "email@website.com") {
      this.value = "";
    } else {
      this.value = this.value;
    }
  });

