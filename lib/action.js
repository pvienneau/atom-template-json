'use babel';

class Action{
    constructor(){
        this.name = false;
        this.arguments = [];
    }

    getAction(){
        const actionObject = {
            name: this.name,
            arguments: this.arguments,
        };

        this.clear();

        return actionObject;
    }

    hasAction(action = false){
        if (!action) return !!this.name;

        return this.name === action;
    }

    setAction(action, ...args){
        this.clear();

        cleanedArgs = args.map(arg => isNaN(parseInt(arg))?arg:parseInt(arg));

        this.name = action;
        this.arguments = cleanedArgs;
    }

    clear(){
        this.name = false;
        this.arguments = [];
    }
}

export default Action;
