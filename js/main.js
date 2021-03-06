/*
 * jQuery File Upload Plugin JS Example
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
/* global $, window */
$(function() {
    var images = new Array();
    var results = new Array();
    var allsent = 0;
    var button_state = "submit";
    //read the image choosen and send the request to Microsoft
    function readImage(dest) {
        if (this.files && this.files[0]) {
            i = 0;
            if (dest.data == "#img_right") {
                i = 1;
            }
            images[i] = this.files[0];
            var that = this;
            var FR = new FileReader();
            FR.onload = function(e) {
                $(dest.data).attr("src", e.target.result);
                if (images[0] && images[1] && button_state != "clear")
                    button_state = "submit";
                changeButtonState(button_state);
            };
            FR.readAsDataURL(this.files[0]);

        } else {
            $("#results").hide();
            $("#stats").hide();
        }
    }

    //use this function in done event with the input data with no change
    function parseJSON(imgData) {

        var dataLength = imgData.length;
        if (dataLength && imgData[0] && imgData[0]["scores"]) {
            var happiness = 0;
            var anger = 0;
            var fear = 0;
            var surprise = 0;
            for (var i = 0; i < dataLength; i++) {
                happiness += imgData[i]["scores"]["happiness"];
                anger += imgData[i]["scores"]["anger"];
                fear += imgData[i]["scores"]["fear"];
                surprise += imgData[i]["scores"]["surprise"];

            }
            //the return data are happiness , anger , fear and surprise respectively
            //use it in filling the bars under the images
            params_arr = [parseInt((happiness / dataLength) * 100), parseInt((anger / dataLength) * 100), parseInt((fear / dataLength) * 100), parseInt((surprise / dataLength) * 100)];

            return params_arr;
        } else error();

    }

    function loading(e) {
        if (e) {
            if ($("#submit-btn-blue").hasClass("cancel-btn"))
                $("#submit-btn-blue").removeClass("cancel-btn");
            if ($("#submit-btn-blue").hasClass("submit-btn-black"))
                $("#submit-btn-blue").removeClass("submit-btn-black");
            $("#submit-btn-blue").addClass("submit-btn-blue");
            $("#submit-btn-blue").html('FIGHTING <i class="fa fa-cog fa-spin"></i> ');
            $("#vs-div").html('<img id="loading-gif" src="img/loading.gif"/>');
        } else {
            //remove loading gif
            $("#vs-div").html('<h3 id="vs" >Vs</h3>');
            $("#submit-btn-blue").html(' SUBMIT <i class="fa fa-check">');
        }
    }

    function error(e) {
        console.log(e);

        button_state = "error";
        changeButtonState(button_state);
    }

    function submit() {
        if (images[0] && images[1]) {
            //loading icon
            loading(true);
	    allsent =0;
            $.each(images, function(i) {
                $.ajax({
                        url: "https://api.projectoxford.ai/emotion/v1.0/recognize",
                        contentType: "application/octet-stream",

                        beforeSend: function(xhrObj) {
                            // Request headers

                            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "281f479605604d969c9e4c01c9447e31");
                        },
                        type: "POST",
                        processData: false,
                        // Request body
                        data: this
                    })
                    .done(function(data) {
                        //the success Function
                        //		 	 $('#base').text(JSON.stringify(data, null, '\t'));
                        //after calling parseJSON(data) use these lines
                        params_result = parseJSON(data)

                        if (params_result) {
                            //set the values of the service reply to UI
                            results[i] = params_result;
                            $("#img_" + (i + 1) + "_happiness").css('width', params_result[0] + '%');
                            $("#span_" + (i + 1) + "_happiness").html(params_result[0] + '% Happy');
                            $("#happiness-" + (i + 1)).html(params_result[0]);
                            $("#img_" + (i + 1) + "_anger").css('width', params_result[1] + '%');
                            $("#span_" + (i + 1) + "_anger").html(params_result[1] + '% Angry');
                            $("#anger-" + (i + 1)).html(params_result[1]);
                            $("#img_" + (i + 1) + "_fear").css('width', params_result[2] + '%');
                            $("#span_" + (i + 1) + "_fear").html(params_result[2] + '% Afraid');
                            $("#fear-" + (i + 1)).html(params_result[2]);
                            $("#img_" + (i + 1) + "_surprise").css('width', params_result[3] + '%');
                            $("#span_" + (i + 1) + "_surprise").html(params_result[3] + '% Surprised');
                            $("#surprise-" + (i + 1)).html(params_result[3]);
                            $("#img_" + (i + 1) + "_overall").html(params_result[0] + params_result[1] + params_result[2] + params_result[3]);
                            allsent += 1;
                            if (results[0] && results[1] && allsent == 2) {
                                //here the two responses have come so show result
                                sum0 = 0;
                                sum1 = 0;
                                //calculate total for red
                                $.each(results[0], function() {
                                    sum0 += parseFloat(this) || 0;
                                });
                                //calculate total for green
                                $.each(results[1], function() {
                                    sum1 += parseFloat(this) || 0;
                                });

                                //change submit button to clear                               
                                button_state = "clear";
                                changeButtonState(button_state);

                                //remove loading gif
                                $("#vs-div").html('<h3 id="vs" >Vs</h3>');
                                //show results & status
                                $("#results").show();
                                $("#stats").show();

                                //scroll to it gracefully
                                $('html, body').animate({
                                    scrollTop: $("#stats").offset().top / 2
                                }, 500);
                                $(window).scrollTop();

                                if (sum0 > sum1) {
                                    //red wins
                                    $("#result-txt").html("RED WINS!");
                                    if ($("#results").hasClass("results-draw"))
                                        $("#results").removeClass("results-draw");
                                    if ($("#results").hasClass("results-green"))
                                        $("#results").removeClass("results-green");

                                    $("#results").addClass("results-red");

                                    if ($("#share-btn").hasClass("share-btn-green"))
                                        $("#share-btn").removeClass("share-btn-green");
                                    if ($("#share-btn").hasClass("share-btn-draw"))
                                        $("#share-btn").removeClass("share-btn-draw");

                                    $("#share-btn").addClass("share-btn-red");
                                } else if (sum1 > sum0) {
                                    //green wins
                                    $("#result-txt").html("GREEN WINS!");
                                    if ($("#results").hasClass("results-draw"))
                                        $("#results").removeClass("results-draw");
                                    if ($("#results").hasClass("results-red"))
                                        $("#results").removeClass("results-red");

                                    $("#results").addClass("results-green");

                                    if ($("#share-btn").hasClass("share-btn-red"))
                                        $("#share-btn").removeClass("share-btn-red");
                                    if ($("#share-btn").hasClass("share-btn-draw"))
                                        $("#share-btn").removeClass("share-btn-draw");

                                    $("#share-btn").addClass("share-btn-green");
                                } else {
                                    //draw
                                    $("#result-txt").html("OH! CUTE");
                                    if ($("#results").hasClass("results-green"))
                                        $("#results").removeClass("results-green");
                                    if ($("#results").hasClass("results-red"))
                                        $("#results").removeClass("results-red");

                                    $("#results").addClass("results-draw");

                                    if ($("#share-btn").hasClass("share-btn-red"))
                                        $("#share-btn").removeClass("share-btn-red");
                                    if ($("#share-btn").hasClass("share-btn-green"))
                                        $("#share-btn").removeClass("share-btn-green");

                                    $("#share-btn").addClass("share-btn-draw");

                                }
                                images = new Array();
                                results = new Array();

                            }
                        } else {
                            warning = "";
                            if (i)
                                warning = "Sorry, No Face detected in the Green Image :(";
                            else
                                warning = "Sorry, No Face detected in the Red Image :(";
                            // no image detected
                            images[i] = null;
                            results[i] = null;
		            if(allsent>0)
                               allsent = 0;
                            loading(false);
                            error(warning);
                        }

                    })
                    .fail(function(data) {
                        //the Error Function
                        loading(false);
                        error("You are Evil 3:D");
                        images[i] = null;
                        results[i] = null;
                        if(allsent>0)
                               allsent = 0;
                    });
            });
        } else {
            error("Please Upload Both Images!");
        }
    }
    $("#input_file_left").change("#img_left", readImage);
    $("#input_file_right").change("#img_right", readImage);
    $("#submit-btn-blue").click(function() {
        if (button_state == "submit") {
            submit();
        } else if (button_state == "clear") {
            $("#img_left").attr("src", "img/btn.png");
            $("#img_right").attr("src", "img/btn.png");
            $("#results").hide();
            $("#stats").hide();
            allsent = 0;
            button_state = "submit";
            changeButtonState(button_state);
        } else {
            error("You are Evil 3:D");
        }

    });

    function changeButtonState(bstate) {
        if (bstate == "submit") {
            if ($("#submit-btn-blue").hasClass("cancel-btn"))
                $("#submit-btn-blue").removeClass("cancel-btn");
            if ($("#submit-btn-blue").hasClass("submit-btn-black"))
                $("#submit-btn-blue").removeClass("submit-btn-black");
            $("#submit-btn-blue").addClass("submit-btn-blue");
            $("#submit-btn-blue").html(' SUBMIT <i class="fa fa-check">');
        } else if (bstate == "clear") {
            if ($("#submit-btn-blue").hasClass("submit-btn-black"))
                $("#submit-btn-blue").removeClass("submit-btn-black");
            if ($("#submit-btn-blue").hasClass("submit-btn-blue"))
                $("#submit-btn-blue").removeClass("submit-btn-blue");
            $("#submit-btn-blue").addClass("cancel-btn");
            $("#submit-btn-blue").html('CLEAR PHOTO <i class="fa fa-times"> ');
        } else if (bstate == "error") {
            if ($("#submit-btn-blue").hasClass("cancel-btn"))
                $("#submit-btn-blue").removeClass("cancel-btn");
            if ($("#submit-btn-blue").hasClass("submit-btn-blue"))
                $("#submit-btn-blue").removeClass("submit-btn-blue");
            $("#submit-btn-blue").addClass("submit-btn-black");
            $("#submit-btn-blue").html(' Make sure to upload 2 photos with faces !!');
        }
    }


});
