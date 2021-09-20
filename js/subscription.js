var keyword = document.querySelectorAll(".keywords li:not(:last-child)");



keyword.forEach((item) => {
  item.addEventListener("mouseover", function() {
    item.lastElementChild.style.visibility = "visible";
  });
});
keyword.forEach((item) => {
  item.addEventListener("mouseout",function(){
    item.lastElementChild.style.visibility = "hidden";
  });
});
