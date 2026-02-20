const fs = require("fs");
//const prettifyJSON = require('prettify-json').;

class DB{
    db_obj = {};
    filepath = "";
    defaultValue = undefined;
    constructor(_path, _defaultVal){
        this.filepath = _path;
        this.defaultValue = _defaultVal;
        if(!fs.existsSync(this.filepath)) this.Save();
        this.db_obj = JSON.parse(fs.readFileSync(this.filepath)+"");
    }
    Get(key){
        if(!this.db_obj[key]) return this.defaultValue;
        return this.db_obj[key];
    }
    Save(){
        fs.writeFileSync(this.filepath, JSON.stringify(this.db_obj));
    }
    Set(key, value){
        this.db_obj[key] = value;
        this.Save();
    }
    Update(key, valueFunc){
        this.Set(key, valueFunc(this.Get(key)));
    }
    UpdateAll(valueFunc=(key, value)=>{}){
        Object.entries(this.db_obj).forEach(([k, v])=>{
            this.Set(k, valueFunc(k, v));
        });
    }
}

exports.DB = DB;