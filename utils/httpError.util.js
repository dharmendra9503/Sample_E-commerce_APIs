const httpError=(e,statusCode)=>{
    let error=null
    if(typeof e==='string'){
        error=new Error(e)
    }
    else if(e.message){
        error=new Error(e.message)

    }
    else{
        error=new Error(e.toString())
    }
    error.staus=statusCode||null;
    return error
}

module.exports=httpError;