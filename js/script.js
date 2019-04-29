//Good Idea: Make the sense of the x bouncing random (between -1 and 1 excluding 0) when bounce.
//You use cammel case as well as snake, you should use just one.
var button = document.getElementsByClassName("Button")[0];
var winButton = document.getElementsByClassName("secondButton")[0];
var loseButton = document.getElementsByClassName("thirdButton")[0];

var menuBlock = document.getElementsByClassName("menu")[0];
var playButton = document.getElementsByClassName("menuButton")[0];
var instructionButton = document.getElementsByClassName("menuButton")[1];
var creditsButton = document.getElementsByClassName("menuButton")[2];

var body   = document.getElementsByTagName("body")[0];
var ball   = document.getElementsByClassName("movingBall")[0];
var paddle = document.getElementsByClassName("paddle")[0];

/**/
var idealBrickWidth = 64; //Desired Width in pixels;
/**/

var ball_dx = 4; //Snake
var ball_dy = 4; //Snake

var brick_counter = 1;//We already have one in the html  //Snake

createWall();
//moveBall();

/***-----------------------------Set Up---------------------------***/
/********************Menu Buttons*******************/
	playButton.onclick = function(){play()};
	instructionButton.onclick = function(){ showInstructions() };
	creditsButton.onclick = function(){ showCredits() };


	function play(){
		menuBlock.remove();
		moveBall();
	}

	function showInstructions(){
		instructionButton.remove();
		creditsButton.remove();

		var instroContainer = document.createElement("div");
		menuBlock.appendChild(instroContainer);

		var instructionsIframe = document.createElement("iframe");
		instructionsIframe.src = "views/instructions.html";
		instroContainer.appendChild(instructionsIframe);
	}

	function showCredits(){
		instructionButton.remove();
		creditsButton.remove();

		var creditsContainer = document.createElement("div");
		menuBlock.appendChild(creditsContainer);

		var creditsIframe = document.createElement("iframe");
		creditsIframe.src = "views/credits.html";
		creditsContainer.appendChild(creditsIframe);
	}
/*******************************************/

/********************Wall*******************/

	function createWall(){
	
	/**/
	var firstBrick = document.createElement("div"); //Constructor (In java speaking)
	firstBrick.classList.add('brick'); //Con esto agregamos la clase .brick del css al objeto firstBrick
		body.insertBefore(firstBrick,ball);
		firstBrick.style.width = idealBrickWidth + "px"; //Assigns the new "responsive" value.
	/**/

	var windowWidth = window.innerWidth;

	var brickWidth = Math.floor( windowWidth / (Math.round(windowWidth/firstBrick.clientWidth)) );
	var numberOfBricks = Math.round(windowWidth/firstBrick.clientWidth);
	var margin = (windowWidth-(numberOfBricks*brickWidth) ) / 2;
	
	/**/
	firstBrick.style.width = brickWidth + "px";
	firstBrick.style.left = margin + "px";
	/**/


	var separation = 0;
	
	var brick_x = getPosition(firstBrick).x + brickWidth + separation; //Because we already have the first one on html //Snake
	var brick_y = getPosition(firstBrick).y; //Snake

		var adHocCounter = 1;
		for (j = 0; j < 5; j++) { 

			while (adHocCounter < numberOfBricks ){
				addBrick(brick_x, brick_y, brickWidth);
				brick_counter = brick_counter + 1;

				brick_x = brick_x + brickWidth /*firstBrick.clientWidth*/+ separation; 

				adHocCounter = adHocCounter +1;
			}
			adHocCounter = 0;
		 	brick_y = brick_y + firstBrick.clientHeight + separation ;  //Jump to next row
		 	brick_x = getPosition(firstBrick).x;
		}
	}
		
	function isTheRowFilled(brick_x,brickWidth){
		if(brick_x >= window.innerWidth - ( brickWidth/* + (firstBrick.clientWidth/2)*/ ) ){
			return false;
		}else{
			return true;
		}
	}

	function addBrick(brick_x, brick_y,brick_w){
		var newBrick = document.createElement("div"); //Constructor (In java speaking)
		newBrick.classList.add('brick'); //Con esto agregamos la clase .brick del css al objeto newBrick
		body.insertBefore(newBrick,ball);
		//body.appendChild(newBrick);
		newBrick.style.left = brick_x + "px";
		newBrick.style.top  = brick_y + "px";
		newBrick.style.backgroundColor = '#'+ Math.floor(Math.random()*16777215).toString(16);
		newBrick.style.width = brick_w +"px";
	}

	/***Animating the paddle***/
	document.onmousemove = readMouseMove;
	function readMouseMove(e){
		var result_x = e.clientX; //Snake
		var result_y = e.clientY; //Snake
		//console.log(result_x);

		if(result_x <= paddle.clientWidth){
			paddle.style.left = 0 + "px"; 
		} else {
			paddle.style.left = (result_x - paddle.clientWidth + "px");
		}
	}
/*******************************************/


/***--------------------Animation and GamePlay--------------------***/
/****************First Layer****************/
	function moveBall(){
		checkForWall();
		checkForPaddle();
		checkForBrick();
		
		move(ball, ball_dx, ball_dy);
		RAF_ID = window.requestAnimationFrame(moveBall); //Snake
		//This line animate moveBall() and at the same time save the ID of this Request animation frame on RAF_ID for further porpuses 
		
		checkForFloor();
		checkForWin();
	}

	function checkForWall() {
		x = getPosition(ball).x;
		y = getPosition(ball).y;

		if(x >= window.innerWidth  - (ball.clientWidth + Math.abs(ball_dx)) || x <= 0) {
			ball_dx = (-1)*ball_dx;
		}

		if(y >= window.innerHeight - (ball.clientHeight+ Math.abs(ball_dy)) || y <= 0){
			ball_dy = (-1)*ball_dy;
		}
	}

	function checkForPaddle(){
		x = getPosition(ball).x + (ball.clientWidth/2);
		y = getPosition(ball).y + ball.clientHeight;

		paddleLeftCorner_x = getPosition(paddle).x; //Snake
		paddleLeftCorner_y = getPosition(paddle).y; //Snake

		if(   ( x >  paddleLeftCorner_x && x < paddleLeftCorner_x + paddle.clientWidth) && (y >= paddleLeftCorner_y)  ){ 
			ball_dy = -ball_dy;
		}
	}

	function checkForBrick(){
		checkTopAndBottom();
		checkLeftAndRight();
	}

	function move(element, dx, dy){
		element.style.left = ( getPosition(ball).x + dx ) + "px";
		element.style.top  = ( getPosition(ball).y + dy ) + "px";
	}

	function checkForFloor(){
		y = getPosition(ball).y;
		if(y >= window.innerHeight - ( ball.clientHeight + Math.abs(ball_dy) )  ){
			lose();
		}
	}

	function checkForWin(){
		if(brick_counter <= 0){
			win();
		}
	}
/*******************************************/


/****************Second Layer****************/
	/**In Construction*/
	function checkTopAndBottom(){
		//We are NOT going to NEST these functions FOR NOW but keep in considaration the following pages and the FACT that by nesting a function you are actually creating the inner function over and over and again which ofcourse SHOULD affect the performance. Check the followig anyway http://code.tutsplus.com/tutorials/stop-nesting-functions-but-not-all-of-them--net-22315      and     http://www.w3schools.com/js/js_function_closures.asp an

		a = getPosition(ball).x;
		b = getPosition(ball).y - 1; //This way takes in account the entire line above the brick instead 
		c = getPosition(ball).y + 40 + 1;
		there_is_an_element  = false; //Snake
		class_of_the_element = "notBrick";/*What is this shit doing? find out or remove*/ //Snake

		for( i=0 ; i < 39 ; i++){ //Whenever you CAN please replace this 39 by a more generic variable
			a = a + 1; //Each cicle move 'a' foward one pixel in this way we check the entire row at the end of the loop 
			
			/*********************** Checking up side of the ball************************/
			var above_element = document.elementFromPoint(Math.abs(a), Math.abs(b) ); //Snake
			if(above_element != null){ class_of_the_element_1 = above_element.className;}
			
			/*********************** Checking down side of the ball************************/
			var below_element = document.elementFromPoint(Math.abs(a), Math.abs(c) ); //Snake
			if(below_element != null){ class_of_the_element_2 =  below_element.className;}
			
			
			if(class_of_the_element_1 == "brick"){
				var audio = new Audio('button-4.mp3');
				audio.play();
				if(above_element != null){above_element.remove(); brick_counter = brick_counter -1;}
				there_is_an_element = true; 

			} else if (class_of_the_element_2 == "brick") {
				var audio = new Audio('button-4.mp3');
				audio.play();	
				if(below_element != null){below_element.remove(); brick_counter = brick_counter -1;}
				there_is_an_element = true; 
				ball_dx = -ball_dx;//Arbitrary for playability 
			}

			
		}

		if(there_is_an_element){
			//console.log("there was colition");
			ball_dy = -ball_dy;
			ball_dx = -ball_dx;
			//console.log("The number of bricks is " + brick_counter );
		}
	}

	function checkLeftAndRight(){
		a = getPosition(ball).x - 1;
		b = getPosition(ball).y; 
		c = getPosition(ball).x + 40 + 1;
		there_is_an_element = false; //Snake

		for( i=0 ; i < 39 ; i++){ //Whenever you CAN please replace this 39 by a more generic variable
			b = b + 1;  
			
			
			var above_element = document.elementFromPoint(Math.abs(a), Math.abs(b) );
			if(above_element != null){ class_of_the_element_1 = above_element.className;}
			
			var below_element = document.elementFromPoint(Math.abs(c), Math.abs(b) );
			if(below_element != null){ class_of_the_element_2 =  below_element.className;}
			
			if(class_of_the_element_1 == "brick"){
				var audio = new Audio('button-4.mp3');
				audio.play();
				if(above_element != null){above_element.remove(); brick_counter = brick_counter -1;}
				there_is_an_element = true; 

			} else if (class_of_the_element_2 == "brick") {
				var audio = new Audio('button-4.mp3');
				audio.play();	
				if(below_element != null){below_element.remove(); brick_counter = brick_counter -1; }
				there_is_an_element = true; 
				ball_dx = -ball_dx;//Arbitrary for playability 
			}


		}

		if(there_is_an_element){
			//console.log("Man on the moon!");
			ball_dx = -ball_dx;
			ball_dy = -ball_dy; //This make it a little bit harder even It's not physically right
			//console.log("The number of bricks is  " + brick_counter );
		}
	}
	/*****************/

	function win(){
		window.cancelAnimationFrame(RAF_ID);//Stop the Animation
		removeEverything(); //Yheap It removes every single shit.
		
		/*Creating and adding a div block*/
		messageContainer = document.createElement("div");
		messageContainer.classList.add('textBlock');
		body.appendChild(messageContainer);
		
		/*Creating an iframe to fill that block*/
		winnerIframe = document.createElement("iframe");
		winnerIframe.src = "views/winnerView.html";
		messageContainer.appendChild(winnerIframe);

		// /*Creating a Reload Button*/
		// reLoadButton = document.createElement("div");
		// reLoadButton.classList.add('refreshButton');
		// messageContainer.insertBefore(reLoadButton,winnerIframe);

		// /*Adding text*/
		// var text = document.createTextNode('«');
		// reLoadButton.appendChild(text);


		// reLoadButton.onclick = function(){refreshPage()};
	}

	function lose(){
		window.cancelAnimationFrame(RAF_ID);//Stop the Animation
		removeEverything(); //Yheap It removes every single shit.
		
		/*Creating and adding a div block*/
		messageContainer = document.createElement("div");
		messageContainer.classList.add('textBlock');
		body.appendChild(messageContainer);
		
		/*Creating an iframe to fill that block*/
		winnerIframe = document.createElement("iframe");
		winnerIframe.src = "views/loserView.html";
		messageContainer.appendChild(winnerIframe);

		/*Creating a Reload Button*/
		reLoadButton = document.createElement("div");
		reLoadButton.classList.add('refreshButton');
		messageContainer.insertBefore(reLoadButton,winnerIframe);

		/*Adding text*/
		var text = document.createTextNode('«');
		reLoadButton.appendChild(text);


		reLoadButton.onclick = function(){refreshPage()};
	}

	function getPosition(element) {	
		//Source: kiriupa, returns the position of the upper left corner of the given element
	    var xPosition = 0;
	  	var yPosition = 0;
	    while(element) {
	        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
	        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
	        element = element.offsetParent;
	    }
	    return { x: xPosition, y: yPosition };
	}
/********************************************/

/****************Third Layer****************/
	function refreshPage(){
		window.location.reload();
	}

	function removeEverything(){
		while (body.firstChild) {//This loop remove each element until there is nothing else to remove
	    	body.removeChild(body.firstChild);
		}
	}
/******************************************/


/********************Buttons**************************/
	var is_it_playing = true; //Snake
	function pause(){
		if(is_it_playing){
			window.cancelAnimationFrame(RAF_ID);
			is_it_playing = false;
		}
		else{
			window.requestAnimationFrame(moveBall);
			is_it_playing = true;
		}
	}

	/********************Pause Button*********************/  
	button.onclick = function(){pause()};


	/******************** You Win Button *****************/
	//winButton.onclick = function(){win()};


	/******************** You Win Button *****************/
	//loseButton.onclick = function(){lose()};
/*****************************************************/


