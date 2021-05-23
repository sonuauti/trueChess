const memoryBank = new Array(9).fill(0).map(() => new Array(9).fill(0));
	const  pieces=["king","queen","bishop","knight","rook","pawn"];	

	const  ruleBook={
			"king":{"moves":["step_fw","step_bw","step_dig","step_left","step_right"],"step_size_max":"1","step_size_min":"1"},
			"queen":{"moves":["step_fw","step_bw","step_dig","step_left","step_right"],"step_size_max":"n","step_size_min":"1"},
			"bishop":{"moves":["step_dig"],"step_size_max":"n","step_size_min":"1"},
			"knight":{"moves":["step_knight"],"step_size_max":"3","step_size_min":"3"},
			"rook":{"moves":["step_fw","step_bw","step_left","step_right"],"step_size_max":"n","step_size_min":"1"},
			"pawn":{"moves":["step_fw","step_dig"],"step_size_max":"2","step_size_min":"1"}
			};

	const uniCodeSym={wking:'&#9812;',wqueen:'&#9813;',wbishop:'&#9815;',wknight:'&#9816;',wrook:'&#9814;',wpawn:'&#9817;',bking:'&#9818;',bqueen:'&#9819;',bbishop:'&#9821;',bknight:'&#9822;',brook:'&#9820;',bpawn:'&#9823;'};
	const aplhas=['a','b','c','d','e','f','g','h'];		
	
	

	function updateCssPro(key,value){
		  var root_ = document.querySelector(':root');
		  root_.style.setProperty(key,value);
	}

	function updateTheme(value){
		  var root_ = document.querySelector(':root');
		  root_.style.setProperty('--cell1',value);
		  window.localStorage['btheme']=value;
	}	

	function getStyle(key){
		var root_ = document.querySelector(':root');
		var rs = getComputedStyle(root_);
		return rs.getPropertyValue(key);
	}

	function createControls(){
		var controls=document.getElementById("controls");
	}	

	function checkIfExists(pieceName,positions){
		for (var key in positions) {
			if (positions.hasOwnProperty(key)) {
				var val = positions[key];
				console.log("Input name "+pieceName+" -> "+val);
				if (val==pieceName) {
					break;
					return true;
				}
			}
		}
	}

	function searchMemBank(memoryBank){
		console.log(memoryBank['a8']);
	}
	

	function createChessBoard(boardId,config){

		if (window.localStorage['btheme']) {
			updateTheme(window.localStorage['btheme']);
		}else{
			var root_ = document.querySelector(':root');
		  	var rs = getComputedStyle(root_);
			updateTheme(rs.getPropertyValue('--'+config.boardTheme));
		}

		var chessboard=document.getElementById(boardId);

		if (config.showBorder==true) {
			chessboard.style.border="2px solid #444";
		}
		
		var table=document.createElement('div');
		chessboard.appendChild(table);
		
		//check the width of main div and calculate the cell size
		var hw = chessboard.style.width.split("px")[0];
		if (hw<150) {
			hw=150;
			chessboard.style.width='150px';
		}else if (hw<=300) {
			config.showBoardNotations=false;
		}
		//console.log(hw);
		updateCssPro('--cellhw',((hw/8)-16)+"px");

		
		var maxRowCol=8;
		var notationNum=8;
		var numNotations=['8','7','6','5','4','3','2','1'];

		for (var row = 0; row <maxRowCol; row++) {
			var tr=document.createElement('div');
			tr.style.marginTop="0px";
			table.appendChild(tr);
			for (var icol = 0; icol <maxRowCol; icol++) {

				acol=aplhas[icol];
				ntrow=numNotations[row];
				var pieceName='no';
				var squareId=(acol+""+ntrow);
				//calculate the positions 
				if (config.position=='start') {
					pieceName=getInitialPos(ntrow,acol);
				}else if(isObject(config.position)){
					//console.log('object is here');
					for (var key in config.position) {
					  if (config.position.hasOwnProperty(key)) {
					    var val = config.position[key];
					   // console.log(val);
					    if (squareId==key) {
					    	pieceName=val;
					    } 
					  }
					}
				}


				//store the initial piece information in memory bank
				memoryBank[squareId]=pieceName;
				
				
				var td=document.createElement('div');
				td.setAttribute("id",squareId);

				if (row%2==0) {
					if (icol%2==0) {
						td.className = 'evenCol';
					}else{
						td.className = 'oddCol';
					}
				}else{
					if (icol%2==0) {
						td.className = 'oddCol';
					}else{
						td.className = 'evenCol';
					}
				}

				var notationVerticals='';
				var notationHorizontal='';
				var notationColor='gray';

				if(config.showBoardNotations==true){
					if (icol==0) {
						notationVerticals=notationNum--;
					}
					if (row==7) {
						notationHorizontal=aplhas[icol];
					}
					if (td.className=='evenCol') {
						notationColor='--cell1';
					}else{
						notationColor='--cell2';
					}
				}
	
			
				
					if (pieceName!='no') {
						var real_div=document.createElement("div");
						if (config.lockMoves!=true) {
							real_div.setAttribute("draggable","true");
							real_div.setAttribute("ondragstart","dragStart(event);");
						}

						if (config.displayUnicodeSymbols==true) {
							updateCssPro("--wrook",uniCodeSym[pieceName]);
							//console.log(uniCodeSym[pieceName]);
						}

						if (config.imgSrc && config.imgSrc!="") {
							updateCssPro("--"+pieceName,"url('"+config.imgSrc+pieceName+".png')");
							//console.log(uniCodeSym[pieceName]);
						}

						if (config.animation==true) {
							real_div.className=pieceName+" cell animated bounceIn";	
						}else{
							real_div.className=pieceName+" cell";
						}
						
					}else{
						var real_div=document.createElement("div");
						real_div.setAttribute("draggable","false");
						if (config.animation==true) {
							real_div.className='cell animated';	
						}else{
							real_div.className='cell animated';	
						}
					}

					real_div.setAttribute("id",(acol+"_"+ntrow));
					if (config.lockMoves!=true) {
						real_div.setAttribute("onclick","onCellTap(this.id,'"+acol+""+ntrow+"')");
					}else{
						real_div.setAttribute("draggable","false");
					}
					
					if (config.showBoardNotations) {
						
						var span1=document.createElement("span");
						span1.innerHTML=notationVerticals;
						span1.style.color=getStyle(notationColor);
						span1.className="vnotations";
						var span2=document.createElement("span");
						span2.innerHTML=notationHorizontal;
						span2.style.color=getStyle(notationColor);
						span2.className="hnotations";
						real_div.appendChild(span1);
						real_div.appendChild(span2);
						//console.log(notationColor);
					}
				
				td.appendChild(real_div);
				tr.appendChild(td);
			}

		}
	}

	function getInitialPos(row,col){

		var ptype = 'no'; //not occupied
		if (row==8 || row ==7) {
			ptype='b';
		}else if (row==1 || row ==2) {
			ptype='w';	
		}

		var algebricSqr= (col+""+row);

		//console.log(algebricSqr);

		//this is for rook
		if (algebricSqr=="a8" || algebricSqr=="h8" || algebricSqr=="a1" || algebricSqr=="h1") {
			return ptype+""+pieces[4];
		}

		//this is for knight
		if (algebricSqr=="b1" || algebricSqr=="b8" || algebricSqr=="g1" || algebricSqr=="g8") {
			return ptype+""+pieces[3];
		}

		//this is bishop
		if (algebricSqr=="c1" || algebricSqr=="c8" || algebricSqr=="f1" || algebricSqr=="f8") {
			return ptype+""+pieces[2];
		}

		//this is for queen
		if (algebricSqr=="d1" || algebricSqr=="d8") {
			return ptype+""+pieces[1];
		}

		//this if king
		if (algebricSqr=="e1" || algebricSqr=="e8") {
			return ptype+""+pieces[0];
		}

		//this if for pawn
		if (row==2 || row==7) {
			return ptype+""+pieces[5];	
		}else{
			return "no";
		}
		
	}

	
	function dragStart(event) {
		console.log(event.target.id);
	  	//event.dataTransfer.setData("background", document.getElementById(event.target.id).style.background);
	  	//document.getElementById(event.target.id).style.background='none';
	}

	function dragging(event) {
	  //document.getElementById("demo").innerHTML = "The p element is being dragged";
	  console.log("on dragging ->"+event.target.id);
	}

	function allowDrop(event) {
	  event.preventDefault();
	}

	function drop(event) {
	  event.preventDefault();
	  console.log("onDrop -> "+event.target.id);
	}

	function animateView(viewId,animateClass){
		var e=document.getElementById(viewId);
		e.classList.add(animateClass);
		setTimeout(function() {
			e.classList.remove(animateClass);
		}, 100);
	}

	function onCellTap(eleId,squareId){
		animateView(eleId,'bounceIn');
		checkRule(squareId,eleId);
	}

	/**
		update the cell symbol
	**/
	function udpateCell(eleId,data){
		document.getElementById(eleId).className=data;
	}	

	function isKingCheck(){

	}

	var moves={start:false,end:false,ptype:'na',squareId:-1,startEleId:'',endEleId:'',data:''};
	function checkRule(squareId,eleId){
		
		var pieceName=memoryBank[squareId];

		console.log(pieceName);

		if (pieceName!="no" && moves.start==false) {
			console.log('First tap at '+pieceName);
			moves.start=true;
			moves.end=false;
			moves.ptype=pieceName;  //store first position 
			moves.squareId=squareId;
			moves.startEleId=eleId;
			moves.data=document.getElementById(moves.startEleId).className;
		}else if (moves.end==false && moves.start==true) {
			console.log('second tap at '+pieceName);

			if (moves.ptype[0]==memoryBank[squareId][0]) {
				console.log('trying to capture own pieces');
				moves.start=false;
				return;
			}
			
			memoryBank[squareId]=moves.ptype;  //update position with last 
			memoryBank[moves.squareId]='no';
			moves.endEleId=eleId;
			
			if (moves.ptype[0]=="w" && memoryBank[squareId][0]=="b") {
				//capture move
				udpateCell(moves.startEleId,document.getElementById(moves.endEleId).className);
			}else{
				//non capture move
				udpateCell(moves.startEleId,"cell");
			}

			udpateCell(moves.endEleId,moves.data);
			
			moves={start:false,end:true,ptype:'no',squareId:-1,startEleId:'',endEleId:'',data:''};
		}else {
			console.log('Invalid move, please check');
		}

	}

	function isObject(obj){
    	return obj !== undefined && obj !== null && obj.constructor == Object;
	}