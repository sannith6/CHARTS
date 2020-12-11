import toml
import os
from pandas import DataFrame

directory = "C:/Users/anitha.singamsetti/Desktop/Automation of ES Alerts/detection-rules/rules/windows"

l1 = []
l2 = []

for filename in os.listdir(directory):
    # print(filename)
    l1.append(filename)
    pyproject = toml.load(directory +'/'+filename)
    # print(pyproject['rule']['query'])
    l2.append(pyproject['rule']['query'])
    
print(l1)
print("=========================")
print(l2)
df = DataFrame({'ES Alert Name': l1, 'ES Alert querry definition params': l2})
df.to_excel('test1.xlsx', sheet_name='Alerts list')