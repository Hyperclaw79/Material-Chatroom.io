import $ from "jquery";

export default function handler(){
    return(
        $(function() {
            
            var formContainer = $("#form-container");

            bindFormClick();
            //Opening the form
            function bindFormClick() {
            $(formContainer).on("click", function(e) {
                e.preventDefault();
                toggleForm();
                //Ensure container doesn't togleForm when open
                $(this).off();
            });
            }

            //Closing the form
            $("#form-close, .form-overlay").click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleForm();
            bindFormClick();
            });

            function toggleForm() {
            $(formContainer).toggleClass("expand");
            $(formContainer)
                .children()
                .toggleClass("expand");
            $("body").toggleClass("show-form-overlay");
            $(".form-submitted").removeClass("form-submitted");
            }

            //Form validation
            $("form").submit(function() {
            var form = $(this);
            form.find(".form-error").removeClass("form-error");
            var formError = false;

            form.find(".input").each(function() {
                if ($(this).val() === "") {
                $(this).addClass("form-error");
                $(this).select();
                formError = true;
                return false;
                } 
            });

            if (!formError) {
                $("body").addClass("form-submitted");
                $("#form-head").addClass("form-submitted");
            }
            return false;
            });
        })
    );    
}