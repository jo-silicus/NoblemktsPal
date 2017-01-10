
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function () {
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
    }
}
function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = ($('#sticky-anchor').offset() || { "top": NaN }).top;
    if (window_top > div_top) {
        $('#sticky').addClass('stick');

    } else {
        $('#sticky').removeClass('stick');
    }
}
$(function () {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
});