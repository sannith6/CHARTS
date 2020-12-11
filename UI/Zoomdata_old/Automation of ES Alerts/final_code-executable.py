
from __future__ import nested_scopes
from itertools import product
import re
import pandas as pd
import xlrd
from pandas import ExcelWriter
import xlsxwriter
import snowflake.connector
# pd.set_option('display.max_rows', None)
# pd.set_option('display.max_columns', None)
# pd.set_option('display.width', None)
# pd.set_option('display.max_colwidth', -1)

def read_excel(path_to_file, sheet_name):

    df = pd.read_excel(path_to_file, sheet_name)

    # print(df)
    return df

def dataframe_to_dict(df, key_column, value_column):

    name_email_dict = df.set_index(key_column)[value_column].to_dict()

    return name_email_dict

def multiple_replace(adict, text):
  # Create a regular expression from all of the dictionary keys
  regex = re.compile("|".join(map(re.escape, adict.keys(  ))))
  # print("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[")
  # print(regex)
  # print(text)
  # print(regex.sub(lambda match: adict[match.group()], text))
  # print("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[")
  source = "MS_WIN_SYSMON"
  # For each match, look up the corresponding value in the dictionary
  return  "SELECT * FROM "+source+" "+"where "+regex.sub(lambda match: adict[match.group(0)], text)
  
  
def conv_func(text):
    final_code = []
    genearted_query = ""
    for (key, value) in adict.items():
        text = text.replace(": ",":")

        if str(key) in text:
            print(key,'------------',value)
            t = str(key)
            print(t)
            print('key is there in a given text')
            if len(value.split()) > 1:
                print('length >>>>>> 1')
               
                if t in text:
                    print('-----key found-----')
                    # text = text.replace(": ",":")
                    # result = re.search(r''+t+'^[a-zA-z]+.*?\s'+'', text)
                    result = re.search(r''+t+'.*?\W.*?\s'+'', text)
                    print(result)
                    if result != None:
                        starts_with = ((result.group()).split(':'))[1]
                        if starts_with.startswith("("):
                            outer = re.search(r''+t+'.*?\(.*?\)'+'', text)
                            # outer = re.compile("\((.+)\)")
                            print(outer)
                            m = outer
                            
                            if m != None:
                            
                                inner_str = m.group()
                                print(inner_str)
                                l1 = value.split()
                                # print('-------------------split valuessssss')
                                # print(l1)
                                
                                if m:
                                    # print('eneterd into m cond')
                                    # print(m)
                                    t3 = []
                                    j2 = ""
                                    # Yes, process it
                                    query_param = m.group()
                                    # print('-------', query_param)
                                    # print(query_param.partition(t)[2] )
                                     
                                    h = query_param.partition(t)[2] 
                                    
                                    h = (h.split(":"))[1]
                                    
                                   
                                    
                                    if h.startswith("("):   
                                        t4 = []
                                        
                                        h = h.replace('(', '')
                                        h = h.replace(')', '')
                                       
                                        arr = [' or ', ' and ']
                                        for c in arr:
                                            # print(type(c))
                                            if c in h:
                                                
                                                res = h.split(c)
                                            
                                                for i in range(0,len(res)):
                                                    # print('enterd here')
                                                    # t1 = l1[j]+"'"+res[i]+"'" 
                                                    t1 = "'%"+res[i]+"%'"
                                                    
                                                    t4.append(t1)
                                               
                                                final_text = 'ilike any'+'( ' + ', '.join(t4) + ' ) '
                                                
                                                j2 = final_text
                                   
                                                # print('j2222 testingggggggggggg')        
                                                # print(j2)
                                                
                                                
                                                for i in range(0,len(l1)):
                                                    # # print(i)
                                                    # # print(l1[i])
                                                    # # print(t)
                                                    t1 = l1[i] + ' '+j2 
                                                    t3.append(t1)
                                                    # print(t3)
                                                
                                                # print(text)
                                                replacement_text = '(' + ' or '.join(t3) + ')' 
                                                # print('replacementtttttttttttttttttttttttt')
                                                # print((replacement_text))
                                                print('************************************')
                                                print(result.group())
                                                
                                                modified_text = text.replace( inner_str, replacement_text) 
                                                text = modified_text
                                                # print('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
                                                # print(text)
                                                print(multiple_replace(adict, text))
                                                final_code.append(multiple_replace(adict, text))
                                                print('*************************************')
                                        
                                    else:
                                        print('nooooo') 
                                else:
                                    print("nooo m found")
                                    
                            else:
                                print("there is no group object")
                        else:
                           
                            l1 = value.split()
                            print('^^^^entered into else looooooooooppppppppp ^^^^^^^^^')
                            print(starts_with)
                            t5 = []
                            t6 = []
                            t1 = "'%"+starts_with.replace(" ", "")+"%'"
                            t5.append(t1)
                            # print('t555555555555555555')
                            # print(t5)
                            
                            final_text = 'ilike '+'(' + ''.join(t5) + ')'
                            
                            j2 = final_text
                            
                            # print(j2)
               
                            # print('j2222 testingggggggggggg')        
                            # print(j2)
                            
                            
                            for i in range(0,len(l1)):
                                # print(i)
                                # print(l1[i])
                                # print(t)
                                t1 = l1[i] + ' '+j2 
                                t6.append(t1)
                                # print(t6)
                            
                            # print(text)
                            replacement_text = '(' + ' or '.join(t6) + ')' 
                            # print('replacementtttttttttttttttttttttttt')
                            # print((replacement_text))
                            print('************************************')
                            print(result.group())
                            
                            modified_text = text.replace( result.group(0), replacement_text) 
                            text = modified_text
                            # print('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
                            # print(text)
                            print(multiple_replace(adict, text))
                            final_code.append(multiple_replace(adict, text))
                            print('*************************************')
                     
                    else:
                        print("there is no group object")
                else:
                    print('-----key not found------')
                    
            else:
                print('length <<<<<<<<<<<<<<<<<<<< 1')
               
                result = re.search(r''+t+'.*?\W.*?\s'+'', text)
                print(result)
                if result != None:
                    starts_with = ((result.group()).split(':'))[1]
                    print('---------------------------------------',starts_with)
                    if starts_with.startswith("("):
                        print('true')
                        outer = re.search(r''+t+'.*?\(.*?\)'+'', text)
                        # outer = re.compile("\((.+)\)")
                        # print(outer)
                        m = outer
                        if m != None:
                            inner_str = m.group()
                            # print(inner_str)
                            # print(type(t))
                            
                            l1 = value.split()
                            # print('split valuessssss')
                            # print(l1)
                            
                            if m:
                                print('eneterd into m cond')
                                # print(m)
                                t3 = []
                                j2 = ""
                                # Yes, process it
                                query_param = m.group()
                                # print('-------', query_param)
                                # print(query_param.partition(t)[2] )
                                 
                                h = query_param.partition(t)[2] 
                                
                                h = (h.split(":"))[1]
                                
                               
                                
                                if h.startswith("("):   
                                    t4 = []
                                    
                                    h = h.replace('(', '')
                                    h = h.replace(')', '')
                                   
                                    arr = [' or ', ' and ']
                                    for c in arr:
                                        # print(type(c))
                                        if c in h:
                                            
                                            res = h.split(c)
                                        
                                            for i in range(0,len(res)):
                                                # print('enterd here')
                                                # t1 = l1[j]+"'"+res[i]+"'" 
                                                t1 = "'%"+res[i]+"%'"
                                                
                                                t4.append(t1)
                                           
                                            final_text = 'ilike any'+'( ' + ', '.join(t4) + ' ) '
                                            
                                            j2 = final_text
                               
                                            # print('j2222 testingggggggggggg')        
                                            # print(j2)
                                            
                                            for i in range(0,len(l1)):
                                                t1 = l1[i] + ' '+j2 
                                                t3.append(t1)
                                                # print(t3)
                                        
                                            # print(text)
                                            replacement_text = '(' + ' or '.join(t3) + ')' 
                                            # print('replacementtttttttttttttttttttttttt')
                                            # print((replacement_text))
                                            print('************************************')
                                            print(result.group())
                                            
                                            modified_text = text.replace( inner_str, replacement_text) 
                                            text = modified_text
                                            # print('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
                                            # print(text)
                                            print(multiple_replace(adict, text))
                                            final_code.append(multiple_replace(adict, text))
                                            print('*************************************')
                                    
                                else:
                                    print('nooooo')        
                            else:
                                print("no group object")
                      
                        else:
                            print("no m found")
                    else:
                        print('@@@@ entered into length <<<< 1 elsee looop')
                        l1 = value.split()
                        
                        t5 = []
                        t6 = []
                        
                        t1 = "'%"+starts_with.replace(" ", "")+"%'"
                        print(starts_with)
                        print(l1)
                        print('------------------------------------------------t1')
                        print(t1)
                        t5.append(t1)
                        # print('t555555555555555555')
                        # print(t5)
                        
                        final_text = 'ilike '+'(' + ''.join(t5) + ')'
                        
                        j2 = final_text
                        
                        # print(j2)
           
                        # print('j2222 testingggggggggggg')        
                        # print(j2)
                        
                        # print(l1)
                        # print(type(l1))
                       
                        for i in range(0,len(l1)):
                            t1 = l1[i] + ' '+j2 
                            t6.append(t1)
                            # print(t6)
                        
                        # print(text)
                        replacement_text = '(' + ' or '.join(t6) + ')' 
                        # print('replacementtttttttttttttttttttttttt')
                        print((replacement_text))
                        print('************************************')
                        print(result.group())
                        print(text)
                        print(result)
                        modified_text = text.replace( result.group(0), replacement_text)
                        print(modified_text)                        
                        text = modified_text
                        print("------------------------")
                        print(text)
                        # print('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
                        # print(text)
                        print(multiple_replace(adict, text))
                        final_code.append(multiple_replace(adict, text))
                        print('*************************************')
                   
                else:
                    pass
                    # print('no group object for the given result')
        else:
            pass
            # print('there is no key to process')
            
    if len(final_code) > 0:
        genearted_query = final_code.pop()
        
    else:
        pass
        # print("empty list")
    # genearted_query = final_output.pop()
    return genearted_query  


if __name__ == "__main__":
    # path_to_alerts_list_file = "C:/Users/anitha.singamsetti/Desktop/Automation of ES Alerts/test.xlsx"
    # sheet_name1 = "Alerts list"
    
    path_to_alerts_list_file = "C:/Users/anitha.singamsetti/Desktop/alerts.xlsx"
    # sheet_name1 = "Alerts list"
    sheet_name1 = "Alerts list test"

    path_to_alerts_list_file= "C:/Users/anitha.singamsetti/Desktop/alerts.xlsx"
    sheet_name2 = "Mapping columns in windows"
    
    path_to_alerts_list_file= "C:/Users/anitha.singamsetti/Desktop/alerts.xlsx"
    sheet_name3 = "Acronyms"

    alerts_list = read_excel(path_to_alerts_list_file, sheet_name1)
    mapped_columns = read_excel(path_to_alerts_list_file, sheet_name2)
    acronyms = read_excel(path_to_alerts_list_file, sheet_name3)
    
    alerts_list_dict = dataframe_to_dict(alerts_list, 'ES Alert Name', 'ES Alert querry definition params')
    
    adict = dataframe_to_dict(mapped_columns, 'ES Column Names', 'MS_WIN_SYSMON')
    acronyms_dict = dataframe_to_dict(acronyms, 'Name', 'Abbr')
    # print(adict)
    
    conn = snowflake.connector.connect(
                user='anitha',
                password='lalithAbhi@9295',
                account='ik55883.east-us-2.azure',
                warehouse='ANALYST_WH',
                database='TENANT1',
                schema='ENRICHED',
                role='SYSADMIN'
                )
        
    data=[]
    status = []
    alert_acronym = []
    for (index, row) in alerts_list.iterrows():
        print('index is ============================================================', index)
        print(row['ES Alert querry definition params'])
        generated_data = conv_func(row['ES Alert querry definition params'])
        t1 = generated_data + " and event_time::date='2020-12-06'"
        try:
            t = pd.read_sql(t1, conn)
            t = "success"
        except:
            t = "failure"
        data.append(generated_data)
        status.append(t)
        
        alert_name = row['ES Alert Name'].upper()
        final_list = (alert_name.split('.')[0]).split('_')
        print(final_list)
        str_text = []
        for (key, value) in acronyms_dict.items():
            t = str(key).upper()
            if t in final_list:
                # print(value)
                str_text.append(value)
            else:
                pass
        
        
        final_acronym = 'ES_'+''.join(str_text)
        alert_acronym.append(final_acronym)
        
    
    alerts_list['sql_conv_column'] = data  
    alerts_list['status'] = status 
    alerts_list['Alert_Acronym'] = alert_acronym 
    
    
    alerts_list.to_excel('converted_sql_on_dec_11.xlsx', engine='xlsxwriter')    
       