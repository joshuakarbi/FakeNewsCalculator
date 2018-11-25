

var entered_url = "";
var result = document.getElementById('result');
var server = "https://fakenewsutil.herokuapp.com/articleID/"
//var server = "http://127.0.0.1:5000/articleID/"
// thanks to Nicholas C. Zakas
// https://humanwhocodes.com/blog/2009/12/08/computer-science-in-javascript-base64-encoding/
function base64Encode(text){

    if (/([^\u0000-\u00ff])/.test(text)){
        throw new Error("Can't base64 encode non-ASCII characters.");
    } 

    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        i = 0,
        cur, prev, byteNum,
        result=[];      

    while(i < text.length){

        cur = text.charCodeAt(i);
        byteNum = i % 3;

        switch(byteNum){
            case 0: //first byte
                result.push(digits.charAt(cur >> 2));
                break;

            case 1: //second byte
                result.push(digits.charAt((prev & 3) << 4 | (cur >> 4)));
                break;

            case 2: //third byte
                result.push(digits.charAt((prev & 0x0f) << 2 | (cur >> 6)));
                result.push(digits.charAt(cur & 0x3f));
                break;
        }

        prev = cur;
        i++;
    }

    if (byteNum == 0){
        result.push(digits.charAt((prev & 3) << 4));
        result.push("==");
    } else if (byteNum == 1){
        result.push(digits.charAt((prev & 0x0f) << 2));
        result.push("=");
    }

    return result.join("");
}

// Execute a function when the user releases a key on the keyboard
window.addEventListener("keyup", function(event) {
  // Cancel the default action, if needed
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    calculate_fake_news_score()
  }
});

function calculate_fake_news_score() {

	entered_url = document.getElementById("url").value;
	console.log("ENTERED URL: " + entered_url);

	var encoded_url =  base64Encode(entered_url);
	console.log("ENCODED: " + encoded_url);

	// TODO: change to entered_url
	var get_address = server+encoded_url;
	console.log("FETCHING: " + get_address);
	fetch(get_address)
  		.then(function(response) {
  			console.log(response);
    		return response.json();
 	 	})
  		.then(function(myJson) {
            // ie. number of times it says Trump in the article
            trump = parseInt(myJson.score);
            // ie. based on finding similar content words from a Bing Search API call
            frequency = parseInt(myJson.frequency);
            overall_score = (trump+frequency)/2;
            if (overall_score > 10) {
                overall_score = 10;
            }
            result.innerHTML = overall_score;
   	 		// WORKS: result.innerHTML = myJson.score + " " + myJson.frequency
  		});


  	// TODO: show result

}


window.onload = function() {

}

