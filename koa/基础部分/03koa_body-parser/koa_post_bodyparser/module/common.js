/**
 * Created by Administrator on 2018/3/13 0013.
 */


exports.getPostData=function(ctx){
    //��ȡ����  �첽
    return new Promise(function(resolve,reject){
           try{
               let str='';
               ctx.req.on('data',function(chunk){
                   str+=chunk;
               })

               ctx.req.on('end',function(chunk){

                   resolve(str)
               })

           }catch(err){
                reject(err)
           }

    })

}