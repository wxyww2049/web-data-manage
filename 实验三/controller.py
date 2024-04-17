from flask import Flask, request, jsonify
from flask_cors import CORS
from mapper import query_count_company, query_count_position, query_count_stack, query_count_type, query_types_company,get_interview_by_id, query_type, query_types_position, query_stacks_position, query_interviews
from gpt_tools import query_gpt
import json
app = Flask(__name__)
CORS(app)
@app.route('/count_company', methods=['GET'])
def count_company():
    return jsonify(query_count_company())

@app.route('/count_position', methods=['GET'])
def count_position():
    return jsonify(query_count_position())

@app.route('/count_stack', methods=['GET'])
def count_stack():
    return jsonify(query_count_stack())

@app.route('/count_type', methods=['GET'])
def count_type():
    return jsonify(query_count_type())

@app.route('/types_company', methods=['GET'])
def types_company():
    company_name = request.args.get('company_name')
    return jsonify(query_types_company(company_name))

@app.route('/type', methods=['GET'])
def big_type():
    return jsonify(query_type())

@app.route('/types_position', methods=['GET'])
def types_position():
    types = request.args.get('types')
    types = types.split(',')
    ret = {}
    for i in types:
        ret[i] = query_types_position(i)
    return jsonify(ret)
@app.route('/stacks_position', methods=['GET'])
def stacks_position():
    positions = request.args.get('position')
    position = positions.split(',')
    # print(position)
    ret = {}
    for i in position:
        # print(i)
        ret[i] = query_stacks_position(i)
    return jsonify(ret)

@app.route('/interviews', methods=['GET'])
def interviews():
    handle = request.args.get('handle')
    return jsonify(query_interviews(handle))

@app.route('/summary_interview', methods=['GET'])
def summary_interview():
    id = request.args.get('id')
    tmp = get_interview_by_id(id)
    
    tmp['summary'] = query_gpt("帮我写出下面这篇面经的总结，直接写总结，不要说好的\n" + json.dumps(tmp))
    return jsonify(tmp)

@app.route('/word_cloud', methods=['GET'])
def word_cloud():
  company = query_count_company()
  position = query_count_position()
  stack = query_count_stack()
  _type = query_count_type()
  word = []
  for i in company:
    word.append({"name":i['name'],"value":i['frequency']})
  for i in position:
    word.append({"name":i['position'],"value":i['frequency']})
  for i in stack:
    word.append({"name":i['name'],"value":i['frequency']})
  for i in _type:
    word.append({"name":i['name'],"value":i['frequency']})
  sort_word = sorted(word,key=lambda x:x['value'],reverse=True)
  return jsonify(sort_word)
if __name__ == '__main__':
    app.run(port=5000)