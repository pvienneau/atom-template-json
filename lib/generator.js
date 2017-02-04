'use babel'

class Generator{
    constructor(){

    }

    _isJSON(str){
        try{
            JSON.parse(str)
        }catch(e){
            return false;
        }
        return true;
    }

    generateJSON(str){
        return this._isJSON(str)?str:false;
    }
}

export default Generator;
