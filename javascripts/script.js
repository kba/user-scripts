$(function() {
    var tpl = $("#file-template").text().replace('\n', '');
    $("#submit-file").on('click', function() {
        console.log(
            tpl.replace('__FILE_PATH__', $("#input-file-path").val())
        );
        $("textarea").val(
            tpl.replace('__FILE_PATH__', $("#input-file-path").val())
        );
    });
});
