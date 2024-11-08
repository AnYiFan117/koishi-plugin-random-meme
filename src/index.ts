import { Context, Schema, Session } from 'koishi'
import Undios from '@cordisjs/plugin-http'

export const name = 'random-meme'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

const http = new Undios()

async function searchMeme(Keyword: string){
  try{
    const response = await http.post('https://dgq63136.icu:9090/machine/Query',{
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
    if (error==="undefined"){
      return "请输入搜索关键词"
    }
    return "获取失败"
  }
}


async function fetchRandomMeme(){
  try{
    const response = await http.get('https://dgq63136.icu:9090/machine/getRandOne')
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
    const barrage = await fetchRandomMeme()
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
    const data = await searchMeme(keyword)
    return data
  })

  
  // write your plugin here
}
