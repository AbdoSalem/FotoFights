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
        if (dataLength && imgData[i] && imgData[i]["scores"]) {
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
        } else return dataLength;

    }

    function loading(e) {
        if (e) {
            $("#submit-btn-blue").html('FIGHTING <i class="fa fa-cog fa-spin"></i> ');
            $("#vs-div").html('<img id="loading-gif" src="img/loading.gif"/>');
        } else {
            //remove loading gif
            $("#vs-div").html('<h3 id="vs" >Vs</h3>');
            $("#submit-btn-blue").html(' SUBMIT <i class="fa fa-check">');
        }
    }

    function error(e) {
        alert(e);
    }

    function submit() {
        if (images[0] && images[1]) {
            //loading icon
            loading(true);
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
                                $("#submit-btn-blue").removeClass("submit-btn-blue");
                                $("#submit-btn-blue").addClass("cancel-btn");
                                $("#submit-btn-blue").html('CLEAR <i class="fa fa-times"> ');

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
                                    $("#result-txt").html("DRAW!");
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
                            }
                        } else {
                            warning = "";
                            if (i)
                                warning = "Sorry, No Face detected in the Green Image :(";
                            else
                                warning = "Sorry, No Face detected in the Red Image :(";
                            // no image detected
                            images[i] = null;
                            loading(false);
                            allsent = 0;
                            error(warning);
                        }

                    })
                    .fail(function(data) {
                        //the Error Function
                        error("You are Evil 3:D");
                        loading(false);
                    });
            });
        } else {
            error("Please Upload Both Images!");
        }
    }
    $("#input_file_left").change("#img_left", readImage);
    $("#input_file_right").change("#img_right", readImage);
    $("#submit-btn-blue").click(function() {
        if ($("#submit-btn-blue:contains('SUBMIT')").length > 0) {
            submit();
        } else if ($("#submit-btn-blue:contains('CLEAR')").length > 0) {
            $("#submit-btn-blue").removeClass("cancel-btn");
            $("#submit-btn-blue").addClass("submit-btn-blue");
            images = new Array();
            $("#img_left").attr("src", "img/btn.png");
            $("#img_right").attr("src", "img/btn.png");
            $("#submit-btn-blue").html(' SUBMIT <i class="fa fa-check">');
            $("#results").hide();
            $("#stats").hide();
            allsent = 0;
        } else {
            error("You are Evil 3:D");
        }

    });



});
