import pymysql
import json
import jieba
from collections import defaultdict

def get_connection():
  connection = pymysql.connect(
    host='localhost',
    user='root',
    password='2049500915',
    database='web_data_manage',
    cursorclass=pymysql.cursors.DictCursor
  )
  return connection
connection = get_connection()
cursor = connection.cursor()
page = 1
pageSize = 10

def fetch_data():
  cursor.execute('SELECT count(1) FROM nowcoder_interview')
  totalPage = int((cursor.fetchone()['count(1)']  + 9)/ pageSize)
  print(totalPage)

  for i in range(totalPage):
    cursor.execute('SELECT * FROM nowcoder_interview limit %s, %s', (i * pageSize, pageSize))
    result = cursor.fetchall()
    for i in result:
      yield i


def init_words_title():
  word_counts = defaultdict(int)
  for i in fetch_data():
    words = jieba.cut(i['title'])
    if i['title'] == None:
      continue
    word_list = list(words)
    for word in word_list:
      word_counts[word] += 1
  sorted_word_counts = sorted(word_counts.items(), key=lambda x: x[1],reverse=True)
  words = []
  for word,cnt in sorted_word_counts:
    words.append(word)
  with open('words_title.txt', 'w',encoding='utf-8') as f:
    f.write('\n'.join(words))
  
def init_company():
  with open('company.json', 'r',encoding='utf-8') as f:
    company = json.load(f)
    for i in company:
      cursor.execute("insert into company(name) values (%s)", (i,))
    cursor.connection.commit()
  

def company_peper():
  cursor.execute("select * from company")
  companys = cursor.fetchall()
  for i in fetch_data():
    for company in companys:
      if i['title'] == None:
        continue
      if company['name'] in i['title']:
        cursor.execute("insert into company_paper(company_id, paper_id) values (%s, %s)", (company['id'], i['id']))
  cursor.connection.commit()


# 初始化技术栈与面经的联系
def init_stacks_paper():
  cursor.execute("select * from tec_stacks")
  stacks = cursor.fetchall()
  for i in fetch_data():
    for stack in stacks:
      if (i['title'] != None and stack['handles'] in i['title']) or (i['content'] != None and stack['handles'] in i['content']):
        cursor.execute("insert into stacks_paper(stack_id, paper_id) values (%s, %s)", (stack['id'], i['id']))
  cursor.connection.commit()

# 初始化类型与面经的联系
def init_types_paper():
  cursor.execute("select * from types")
  types = cursor.fetchall()
  for i in fetch_data():
    for _type in types:
      if (i['title'] != None and _type['name'] in i['title']) or (i['content'] != None and _type['name'] in i['content']):
        cursor.execute("insert into types_paper(types_id, paper_id) values (%s, %s)", (_type['id'], i['id']))
  cursor.connection.commit()

# 初始化岗位与面经的关系
def init_positon_paper():
  cursor.execute("select * from position")
  positions = cursor.fetchall()
  for i in fetch_data():
    for position in positions:
      if (i['title'] != None and position['position'] in i['title']) or (i['content'] != None and position['position'] in i['content']):
        cursor.execute("insert into position_paper(position_id, paper_id) values (%s, %s)", (position['id'], i['id']))
  cursor.connection.commit()
  


# 数据库初始化时运行
if __name__ == '__main__':
  # init_words_title()
  # init_company()
  # company_peper()
  # init_stacks_paper()
  # init_types_paper()
  # init_positon_paper()
  init_words()