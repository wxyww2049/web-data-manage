import os
import json
import pymysql
import reader_tools


def insert_to_database(json_data, cursor):
    for item in json_data:
        sql = "insert into nowcoder_interview (url, title, content) values (%s, %s, %s)"
        cursor.execute(sql, (item['url'], item['title'], item['content']))

def main():
    cnx = pymysql.connect(
        host='localhost',
        port=3306,
        user='root',  
        password='2049500915', 
        database='web_data_manage' 
    )
    cursor = cnx.cursor()
    folder_path = 'data' 
    for file_path in reader_tools.traverse_folder(folder_path):
        json_data = reader_tools.read_json(file_path)
        insert_to_database(json_data, cursor)

    cnx.commit()
    cursor.close()
    cnx.close()

if __name__ == "__main__":
    main()
