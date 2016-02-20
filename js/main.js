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

$(function () {
    
    //read the image choosen and send the request to Microsoft
    function readImage(dest) {
    if ( this.files && this.files[0] ) {
    	var that =this;
        var FR = new FileReader();
        FR.onload = function(e) {
             $(dest.data).attr( "src", e.target.result );             
	     $.ajax({
			url: "https://api.projectoxford.ai/emotion/v1.0/recognize",
			contentType: "application/octet-stream",
			
			beforeSend: function(xhrObj){
			    // Request headers

			    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","281f479605604d969c9e4c01c9447e31");
			},
			type: "POST",
			processData: false,
			    // Request body
			data: that.files[0]
		})
		.done(function(data) {
			//the success Function
//		 	 $('#base').text(JSON.stringify(data, null, '\t'));
		})
		.fail(function(data) {
			//the Error Function
//		   $('#base').text(JSON.stringify(data, null, '\t'));
		});
        };       
        FR.readAsDataURL( this.files[0] );
    }
}

    //use this function in done event with the input data with no change
    function parseJSON(imgData){
        
    	var dataLength = imgData.length;
    	var happiness = 0;
    	var anger = 0;
    	var fear = 0;
    	var surprise = 0;
    	for(var i =0;i<dataLength;i++){
    		happiness += imgData[i]["scores"]["happiness"];
    		anger += imgData[i]["scores"]["anger"];
    		fear += imgData[i]["scores"]["fear"];
    		surprise += imgData[i]["scores"]["surprise"];

    	}
    	//the return data are happiness , anger , fear and surprise respectively
        //use it in filling the bars under the images
    	params_arr = [(happiness/dataLength), (anger/dataLength), (fear/dataLength), (surprise/dataLength)];
    	return params_arr;

    }
$("#input_file_left").change("#img_left",readImage);
$("#input_file_right").change("#img_right",readImage );


 

});
