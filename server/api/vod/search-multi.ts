import {XMLBuilder, XMLParser, XMLValidator} from "fast-xml-parser"

const vodApiEndpoints = [
    {
        "key": "ikunzy",
        "name": "爱坤联盟资源网",
        "api": "https://api.apilyzy.com/api.php/provide/vod/?ac=list",
        "playUrl": "https://player.77lehuo.com/aliplayer/?url=",
        "type": "json"
    }
]

export default defineEventHandler(async (event) => {

    try {
        let query: any = getQuery(event)
        const requests = vodApiEndpoints.map(async (endpoint) => {
            try {
                const res: any = await $fetch(endpoint.api, {
                    method: 'GET',
                    query: query
                });
                if (endpoint.type === 'xml') {
                    const parser = new XMLParser();
                    let jObj = parser.parse(res);
                    return jObj
                }
                if(typeof res === 'string'){
                    return JSON.parse(res)
                }
                return res
            } catch (e) {
                console.log(e)
                return []
            }
        })

        // 等待所有请求完成
        const results = await Promise.all(requests);

        let resultsData: any = []
        results.forEach((item: any) => {
            resultsData = resultsData.concat(item)
        })
        // 返回所有请求的结果数组
        return {
            code: 200,
            msg: 'success',
            data: resultsData
        };
    } catch (e) {
        console.log(e)
        return {
            code: 500,
            data: e,
            msg: 'error'
        }
    }
})
