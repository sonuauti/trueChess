# trueChess - Free and Open Source JS framework for your next chess project.

Features supported
- Support theming
- Add custom rules
- Add custom icons for piceses 
- Play in local network without internet
- Support service worker for intensive task


##Getting started

1.  Add/link following files
```java
  <link rel="stylesheet" href="style.css"> <!-- color and style information -->
  <script type="text/javascript" src="truechess.js"> </script> <!--  main js file -->
```

2.  Add board div inside body tag of your html page

```html
  <div id="chessBoard1" style="width: 500px; margin: auto;"> </div>
```

3.  Call createChessBoard function, after the page load

```java
  var config = {
			showBoardNotations:true,				//show board notations 1-8, a-f
			position:{d6: 'bking', d4: 'wpawn',
			e4: 'wking',a1:'wrook',a8:'brook'},     // either "start" or position object
			isDraggable:false,						//drag element			
			boardTheme:'theme_wood',				//board color
			imgSrc:'img/',							//directory path of icons
			showBoardWithPieces:true,				//show board only
			animation:true, 						//show animation 
			showBorder:false,						//show black border around the board
			lockMoves:false							//lock the moment of piceses
	       }
		
		createChessBoard('chessBoard',config);
 ```
 
4.  That's it !


Demo screenshot

![Wooden Theme](https://github.com/sonuauti/trueChess/blob/main/examples/screenshot.png)


Design, Build, Tested by   
Twitter/Github /sonuauti
