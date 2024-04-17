import json
from fetchData import get_connection

# 查询公司出现频率
def query_count_company():
  db = get_connection()
  cursor = db.cursor()
  cursor.execute("select * from company_fre")
  tmp = cursor.fetchall()
  cursor.close()
  db.close()
  return tmp

# 查询岗位出现频率
def query_count_position():
  db = get_connection()
  cursor = db.cursor()
  cursor.execute("select * from position_fre")
  tmp = cursor.fetchall()
  cursor.close()
  db.close()
  
  return tmp

# 查询技术栈出现频率
def query_count_stack():
  db = get_connection()
  cursor = db.cursor()
  cursor.execute("select * from stacks_fre")
  tmp = cursor.fetchall()
  cursor.close()
  db.close()
  
  return tmp

# 查询类型出现频率
def query_count_type():
  db = get_connection()
  cursor = db.cursor()
  cursor.execute("select * from types_fre")
  tmp = cursor.fetchall()
  cursor.close()
  db.close()
  
  return tmp

# 分公司查询各种面试的占比
def query_types_company(company_name):
  db = get_connection()
  cursor = db.cursor()
  sql = "select frequency as rate,company,type from types_by_company where company = (%s)"
  cursor.execute(sql,(company_name))
  tmp = cursor.fetchall()
  cursor.close()
  db.close()
  
  return tmp

# 查询大分类的技术栈占比
def query_type():
  db = get_connection()
  cursor = db.cursor()
  cursor.execute("select sum(SF.frequency) as num,S.type as name from stacks_fre as SF join tec_stacks as S on SF.stack_id = S.id GROUP BY S.type")
  tmp = cursor.fetchall()
  cursor.close()
  db.close()
  
  return tmp

# 分岗位查询各种面试的占比
def query_types_position(_type):
  db = get_connection()
  cursor = db.cursor()
  sql = "select frequency  as rate,position,type from types_by_position where type=(%s)"
  cursor.execute(sql,(_type))
  tmp = cursor.fetchall()
  cursor.close()
  db.close()
  
  return tmp

# 分岗位查询各种技术栈的占比
def query_stacks_position(position):
  db = get_connection()
  cursor = db.cursor()
  sql = "select * from stacks_by_position where stack = (%s) order by position"
  cursor.execute(sql,(position))
  tmp = cursor.fetchall()
  cursor.close()
  db.close()
  
  return tmp

# 检索面经
def query_interviews(handle):
  db = get_connection()
  cursor = db.cursor()
  sql = "SELECT id,title,url from nowcoder_interview WHERE title like (%s) or content like (%s)"
  cursor.execute(sql,('%' + handle + '%','%' + handle + '%'))
  tmp = cursor.fetchall()
  cursor.close()
  db.close()
  
  return tmp

def get_interview_by_id(id):
  db = get_connection()
  cursor = db.cursor()
  sql = "SELECT title,content from nowcoder_interview WHERE id = (%s)"
  cursor.execute(sql,(id))
  tmp = cursor.fetchall()
  cursor.close()
  db.close()
  
  return tmp

if __name__ == '__main__':
  print(query_interviews('前端'))
  