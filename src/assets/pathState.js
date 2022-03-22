 class PathCor{
    constructor() { 
        this.superior = null;
    }
    setSuperior(superior){ 
        this.superior = superior;
    }
    pathApplication(){}
    geHzVttLine(arr,index){   
        let ar = new Array();
        for (let i = index - 1; i >= 0; i--) {
            let cell = arr[i];
            if (cell.className === arr[index].className || cell.isBlank) { 
                ar.push(cell);
            } 
            if (!cell.isBlank) {
                break;
            }
        } 
        for (let i = index + 1; i < arr.length; i++) {
            let cell = arr[i];
            if (cell.className === arr[index].className || cell.isBlank) {
                ar.push(cell);
            }
            if (!cell.isBlank) {
                break;
            }
        }
        return ar
    }
    getBeeline (start, end , board) { 
        let startIndex;
        let endIndex;
        let arr;
        
        if (start.row === end.row) {
            startIndex = start.col;
            endIndex = end.col;
            arr = board[start.row];
        } else {
            startIndex = start.row;
            endIndex = end.row;
            arr = board.map(e => e[start.col]);
        }
       
        //判斷方向 
        return startIndex < endIndex ? arr.slice(startIndex, endIndex + 1) : arr.slice(endIndex, startIndex + 1).reverse()
    }
}
class BeelinePath extends PathCor{ 
    constructor(superior){
        super(superior);
    }
    pathApplication(path){  

        let prevHzLine = this.geHzVttLine( path.board[path.prev.row] , path.prev.col);  
        let prevVtLine = this.geHzVttLine( path.board.map(e => e[path.prev.col]),path.prev.row);
    
        if( prevHzLine.includes(path.curr) || prevVtLine.includes(path.curr)){ 
            return this.getBeeline(path.prev, path.curr,path.board)
        }else{   
            return this.superior.pathApplication(path,path.board)
        }
    }
}
class CornerlinePath extends PathCor{
    constructor(superior){
        super(superior);
    }
    pathApplication(path){  
        let prevHzLine = this.geHzVttLine( path.board[path.prev.row] , path.prev.col);  
        let currHzLine = this.geHzVttLine( path.board[path.curr.row] , path.curr.col);  
        let prevVtLine = this.geHzVttLine( path.board.map(e => e[path.prev.col]),path.prev.row);
        let currVtLine = this.geHzVttLine( path.board.map(e => e[path.curr.col]),path.curr.row);

        let cornerA ;
        let cornerB ;
        for (let cell of prevHzLine) {
            if (currVtLine.includes(cell) && cell.isBlank) {
                cornerA = cell;
                break;
            }
        } 
       
        for (let cell of prevVtLine) {
            if (currHzLine.includes(cell) && cell.isBlank) {
                cornerB = cell;
                break;
            }
        }

        let corner  = cornerA || cornerB
        if(corner){  
            return  this.getBeeline(path.prev, corner,path.board).concat( this.superior.getBeeline(corner, path.curr,path.board).slice(1))
        }else{    
            return this.superior.pathApplication(path,path.board)
        }
    }
}
class CornerArrPath extends PathCor{
    constructor(superior){
        super(superior);
    }
    pathApplication(path){  
        let prevHzLine = this.geHzVttLine( path.board[path.prev.row] , path.prev.col);  
        let currHzLine = this.geHzVttLine( path.board[path.curr.row] , path.curr.col);  
        let prevVtLine = this.geHzVttLine( path.board.map(e => e[path.prev.col]),path.prev.row);
        let currVtLine = this.geHzVttLine( path.board.map(e => e[path.curr.col]),path.curr.row);
        
        let cornerArrA ;
        let cornerArrB ;
     
        let prevFullLineA = path.board[path.prev.row] ;
        let currFullLineA = path.board[path.curr.row] ;
        for (let prevCell of prevHzLine) {
            if (!prevCell.isBlank) continue
            // target為線上目標的對點
            let target = currFullLineA[prevCell.col]  
            //判斷是否在目標連接線上
            if (currHzLine.includes(target)) {
                let index = target.col;
                //判斷是否直線互通 
                cornerArrA = [prevFullLineA[index], currFullLineA[index]];
                let beeline = this.getBeeline(prevFullLineA[index],  currFullLineA[index] , path.board);
                for (let cell of beeline) {
                    if (!cell.isBlank) {
                        cornerArrA = null;
                        break
                    }
                } 
            }
        }

        let prevFullLineB = path.board.map(e => e[path.prev.col]);
        let currFullLineB = path.board.map(e => e[path.curr.col]);
        for (let prevCell of prevVtLine) {
            if (!prevCell.isBlank) continue
            let target = currFullLineB[prevCell.row] 
            if (currVtLine.includes(target)) {
                let index = target.row;
                cornerArrB = [prevFullLineB[index], currFullLineB[index]];
                let beeline = this.getBeeline(prevFullLineB[index],  currFullLineB[index] , path.board);
                for (let cell of beeline) {
                    if (!cell.isBlank) {
                        cornerArrB = null;
                        break;
                    }
                } 
            }
        }

        let cornerArr = cornerArrA || cornerArrB;
        if(cornerArr){  
            return   this.getBeeline(path.prev, cornerArr[0] , path.board)
            .concat( this.getBeeline(cornerArr[0], cornerArr[1]  , path.board).slice(1) )
            .concat( this.getBeeline(cornerArr[1], path.curr  , path.board).slice(1) )
        }else{    
            return [];
        }
    }
}
export { BeelinePath ,CornerlinePath,CornerArrPath};