import pandas as pd
import xlrd
from pandas import ExcelWriter
import xlsxwriter

def read_excel(path_to_file, sheet_name):

    df = pd.read_excel(path_to_file, sheet_name)

    # print(df)
    return df
    
def dataframe_to_dict(df, key_column, value_column):

    name_email_dict = df.set_index(key_column)[value_column].to_dict()

    return name_email_dict    

if __name__ == "__main__":

    path_to_alerts_list_file = "C:/Users/anitha.singamsetti/Desktop/alerts.xlsx"
    sheet_name1 = "Alerts list"
    
    path_to_alerts_list_file= "C:/Users/anitha.singamsetti/Desktop/alerts.xlsx"
    sheet_name3 = "Acronyms"
    
    alerts_list = read_excel(path_to_alerts_list_file, sheet_name1)
    acronyms = read_excel(path_to_alerts_list_file, sheet_name3)
    
    text = "command_and_control_certutil_network_connection.toml".upper()
    final_list = (text.split('.')[0]).split('_')
    # print(final_list)
    
    acronyms_dict = dataframe_to_dict(acronyms, 'Name', 'Abbr')
    # print(acronyms_dict)
    
    for (index, row) in alerts_list.iterrows():
        text = row['ES Alert Name'].upper()
        final_list = (text.split('.')[0]).split('_')
        print(final_list)
        
        str_text = []
        
        # for i in range(0, len(final_list)):
            # # print(final_list[i])
        for (key, value) in acronyms_dict.items():
            t = str(key).upper()
            if t in final_list:
                # print(value)
                str_text.append(value)
            else:
                print('no values to insert')
    
        print("===================================================================")
        print('ES_'+''.join(str_text))
        print("===================================================================")
    