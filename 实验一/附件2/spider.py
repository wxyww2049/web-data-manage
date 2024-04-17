import requests
import json
from bs4 import BeautifulSoup
import html2text
import re
ids=[]
uuids=[]
cannotFindPapers=[]
papers=[]
def getId(pagenum):
    url = 'https://gw-c.nowcoder.com/api/sparta/job-experience/experience/job/list'
    payload = {
        "companyList":[],
        "jobId":-1,
        "level":1,
        "order":3,
        "page":pagenum
    }
    headers = {
        'Content-Type': 'application/json',
    }
    response = requests.post(url, data=json.dumps(payload), headers=headers)

    try:
        if response.status_code == 200:
            data = response.json()
            for item in data['data']['records']:
                if item['contentType'] == 250:
                    ids.append(item['contentData']['id'])
                elif item['contentType'] == 74:
                    uuids.append(item['momentData']['uuid'])
                else:
                    print('未知类型',item['contentType'])
        else:
            print('请求失败',response.json(),str(pagenum))
    except Exception as e:
        with open('ids.json','w',encoding='utf-8') as f:
            f.write(json.dumps(ids,indent=4,ensure_ascii=False))
        with open('uuids.json','w',encoding='utf-8') as f:
            f.write(json.dumps(uuids,indent=4,ensure_ascii=False))
        print(e)
        print('POST请求失败(格式错误)'+str(pagenum))
def getAllIds():
    for i in range(1, 251):
        print(i)
        getId(i)
    with open('ids.json','w',encoding='utf-8') as f:
        f.write(json.dumps(ids,indent=4,ensure_ascii=False))
    with open('uuids.json','w',encoding='utf-8') as f:
        f.write(json.dumps(uuids,indent=4,ensure_ascii=False))


def getIdsByfile():
    with open('ids.json','r',encoding='utf-8') as f:
        data = json.loads(f.read())
    return data
def getUuidsByfile():
    with open('uuids.json','r',encoding='utf-8') as f:
        data = json.loads(f.read())
    return data


# 将带标签的文本转化成可读性更好的文本
def convertHtmlToText(html_content):
    return html2text.html2text(html_content)

def getPaperById(id):
    url = f"https://gw-c.nowcoder.com/api/sparta/detail/content-data/detail/{id}?_=1711816007385"
    
    response = requests.get(url)
    
    try:
        if response.status_code == 200:
            data=response.json()
            # print(convertHtmlToText(data['data']['content']))
            papers.append({"url":f"https://www.nowcoder.com/discuss/{id}?sourceSSR=users","title":data['data']['title'],"content":convertHtmlToText(data['data']['content'])})
        else:
            print('请求失败',response.json(),id)
            cannotFindPapers.append(id)
    except Exception as e:
        print(e)
        print('GET请求失败(格式错误)',id)
        cannotFindPapers.append(id)
        
def getPaperByUuid(uuid):
    url = f"https://www.nowcoder.com/feed/main/detail/{uuid}?sourceSSR=users"
    print(url)
    response = requests.get(url)
    try:
        if response.status_code == 200:
            data=response.text
            soup = BeautifulSoup(data,'html.parser')
            content = soup.find_all('div',class_='feed-content-text tw-text-gray-800 tw-mb-4 tw-break-all')
            # print(html2text.html2text(str(content[0])))
            title = soup.find_all('title')
            # print(html2text.html2text(str(title[0])))
            papers.append({"url":url,"title":title[0].text,"content":html2text.html2text(str(content[0]))})
            # print({"url":url,"title":title[0].text,"content":html2text.html2text(str(content[0]))})
            # print(content.text)
    except Exception as e:
        print(e)
        print('GET请求失败(格式错误)',uuid)
        cannotFindPapers.append(uuid)
        
def getIdpapers():
    ids = getIdsByfile()
    for i in range(0,len(ids)):
        print(i)
        getPaperById(ids[i])
        if((i+1) % 100 == 0):
            global papers
            with open(f'papers{(i+1)/100}.json','w',encoding='utf-8') as f:
                f.write(json.dumps(papers,indent=4,ensure_ascii=False))
            papers=[]
        # break
    with open(f'papers{int((i+1)/100)}.json','w',encoding='utf-8') as f:
        f.write(json.dumps(papers,indent=4,ensure_ascii=False))
    papers=[]
    global cannotFindPapers
    with open('cannotFindPapers.json','w',encoding='utf-8') as f:
        f.write(json.dumps(cannotFindPapers,indent=4,ensure_ascii=False))
    cannotFindPapers=[]


def getUuidpapers():
    uuids = getUuidsByfile()
    for i in range(0,len(uuids)):
        print(i)
        getPaperByUuid(uuids[i])
        # break
        if((i+1) % 100 == 0):
            global papers
            with open(f'papers{(i+1)/100 + 50}.json','w',encoding='utf-8') as f:
                f.write(json.dumps(papers,indent=4,ensure_ascii=False))
            papers=[]
        # break
    with open(f'papers{int((i+1)/100) + 50}.json','w',encoding='utf-8') as f:
        f.write(json.dumps(papers,indent=4,ensure_ascii=False))
    papers=[]
    global cannotFindPapers
    with open('cannotFindPapers2.json','w',encoding='utf-8') as f:
        f.write(json.dumps(cannotFindPapers,indent=4,ensure_ascii=False))
    cannotFindPapers=[]


def main():
    # getAllIds()
    getIdpapers()
    getUuidpapers()
    
if __name__ == '__main__':
    main()