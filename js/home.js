var newsPageNo = 1;
var newsPageLimit = 6;
var messagePageNo = 1;
var messagePageLimit = 8;
var maxNewsPageNo;
var maxMessagePageNo;
var token = sessionStorage.getItem("token");
var previousButton = document.querySelector(".previous");
var nextButton = document.querySelector(".next");
var changeMessageButton = document.querySelector(".change-message");
var keywordList = ["bitcoin"];

//获取最大页数
function getMaxPageNo(newsType) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    "http://127.0.0.1:5050/api/user/subscription/news/number?type=" + newsType
  );
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      if (newsType == "news") {
        maxNewsPageNo = Math.ceil(
          JSON.parse(xhr.responseText).data / newsPageLimit
        );
      }
    } else if (newsType == "message") {
      maxMessagePageNo = JSON.parse(xhr.responseText).data % newsPageLimit;
    }
  };
}

// 判断Token是否存在或者有效
function judgeToken() {
  if (token == null) {
    window.location.href = "http://127.0.0.1"
  }
}

// 展示某一页的新闻
function showNewsOfPage(pageNo) {
  var newsBody = document.querySelector(".main-body");
  newsBody.visibility = "hidden";
  var xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    "http://127.0.0.1:5050/api/user/subscription/news?page=" +
      pageNo +
      "&limit=" +
      newsPageLimit +
      "&type=news"
  );
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var news = JSON.parse(xhr.responseText).data;
      if (news.length == 0) {
        var mainBody = document.querySelector(".main-body");
        var noSubAlert = document.querySelector(".no-subscription");
        noSubAlert.style.display = "block";
        mainBody.style.display = "none";
      } else {
        for (var i = 0; i < news.length; i++) {
          newsNumber = i + 1;
          commonSelector =
            ".main-body .news-detail li:nth-of-type(" + newsNumber + ") ";
          document.querySelector(commonSelector + ".news-title").innerHTML =
            news[i].title;
          document.querySelector(
            commonSelector + ".news-description"
          ).innerHTML = news[i].description;

          document.querySelector(
            commonSelector + ".news-publish-date"
          ).innerHTML = news[i].publish_time;

          document.querySelector(commonSelector + "#news-url").href =
            news[i].url;
          document.querySelector(commonSelector + ".news-source").innerHTML =
            "来源 : " + news[i].source;
          var keywordSection = document.querySelector(
            commonSelector + " .keywords"
          );
          //清除之前添加的标签
          var keywordUl = document.querySelector(commonSelector + ".keywords");
          var child = keywordUl.lastElementChild;
          while (child) {
            keywordUl.removeChild(child);
            child = keywordUl.lastElementChild;
          }
          for (var k = 0; k < news[i].keyword.length; k++) {
            keywordToAdd = news[i].keyword[k];
            // console.log(keywordToAdd)
            console.log(keywordSection);
            let newLi = document.createElement("li");
            let newKeyword = document.createTextNode(keywordToAdd);
            newLi.appendChild(newKeyword);
            console.log(newLi);
            keywordSection.appendChild(newLi);
          }
        }
      }
    }
  };
  newsBody.style.visibility = "visible";
}

// 展示某一页的messages
function showMessagesOfPage(page) {
  var newsBody = document.querySelector(".main-body");
  for (var i = 0; i < 8; i++) {
    messageNumber = i + 1;
    var commonSelector =
      "#message-detail li:nth-of-type(" + messageNumber + ") ";
    document.querySelector(commonSelector + ".message-publish-time").innerHTML =
      "";
    document.querySelector(commonSelector + ".message-info").innerHTML = "";
    document.querySelector(commonSelector + ".message-url").href = "";
  }
  var xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    "http://127.0.0.1:5050/api/user/subscription/news?page=" +
      messagePageNo +
      "&limit=" +
      messagePageLimit +
      "&type=message"
  );
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var message = JSON.parse(xhr.responseText).data;
      console.log(message);
      for (var i = 0; i < message.length; i++) {
        messageNumber = i + 1;
        var commonSelector =
          "#message-detail li:nth-of-type(" + messageNumber + ") ";
        document.querySelector(
          commonSelector + ".message-publish-time"
        ).innerHTML = message[i].publish_time;
        document.querySelector(commonSelector + ".message-info").innerHTML =
          message[i].title;
        document.querySelector(commonSelector + ".message-url").href =
          message[i].url;
      }
    }
  };
}

// 翻页页数变化
nextButton.addEventListener("click", function () {
  if (newsPageNo != maxNewsPageNo) {
    //TODO 获取maxPage
    newsPageNo += 1;
    var pageInfo = document.querySelector(".page-number");
    pageInfo.innerHTML = "第" + newsPageNo + "页";
    showNewsOfPage(newsPageNo);
    previousButton.style.backgroundColor = "#744cfe";
    previousButton.style.cursor = "pointer";
  }
  // 请求下一页的新闻
  if (newsPageNo == maxNewsPageNo) {
    this.style.backgroundColor = "#CECAED";
    this.style.cursor = "default";
  }
  document.body.scrollTop = document.documentElement.scrollTop = 0;
});

previousButton.addEventListener("click", function () {
  if (newsPageNo != 1) {
    newsPageNo -= 1;
    var pageInfo = document.querySelector(".page-number");
    pageInfo.innerHTML = "第" + newsPageNo + "页";
    showNewsOfPage(newsPageNo);
    nextButton.style.backgroundColor = "#744cfe";
    nextButton.style.cursor = "pointer";
  }
  if (newsPageNo == 1) {
    this.style.backgroundColor = "#CECAED";
    this.style.cursor = "default";
  }
  document.body.scrollTop = document.documentElement.scrollTop = 0;
});

changeMessageButton.addEventListener("click", function () {
  if (messagePageNo != maxMessagePageNo) {
    messagePageNo += 1;
    showMessagesOfPage(messagePageNo);
  } else {
    messagePageNo = 1;
    showMessagesOfPage(messagePageNo);
  }
  document.body.scrollTop = document.documentElement.scrollTop = 0;
});

// 初始化
getMaxPageNo("news");
getMaxPageNo("message");
showNewsOfPage(1);
showMessagesOfPage(1);
