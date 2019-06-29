console.log(window.location.pathname);
if(window.location.pathname=="/"){
	document.getElementById("search_form").onsubmit=function(e){
	e.preventDefault();
	var xhttp = new XMLHttpRequest();
	var url = '/search';
	var params = 'fcerca='+ document.forms["search_form"]["cerca_text"].value +'&fnumero='+document.forms["search_form"]["numeroText"].value+'&fresult_type='+document.forms["search_form"]["result_type"].value+'&fdate_select='+document.forms["search_form"]["date_select"].value;
	xhttp.open('POST', url, true);
	//Send the proper header information along with the request
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhttp.onreadystatechange = function() {//Call a function when the state changes.
    	if(xhttp.readyState == 4 && xhttp.status == 200) {
        	//alert(xhttp.responseText);
        var dataContainer = document.getElementById("result-data");
  			 while (dataContainer.firstChild) {
    			dataContainer.removeChild(dataContainer.firstChild);
  			}
          document.getElementById('error-group').style.display="none";
          document.getElementById('result-data').style.display="block";
          var tweets_sentiment = JSON.parse(xhttp.responseText);

          //alert(tweets_sentiment.tweet[0].text);

          var div = document.getElementById('result-data');
          if(tweets_sentiment==null){
            var par =document.createElement('h5');;
            var txt = document.createTextNode("No data found");
            par.appendChild(txt);
            div.appendChild(par);
          }
          else{
            for(var i=0;i<tweets_sentiment.tweet.length;i++){
            var tbl = document.createElement('table');
            tbl.classList.add("table");
            tbl.classList.add("table-hover");
            var thd = document.createElement('thead');
            var trhd = document.createElement('tr');
            trhd.classList.add("riga-colorata");
            trhd.classList.add("bg-primary");
            thd.appendChild(trhd);

            var txt;
            for(var k=0;k<2;k++){
              if(k==0){
                txt = document.createTextNode("Tweet Data");
              }
              else{
                txt = document.createTextNode("Sentiment Analysis");
              }
              var th = document.createElement('th');
              th.setAttribute("scope","col");
              th.appendChild(txt);
              trhd.appendChild(th);
             
            }
           
            tbl.appendChild(thd);

            var tbdy = document.createElement('tbody');
            for (var h = 0; h < 6; h++) {
              var tr = document.createElement('tr');
              var td = document.createElement('td');
              var td1 = document.createElement('td');
              if(h==0){  
              	if(tweets_sentiment.tweet[i].full_text.startsWith("RT @")){
              		td.appendChild(document.createTextNode("Text: "+tweets_sentiment.tweet[i].retweeted_status.full_text));
              	}
              	else{
              		td.appendChild(document.createTextNode("Text: "+tweets_sentiment.tweet[i].full_text));
              	}
                
                td.setAttribute("colspan","2");  
                //td.classList.add("bg-warning");
                td.classList.add("big-text");
              }
              else if(h==1){
                td.appendChild(document.createTextNode("Username: "+tweets_sentiment.tweet[i].user.name));
                td1.appendChild(document.createTextNode("Score: "+tweets_sentiment.sentiment[i].score));
                
              }
              else if(h==2){
                td.appendChild(document.createTextNode("User Location: "+tweets_sentiment.tweet[i].user.location));
                //td1.appendChild(document.createTextNode("Tokens: "+tweets_sentiment.sentiment[i].tokens.toString()));
                //td1.appendChild(document.createTextNode(""));
                td1.appendChild(document.createTextNode("Comparative: "+tweets_sentiment.sentiment[i].comparative));
              }
              else if(h==3){
                td.appendChild(document.createTextNode("Created at: "+tweets_sentiment.tweet[i].created_at));
                td1.appendChild(document.createTextNode("Words: "+tweets_sentiment.sentiment[i].words.toString()));
              }
              else if(h==4){
                td.appendChild(document.createTextNode("Favorite count: "+tweets_sentiment.tweet[i].favorite_count));
                td1.appendChild(document.createTextNode("Positive: "+tweets_sentiment.sentiment[i].positive.toString()));
              }
              else if(h==5){
                td.appendChild(document.createTextNode("Retweet count: "+tweets_sentiment.tweet[i].retweet_count));
                td1.appendChild(document.createTextNode("Negative: "+tweets_sentiment.sentiment[i].negative.toString()));
              }
              
              if(h==0){
                tr.appendChild(td);
              }
              else{
                tr.appendChild(td);
                tr.appendChild(td1);
              }
             
              tbdy.appendChild(tr);

            }
            tbl.appendChild(tbdy);
            div.appendChild(tbl);
          }

          }

          
    	}
    	else if(xhttp.readyState == 4 && xhttp.status!=200){
    		var errorsContainer = document.getElementById("errors");
  			while (errorsContainer.firstChild) {
    			errorsContainer.removeChild(errorsContainer.firstChild);
  			}
    		document.getElementById("error-group").style.display="block";
        	document.getElementById('result-data').style.display="none";
        	
    		var errors = JSON.parse(xhttp.responseText);
      		for (var i = 0; i < errors.length; i++) {
        		var node = document.createElement("li");                
				    var textnode = document.createTextNode(errors[i].msg);
				    node.appendChild(textnode);
        		errorsContainer.appendChild(node);
      		}
      		
    	}
    	
	}

	xhttp.onerror = function(){
		alert('There was a connection error of some sort');
    	document.getElementById("error-group").style.display="none";
    	document.getElementById('result-data').style.display="none";
	}
	xhttp.send(params);
	};



}

