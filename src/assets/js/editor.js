const paraEditor = () => {
    $(function() {
        $(".select2").select2();
        jQuery(".mydatepicker").datepicker();
        jQuery(".datepicker-autoclose").datepicker({
            autoclose: true,
            todayHighlight: true,
        });
    });
}