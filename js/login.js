var email = document.querySelector("[type='email']");
email.addEventListener("focus", function () {
  email.value = "";
});
email.addEventListener("blur", function () {
  if (email.value == "") {
    email.value = "mail@website.com";
  } else {
    email.value = email.value
    }
});
