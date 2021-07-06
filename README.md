# trueChess - Free and Open Source JS framework for your next chess project.

"trueChess is under beta development"

Features supported
- Support board theming
- Add custom rules
- Add custom icons for piceses 
- Support lock mode for view only
- Support true chess rules (How human play chess on physical board !)
- Min board size 150px, can create multiple chess board.


## Getting started

1.  Add/link following files
```java
  <link rel="stylesheet" href="style.css"> <!-- color and style information -->
  <script type="text/javascript" src="truechess.js"> </script> <!--  main js file -->
```

2.  Add board div inside body tag of your html page

```html
  <div id="chessBoard" style="width: 500px; margin: auto;"> </div>
```

3.  Call createChessBoard function, after the page load

```java
var config = {
		showBoardNotations:true,	//show board notations 1-8, a-f
		position:{d6: 'bking', d4: 'wpawn',e4: 'wking',a1:'wrook',a8:'brook'}, // either "start" or position object
		isDraggable:false,		//drag element			
		boardTheme:'theme_wood',	//board color
		imgSrc:'img/',			//directory path of icons
		showBoardWithPieces:true,	//show board only
		animation:true, 		//show animation 
		showBorder:false,		//show black border around the board
		lockMoves:false			//lock the moment of piceses
	}
	//refer index.html for all config options
		
	truechess.createChessBoard('chessBoard',config);

 ```
 
4.  That's it !

## Position property

position property in config support following inputs

```java
var config = {position:"start"};
var config= {position: {board_notation:'picesType+picesName'} };
//example var config={ position: {d4:wpawn, e4:wknight} }
```
	
d4 - board notation, wpawn  - white pawn



[Click here for demo](https://htmlpreview.github.io/?https://github.com/sonuauti/trueChess/blob/main/demo.html)


![Wooden Theme](https://github.com/sonuauti/trueChess/blob/main/examples/auto_demo.gif)


Design, Build, Tested by   
Twitter/Github /sonuauti
