$(document).ready(function() {
    var getSkillElement = function(obj) {
        skill = $(obj).data('skillname');
        return $('#skill-' + skill);
    };
    imgs = $('.skill-line img');
    imgs.mouseover(function() {
        getSkillElement(this).addClass('active-skill');
    });
    imgs.mouseout(function() {
        getSkillElement(this).removeClass('active-skill');
    });
});
