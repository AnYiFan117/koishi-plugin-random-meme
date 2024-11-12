import { Context, Schema, Session, h } from 'koishi';
import {searchStatus} from './douyuWorm';


export const name = 'random-meme'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

function makeMessage(result): h{
  if (result.isLive === 1){
    return (
      <>
        卧槽我的好大儿正在直播！
        <br/>
        {result.nickName}《{result.description}》
        <br/>
        刷新🔄失望😞刷新🔄难过😫刷新🔄心碎💔刷新🔄崩溃😭刷新🔄宝贝你来啦?💕🥰😘💖
      </>
    );
  }
  else if (result.isLoop === 1){
    return (
      <>
        卧槽里的，猪头肉在偷懒呢，只是在轮播
        <br/>
        {result.nickName}《{result.description}》
        <br/>
        欺骗😡失望😞欺骗😡失望😞欺骗😡失望😞欺骗😡失望😞欺骗😡欺骗😡失望
      </>
    );
  }
  else{
    return (
      <>
        卧槽里的，猪头肉在偷懒呢，连轮播都没有
        <br/>
        欺骗😡失望😞欺骗😡失望😞欺骗😡失望😞欺骗😡失望😞欺骗😡欺骗😡失望
      </>
    );
  }
  
}

async function searchMeme(Keyword: string, ctx: Context){
  try{
    const response = await ctx.http.post('https://dgq63136.icu:9090/machine/Query',{
      "QueryBarrage": Keyword,
    })
    // const response = await http.get('https://dgq63136.icu:9090/machine/Query')
    if(response.data && response.code==="200"){
      const data: any[] = response.data
      if(data.length>0){
        //随机返回一条
        const index = Math.floor(Math.random() * data.length)
        return data[index].barrage
      }
      else{
        return "没有找到"
      }
    }
    else{
      console.log(response.data)
      return "获取失败"
    }
  }catch(error){
    console.log(error)
    return "获取失败"
  }
}


async function fetchRandomMeme(ctx: Context){
  try{
    const response = await ctx.http.get('https://dgq63136.icu:9090/machine/getRandOne')
    if(response.data && response.code==="200"){
      const barrage = response.data.barrage
      return barrage
    }
    else{
      console.log(response.data)
      return "获取失败"
    }
  }catch(error){
    console.log(error)
    return "获取失败"
  }
}

export function apply(ctx: Context) {

  
  ctx.command("随机烂梗")
  .usage("随机返回一个烂梗")
  .example("@bot 随机烂梗")
  .alias("随机")
  .action(async ()=>{
    const barrage = await fetchRandomMeme(ctx)
    return barrage
  })

  
  ctx.command("来点烂梗 <keyword>", "搜索keyword关键词的烂梗")
  .usage("输入想搜索的关键词即可")
  .example("@bot 来点烂梗 NIKO")
  .alias("搜索", "搜索烂梗","烂梗")
  .action(async ({session},keyword)=>{
    if(!keyword){
      await session.send("请输入搜索关键词")
      keyword = await session.prompt()
    }
    const data = await searchMeme(keyword, ctx)
    return data
  })

  ctx.command("查询猪头肉开播状态")
  .usage("返回6657开播情况")
  .example("@bot 查询猪头肉开播状态")
  .alias("查询", "开播状态")
  .action(async ({session}) =>{
    const result = await searchStatus()
    console.log(result)
    if(result.haserror === 0){
      makeMessage(result)
    }
    else{
      return "查询失败"
    }
  })
  // write your plugin here
}
