import { Context, Schema } from 'koishi'
import Undios from '@cordisjs/plugin-http'

export const name = 'random-meme'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

const http = new Undios()


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

  ctx.command("随机烂梗").action(async ()=>{
    const barrage = await fetchRandomMeme()
    return barrage
  })
  // write your plugin here
}
