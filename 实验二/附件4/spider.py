import csv
import requests
from fake_useragent import UserAgent
from lxml import etree
from requests import RequestException
import pandas as pd
from urllib.parse import unquote
import os
import json
import logging
logging.basicConfig(level=logging.ERROR,
        # 将日志信息打印到文件中（文件不存在可自动创建），设置该文件的使用权限
        filename="./log.txt",
        filemode="a",
        # 设置输出格式，年月日分秒毫秒，行数，等级名，打印的信息
        format="%(asctime)s - %(filename)s[line:%(lineno)d] - %(levelname)s: %(message)s")

rawCookie =f'supportwebp=true; supportWebp=true; _csrfToken=gXP111eOsmv0AxDq9svZ3vbSFY8CmmDPmY8TGrfg; traffic_utm_referer=; _yep_uuid=64d2be79-e1b0-5fef-3789-72e9e65138a1; newstatisticUUID=1712835459_140962119; fu=81185208; e1=%7B%22l6%22%3A%22%22%2C%22l1%22%3A3%2C%22pid%22%3A%22qd_p_qidian%22%2C%22eid%22%3A%22qd_A18%22%7D; e2=%7B%22l6%22%3A%22%22%2C%22l1%22%3A8%2C%22pid%22%3A%22qd_p_qidian%22%2C%22eid%22%3A%22qd_A103%22%7D; trkf=1; w_tsfp=ltvgWVEE2utBvS0Q6KjukE+mEj87Z2R7xFw0D+M9Os09AqsiW5qF0IR+uNfldCyCt5Mxutrd9MVxYnGDXtUseRERQs6Tb5tH1VPHx8NlntdKRQJtA5iOWV8cdr997zFFfDkPdEC1iWl/LIISnONniFgIu3An37ZlCa8hbMFbixsAqOPFm/97DxvSliPXAHGHM3wLc+6C6rgv8LlSgWyEtBu/eRlhAcxD0Eab1iEeD38k9BPNc+FVNRmvJcytTe9Gvy/hk2upNdLxiEox60I3sB49AtX02TXKL3ZEIAtrZViygr4ke66rNuYluTEZXL5TWwpN/FxC9qdk605dXC+5YiTcDa8v4QAEQqAK+sWteHrE0Mu+dA1d644mx18l9g=='
ua = UserAgent()
headers = {
    'User-Agent': ua.random,
    'Cookie':unquote(rawCookie)
}

parser = etree.HTMLParser()
urls = []

def getUrlsForOnePage(num):
    url = "https://www.qidian.com/free/all/page"+str(num)+"/"
    response = requests.get(url, headers=headers)
    response.encoding = 'utf-8'
    content = response.text


    tree = etree.fromstring(content, parser)
    books=tree.xpath('//div[@class="book-mid-info"]')


    for book in books:
        urls.append(getOneBook(book.xpath('.//a')[0].get('href')))

def getIndexOfChapters():
    for i in range(1, 6):
        getUrlsForOnePage(i)
    with open('urls.json', 'w',encoding='utf-8') as f:
        f.write(urls.__str__())


def getOneBook(url):
    book = {}
    response = requests.get("https:"+url, headers=headers)
    response.encoding = 'utf-8'
    content = response.text
    tree = etree.fromstring(content, parser)
    bookName = tree.xpath('//h1[@id="bookName"]')[0]
    book['name'] = bookName.text
    book['url'] = url

    # 获取章节列表
    chaptersHtml = tree.xpath('//a[@class="chapter-name"]')
    # 遍历章节列表

    chapters = []
    for chapter in chaptersHtml:
        chapterName = chapter.text
        chapterUrl = chapter.get('href')
        chapters.append({'name': chapterName, 'url': chapterUrl})
        # print(chapterName)
    book['chapters'] = chapters
    return book


def handlepath(path):
    return path.replace(':', '').replace('*', '').replace('?', '').replace('"', '').replace('<', '').replace('>', '').replace('|', '').replace('/', '').replace('\\', '')
    
def downloadBook(book):
    path = "./books/"+book['name']
    if not os.path.exists(path):
        os.makedirs(path)

    with open(path+'/index.json', 'w',encoding='utf-8') as f:
        f.write(json.dumps(book, ensure_ascii=False))

    for chapter in book['chapters']:
        try:
            response = requests.get("https:"+chapter['url'], headers=headers)

            response.encoding = 'utf-8'
            content = response.text
            
            
            tree = etree.fromstring(content, parser)
            chapterContent = tree.xpath('//main')[0]
            chapterContent = chapterContent.xpath('.//p')
            priContent = ''
            for p in chapterContent:
                priContent += str(p.text) + '\n'        
            # print(priContent)
            with open(path+'/'+handlepath(chapter['name'])+'.txt', 'w',encoding='utf-8') as f:
                f.write(priContent)
        except RequestException as e:
            logging.error(e)
            logging.error(book['name']+"----"+chapter['name'])


def test():
    response = requests.get("https://www.qidian.com/chapter/1039391177/788052622/", headers=headers)
    response.encoding = 'utf-8'
    content = response.text
    with open('chapter.html', 'w',encoding='utf-8') as f:
        f.write(content)
    print(content)


if __name__ == '__main__':
    # test()
    # 获取章节索引
    getIndexOfChapters()

    # 下载书籍
    with open('urls.json', 'r',encoding='utf-8') as f:
        urls = f.read()
    books = json.loads(urls)
    print("请输入开始下载的书籍序号：")
    be = input()
    be = int(be)
    cnt = be
    tot = books.__len__()
    for i in range(be - 1,tot):
        book = books[i]
        try:
            print("开始下载：第"+str(cnt)+"/" + str(tot) + "本书:  "+book['name'])
            downloadBook(book)
            cnt += 1
        except RequestException as e:
            logging.error(e)
            logging.error(book['name'])
            continue
