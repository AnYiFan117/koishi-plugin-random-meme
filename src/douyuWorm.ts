import axios from 'axios'
import * as cheerio from 'cheerio'
import { json } from 'stream/consumers'


const url = "https://www.douyu.com/search?kw=6657"
const cookie = "dy_did=23217543cc5c1c8ceb7a810f00031701; Hm_lvt_e99aee90ec1b2106afe7ec3b199020a7=1731312451; HMACCOUNT=AD0157964DE9B9D0; _ga=GA1.1.763672242.1731312453; _clck=3criod%7C2%7Cfqs%7C0%7C1776; dy_auth=15d4F0hIGZn6Pn8D44hgg2KoEN8nYIo%2BhZqNjgv%2F6GBrTNVN2xb0c1vZSWfGxvyoixKNXLlsx19bsVlKL7yGzwD%2BvsdAC5QOedGI5BWHolompxmioc5XOUw; wan_auth37wan=03bba1fdef57RB9Qn3GdLPDbj8vLUAfPZzVKESjKDb%2FVZIXCqflpdtUL1a91sivCc7st0la1PW8Dz2fpctK60SwX966vX1taIOnECnzN92IIkdcQuxg; dy_teen_mode=%7B%22uid%22%3A%22138011103%22%2C%22status%22%3A0%2C%22birthday%22%3A%22%22%2C%22password%22%3A%22%22%7D; post-csrfToken=922a2f4d8b5317ca8d9eb3; msg_auth=a97a88cbc4e83c21efb2cd37c8f8f8e67bd4cf7d; msg_uid=1VwKPPDE9d4l; acf_jwt_token=eyJhbGciOiJtZDUiLCJ0eXAiOiJKV1QifQ.eyJjdCI6MCwiaWF0IjoxNzMxMzEyNTIxLCJhdWQiOlsiZHkiXSwibHRraWQiOjE5MTM3OTM5LCJiaXoiOjkzLCJ1aWQiOjEzODAxMTEwMywiZXhwIjoxNzMxOTE3MzIxLCJzdWIiOiJzdCIsImtleSI6ImR5LWp3dC1tZDUiLCJzdGsiOiI2NzkwZTUzNzE1NjBiZGZiIn0.MzI0OTk0YWVlZTE5ZTg4Zjc5ODVkZDY4NzczZDJlNjY; acf_dmjwt_token=eyJhbGciOiJtZDUiLCJ0eXAiOiJKV1QifQ.eyJjdCI6MCwiaWF0IjoxNzMxMzEyNTIxLCJhdWQiOlsiZG0iXSwibHRraWQiOjE5MTM3OTM5LCJiaXoiOjkzLCJ1aWQiOjEzODAxMTEwMywiZXhwIjoxNzMxOTE3MzIxLCJzdWIiOiJzdCIsImtleSI6ImR5LWp3dC1tZDUiLCJzdGsiOiI2NzkwZTUzNzE1NjBiZGZiIn0.ZDIzMzIxYzRiZGU2YWFkYmRkMjBkNjg4YWQwYTE0NTQ; _ga_7RMFJRR7D2=GS1.1.1731317144.2.0.1731317144.60.0.1543191493; msgUnread=0; _ga_5JKQ7DTEXC=GS1.1.1731316604.2.1.1731318071.60.0.167901092; Hm_lpvt_e99aee90ec1b2106afe7ec3b199020a7=1731318072; _clsk=u5wq7a%7C1731318072227%7C6%7C0%7Ce.clarity.ms%2Fcollect"


export async function searchStatus(){
    try{
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
            },
        })

        const html = response.data
        const $ = cheerio.load(html)

        const scriptContent = $('script').toArray().map(s => $(s).html()).join('\n');
        const mainDataMatch = scriptContent.match(/\$mainData\s*=\s*(\{.*?\});/s);

        // console.log(mainDataMatch)
        
        if (mainDataMatch) {
            const mainDataJSON = JSON.parse(mainDataMatch[1])
            const isLive = mainDataJSON.rec?.videoAnchor?.isLive
            const nickName = mainDataJSON.rec?.videoAnchor?.nickName
            const isLoop = mainDataJSON.rec?.videoAnchor?.isLoop
            const description = mainDataJSON.rec?.videoAnchor?.description
            
            return {
                haserror: 0,
                isLive,
                nickName,
                isLoop,
                description
            }
        }

        // fs.writeFileSync('debug.html', $.html(), 'utf-8')
        
        // const results: any[] = []

        
    } catch (error) {
        return {
            haserror: 1,
            error: error.message
        }
    }
}