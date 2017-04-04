'use babel';

class ActionManager{
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

        this.name = action;

        if (args.length) this.addArguments(...args);
    }

    addArguments(...args) {
        if (!args) return false;

        const cleanedArgs = args.map(arg => isNaN(parseInt(arg))?arg:parseInt(arg));

        this.arguments.push(...cleanedArgs);
    }

    clear(){
        this.name = false;
        this.arguments = [];
    }
}

export default ActionManager;
