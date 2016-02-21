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
        }else{
        	$("#results").hide();
		$("#stats").hide();
        }
    }

    //use this function in done event with the input data with no change
    function parseJSON(imgData) {

        var dataLength = imgData.length;
        if (dataLength) {
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

    function submit() {
        if (images[0] && images[1]) {
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
                            results[i] = params_result;
                            $("#img_" + (i + 1) + "_happiness").css('width', params_result[0] + '%');
                            $("#happiness-" + (i + 1)).html(params_result[0]);
                            $("#img_" + (i + 1) + "_anger").css('width', params_result[1] + '%');
                            $("#anger-" + (i + 1)).html(params_result[1]);
                            $("#img_" + (i + 1) + "_fear").css('width', params_result[2] + '%');
                            $("#fear-" + (i + 1)).html(params_result[2]);
                            $("#img_" + (i + 1) + "_surprise").css('width', params_result[3] + '%');
                            $("#surprise-" + (i + 1)).html(params_result[3]);
                            $("#img_" + (i + 1) + "_overall").html(params_result[0] + params_result[1] + params_result[2] + params_result[3]);
                            if (results[0] && results[1]) {
                                sum0 = 0;
                                sum1 = 0;
                                $.each(results[0], function() {
                                    sum0 += parseFloat(this) || 0;
                                });
                                $.each(results[1], function() {
                                    sum1 += parseFloat(this) || 0;
                                });
                                $("#results").show();
				$("#stats").show();
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
                                warning = "No Face detected in the Green Image!";
                            else
                                warning = "No Face detected in the Red Image!";
                            // no image detected
                            alert(warning);
                        }

                    })
                    .fail(function(data) {
                        //the Error Function
                        //		   $('#base').text(JSON.stringify(data, null, '\t'));
                    });
            });
        }else{
        	alert("Please Upload Both Images!");
        }
    }
    $("#input_file_left").change("#img_left", readImage);
    $("#input_file_right").change("#img_right", readImage);
    $("#submit-btn-blue").click(submit);



});
