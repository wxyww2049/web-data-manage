import reader_tools
import jieba
from collections import defaultdict
word_counts = defaultdict(int)

for file_path in reader_tools.traverse_folder('data'):
    json_data = reader_tools.read_json(file_path)
    for item in json_data:
        if item['title'] == None:
            continue
        words = jieba.cut(item['title'])
        word_list = list(words)
        for word in word_list:
            word_counts[word] += 1

sorted_word_counts = sorted(word_counts.items(), key=lambda x: x[1],reverse=True)
keys = []
for word, cnt in sorted_word_counts:
  if cnt >= 1:
    keys.append(word)

with open('stopwords.txt', 'w',encoding='utf-8') as f:
    f.write('\n'.join(keys))