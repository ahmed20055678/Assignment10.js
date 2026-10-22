const {client}=require('../common/connection.redis')

const setValue=async({key,value,ttl})=>{
    try{
        value =typeof value=="string" ?value:JSON.stringify(value)
        ttl? 
        await client.set(key,value,{EX:ttl})
        :await client.set(key,value)
    }catch(error){
        console.log("redis not true")
    }
}

const update=async({key,value,ttl})=>{
    try{
        if(! await client.exists(key)){
            return 0
        }

        await client.set(key,value,{EX:ttl})
    }catch(error){
        console.log("redis not true")
    }
}

const getvalue = async (key) => {
    try {
        const value = await client.get(key);

        if (value === null) {
            return null;
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }

    } catch (error) {
        console.log("redis not true", error);
        return null;
    }
};

const ttl=async(key)=>{
    try{
        return await client.ttl(key)
    }catch(error){
        console.log("redis not true")
    }
}

const exists=async(key)=>{
    try{
        await client.exists(key)
    }catch(error){
        console.log("redis not true")
    }
}

const expier=async({key,ttl})=>{
    try{
        await client.expire(key,ttl)
    }catch(error){
        console.log("redis not true")
    }
}

const deleteKey=async(key)=>{
    try{
        if(!key?.lenght){
            return 0
        }
        await client.del(key)
    }catch(error){
        console.log("redis not true")
    }
}

const keys=async(key)=>{
    try{
        await client.keys(`${key}*`)
    }catch(error){
        console.log("redis not true")
    }
}


const incr=async(key)=>{
    try{
        await client.incr(key)
    }catch(error){
        console.log("redis not true")
    }
}
module.exports={setValue,update,keys,incr,deleteKey,expier,exists,ttl,getvalue}