const truechess={memoryBank:[],
	pieces:["king","queen","bishop","knight","rook","pawn"],
	ruleBook:{
			"king":{"moves":["step_fw","step_bw","step_dig","step_left","step_right"],"step_size_max":"1","step_size_min":"1"},
			"queen":{"moves":["step_fw","step_bw","step_dig","step_left","step_right"],"step_size_max":"n","step_size_min":"1"},
			"bishop":{"moves":["step_dig"],"step_size_max":"n","step_size_min":"1"},
			"knight":{"moves":["step_knight"],"step_size_max":"3","step_size_min":"3"},
			"rook":{"moves":["step_fw","step_bw","step_left","step_right"],"step_size_max":"n","step_size_min":"1"},
			"pawn":{"moves":["step_fw","step_dig"],"step_size_max":"2","step_size_min":"1"}
			},
	uniCodeSym:{wking:'&#9812;',wqueen:'&#9813;',wbishop:'&#9815;',wknight:'&#9816;',wrook:'&#9814;',wpawn:'&#9817;',bking:'&#9818;',bqueen:'&#9819;',bbishop:'&#9821;',bknight:'&#9822;',brook:'&#9820;',bpawn:'&#9823;'},
	aplhas:['a','b','c','d','e','f','g','h'],
	updateCssPro:function(key,value){
		  let root_ = document.querySelector(':root');
		  root_.style.setProperty(key,value);
	},
	updateTheme:function(value){
		  let root_ = document.querySelector(':root');
		  root_.style.setProperty('--cell1',value);
		  window.localStorage['btheme']=value;
	},	
	getStyle:function(key){
		let root_ = document.querySelector(':root');
		let rs = getComputedStyle(root_);
		return rs.getPropertyValue(key);
	},

	createControls:function(){
		let controls=document.getElementById("controls");
	},	

	checkIfExists:function(pieceName,positions){
		for (var key in positions) {
			if (positions.hasOwnProperty(key)) {
				let val = positions[key];
				console.log("Input name "+pieceName+" -> "+val);
				if (val==pieceName) {
					break;
					return true;
				}
			}
		}
	},

	searchMemBank:function(memoryBank){
		console.log(memoryBank['a8']);
	},
	
	local_config:[],
	createChessBoard:function(boardId,config){
		this.local_config=config;
		if (window.localStorage['btheme']) {
			this.updateTheme(window.localStorage['btheme']);
		}else{
			var root_ = document.querySelector(':root');
		  	var rs = getComputedStyle(root_);
			this.updateTheme(rs.getPropertyValue('--'+config.boardTheme));
		}

		var chessboard=document.getElementById(boardId);

		if (config.showBorder==true) {
			chessboard.style.border="2px solid #444";
		}

		var table=document.createElement('div');
		table.setAttribute("id","table");
		chessboard.appendChild(table);

		if (config.isDraggable=true) {
			this.addDrag();
		}
		
		//check the width of main div and calculate the cell size
		var hw = chessboard.style.width.split("px")[0];
		if (hw<150) {
			hw=150;
			chessboard.style.width='150px';
		}else if (hw<=300) {
			config.showBoardNotations=false;
		}
		//console.log(hw);
		this.updateCssPro('--cellhw',((hw/8)-16)+"px");

		
		var maxRowCol=8;
		var notationNum=8;
		var numNotations=['8','7','6','5','4','3','2','1'];

		for (var row = 0; row <maxRowCol; row++) {
			var tr=document.createElement('div');
			tr.style.marginTop="-2px";
			table.appendChild(tr);
			for (var icol = 0; icol <maxRowCol; icol++) {

				acol=this.aplhas[icol];
				ntrow=numNotations[row];
				var pieceName='no';
				var squareId=(acol+""+ntrow);
				//calculate the positions 
				if (config.position=='start') {
					pieceName=this.getInitialPos(ntrow,acol);
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
				this.memoryBank[squareId]=pieceName;
				
				
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
						notationHorizontal=this.aplhas[icol];
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
							if (config.isDraggable==true) {
								real_div.setAttribute("draggable",true);
							}
						}

						if (config.displayUnicodeSymbols==true) {
							this.updateCssPro("--wrook",uniCodeSym[pieceName]);
							//console.log(uniCodeSym[pieceName]);
						}

						if (config.imgSrc && config.imgSrc!="") {
							this.updateCssPro("--"+pieceName,"url('"+config.imgSrc+pieceName+".png')");
							//console.log(uniCodeSym[pieceName]);
						}

						if (config.animation==true) {
							real_div.className=pieceName+" cell animated bounceIn";	
						}else{
							real_div.className=pieceName+" cell";
						}
						
					}else{
						var real_div=document.createElement("div");
						real_div.setAttribute("draggable",false);
						if (config.animation==true) {
							real_div.className='cell animated';	
						}else{
							real_div.className='cell animated';	
						}
					}

					real_div.setAttribute("id",(acol+"_"+ntrow));
					if (config.lockMoves!=true) {
						real_div.onclick=function(e){
							squareId=e.target.id.split("_")[0]+""+e.target.id.split("_")[1];
							window.truechess.onCellTap(e.target.id,squareId);
						};
					}else{
						real_div.setAttribute("draggable",false);
					}
					
					if (config.showBoardNotations) {
						
						let span1=document.createElement("span");
						span1.innerHTML=notationVerticals;
						span1.style.color=this.getStyle(notationColor);
						span1.className="vnotations";
						let span2=document.createElement("span");
						span2.innerHTML=notationHorizontal;
						span2.style.color=this.getStyle(notationColor);
						span2.className="hnotations";
						real_div.appendChild(span1);
						real_div.appendChild(span2);
						//console.log(notationColor);
					}
				
				td.appendChild(real_div);
				tr.appendChild(td);
			}

		}
	},

	getInitialPos:function(row,col){

		let ptype = 'no'; //not occupied
		if (row==8 || row ==7) {
			ptype='b';
		}else if (row==1 || row ==2) {
			ptype='w';	
		}

		let algebricSqr= (col+""+row);

		//console.log(algebricSqr);

		//this is for rook
		if (algebricSqr=="a8" || algebricSqr=="h8" || algebricSqr=="a1" || algebricSqr=="h1") {
			return ptype+""+this.pieces[4];
		}

		//this is for knight
		if (algebricSqr=="b1" || algebricSqr=="b8" || algebricSqr=="g1" || algebricSqr=="g8") {
			return ptype+""+this.pieces[3];
		}

		//this is bishop
		if (algebricSqr=="c1" || algebricSqr=="c8" || algebricSqr=="f1" || algebricSqr=="f8") {
			return ptype+""+this.pieces[2];
		}

		//this is for queen
		if (algebricSqr=="d1" || algebricSqr=="d8") {
			return ptype+""+this.pieces[1];
		}

		//this if king
		if (algebricSqr=="e1" || algebricSqr=="e8") {
			return ptype+""+this.pieces[0];
		}

		//this if for pawn
		if (row==2 || row==7) {
			return ptype+""+this.pieces[5];	
		}else{
			return "no";
		}
		
	},
	cleanup:function(boardId){
		if (document.getElementById("table")) {
			document.getElementById("table").remove();	
		}
		this.createChessBoard(boardId,local_config);

	},animateView:function(viewId,animateClass){
		//console.log('animation of view '+viewId);
		let e=document.getElementById(viewId);
		//console.log(e.classList.contains(animateClass));
		if (e.classList.contains(animateClass)) {
			e.classList.remove(animateClass);
			setTimeout(function(){
				e.classList.add(animateClass);
			},50);
		}else{
			e.classList.add(animateClass);
		}
		setTimeout(function() {
			e.classList.remove(animateClass);
		}, 300);

	},onCellTap:function(eleId,squareId){
		this.animateView(eleId,'bounceIn');
		this.checkRule(squareId,eleId);
	},

	/**
		update the cell symbol
	**/
	udpateCell:function(eleId,data){
		document.getElementById(eleId).className=data;
	},
	isKingCheck:function(){

	},
	getPositions:function(){
		return this.memoryBank;
	},
	moves:{start:false,end:false,ptype:'na',squareId:-1,startEleId:'',endEleId:'',data:''},
	checkRule:function(squareId,eleId){
		let pieceName=this.memoryBank[squareId];
		
		if (pieceName!="no" && this.moves.start==false) {
			console.log('First tap at '+pieceName);
			this.moves.start=true;
			this.moves.end=false;
			this.moves.ptype=pieceName;  //store first position 
			this.moves.squareId=squareId;
			this.moves.startEleId=eleId;
			this.moves.data=document.getElementById(this.moves.startEleId).className;
			
			if (this.local_config.onDragStart) {
				this.local_config.onDragStart(eleId);
			}
		}else if (this.moves.end==false && this.moves.start==true) {
			console.log('second tap at '+pieceName);

			if (this.local_config.onDragStop) {
				this.local_config.onDragStop(eleId);
			}

			if (this.moves.ptype[0]==this.memoryBank[squareId][0]) {
				console.log('trying to capture own pieces');
				this.moves.start=false;
				return;
			}else if(pieceName=="wking" || pieceName=="bking"){
				console.log('Kind can not be captured');
				this.moves.start=false;
				return;
			}
			
			this.memoryBank[squareId]=this.moves.ptype;  //update position with last 
			this.memoryBank[this.moves.squareId]='no';
			this.moves.endEleId=eleId;

			if (this.moves.ptype[0]=="w" && this.memoryBank[squareId][0]=="b") {
				//capture move
				this.udpateCell(this.moves.startEleId,document.getElementById(this.moves.endEleId).className);
			}else{
				//no capture move
				this.udpateCell(this.moves.startEleId,"cell");
			}

			this.udpateCell(this.moves.endEleId,this.moves.data);

			if (this.local_config.isDraggable==true) {
				document.getElementById(this.moves.endEleId).setAttribute("draggable",true);
				document.getElementById(this.moves.startEleId).setAttribute("draggable",false);	
			}
			
			this.local_config.onPositionUpdate(this.moves.startEleId,this.moves.endEleId,this.moves.ptype);
			this.moves={start:false,end:true,ptype:'no',squareId:-1,startEleId:'',endEleId:'',data:''};
		}else {
			if (this.moves.start==false) {
				console.log('Not selected');
			}else{
				console.log('Invalid move, please check');
			}
			this.moves={start:false,end:true,ptype:'no',squareId:-1,startEleId:'',endEleId:'',data:''};
		}

	},
	isObject:function(obj){
    	return obj !== undefined && obj !== null && obj.constructor == Object;
	},
	//drag functions
	dragObj:{dragstart:'',dragend:''},
	dragOnCellTap:function(eleId,squareId,isStart){
		if (isStart && this.dragObj.dragstart!=squareId) {
			this.dragObj.dragstart=squareId;
			this.onCellTap(eleId,squareId);
		}else if(!isStart){
			this.dragObj.dragend=squareId;
			this.onCellTap(eleId,squareId);
		}
	},
	highLightBox:function(event,isShadow){
		if (event.target.id[1]=="_") {
			if (!isShadow) {
	  			console.log('remove border for '+event.target.id);
	  			event.target.style.boxShadow="none";	
	  		}else{
	  			event.target.style.boxShadow="0px 0px 2px 2px #ccc";	
	  		}
	  	}
	},
	addDrag:function(){
		//console.log(this);
		document.addEventListener("dragstart", function(event) {
		console.log('drag started ->'+event.target.id);
		window.truechess.dragOnCellTap(event.target.id,event.target.id[0]+""+event.target.id[2],true);
		});

		document.addEventListener("dragend", function(event) {
		  console.log('into dragend '+event.target.id);
		  if (event.target.id[1]=="_") {
		  		console.log('remove border for '+event.target.id);
		  		window.truechess.highLightBox(event,false);
		  }
		  	console.log(window.truechess.dragObj);
		  	window.truechess.dragObj={dragstart:'',dragend:''};
		});

		document.addEventListener("dragenter", function(event) {
		  console.log('drag enter over -> '+event.target.id);
		  if (event.target.id[1]=="_") {
		  		window.truechess.highLightBox(event,true);
		  }
		});

		document.addEventListener("dragover", function(event) {
		    event.preventDefault();
		});

		document.addEventListener("dragleave", function(event) {
			console.log('drag leave '+event.target.id);
			if (event.target.id[1]=="_") {
		  		window.truechess.highLightBox(event,false);
		  	}
		});

		document.addEventListener("drop", function(event) {
		  event.preventDefault();
		  console.log('into drop target '+event.target.id);
		  if (event.target.id[1]=="_") {
		  	window.truechess.dragOnCellTap(event.target.id,event.target.id[0]+""+event.target.id[2],false);
		  	console.log('finished '+event.target.id);
		  	window.truechess.highLightBox(event,false);
		  }
		});
	}
};
window['truechess']=truechess;