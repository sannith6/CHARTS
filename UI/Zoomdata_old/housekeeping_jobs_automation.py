import os
import subprocess
import snowflake.connector
import pandas as pd
import time
from datetime import date 
from datetime import timedelta
import re 
  
# Get today's date 
today = date.today() 
# Yesterday date 
yesterday = today - timedelta(days = 1) 

print('********* establishing snowflake connection ************')
conn = snowflake.connector.connect(
            user='MYTHRI',
            account='elysiumpartner',
            password='bigData123$',
            warehouse='DEMO_WH',
            database='TENANT2',
            schema='ENRICHEDNEW',
            role='SYSADMIN'
)            

temp_file = open("text_log.txt",'w')

session = subprocess.call(['sh', './new_schema_data_gen_latest.sh'], stdout=temp_file, stderr=temp_file)

# checking whether the files are in stage or not
stage_list = [
'list @TENANT2_MS_AD_COMPUTERS_INT',
'list @TENANT2_MS_AD_USERS_INT',
'list @TENANT2_WG_FW_EVENTSALARMS_INT',
'list @TENANT2_MS_EXCH_AGENT_INT',
'list @TENANT2_MS_EXCH_CONNECTIVITY_INT',
'list @TENANT2_MS_IIS_ACCESS_INT',
'list @TENANT2_MS_EXCH_MESSAGETRACKING_INT',
'list @TENANT2_WG_FW_NETWORKTRAFFIC_INT',
'list @TENANT2_SYM_ES_NETWORKPROTECTION_INT',
'list @TENANT2_SYM_ES_ENDPOINTPROTECTIONCLIENT_INT',
'list @TENANT2_MS_WIN_SYSMON_INT',
'list @TENANT2_MS_WIN_SECURITYAUDITING_NETTRAFFIC_INT',
'list @TENANT2_MS_WIN_SECURITYAUDITING_INT'
]

print('********chaecking the files in staging area***********')
for i in range(len(stage_list)):
    h = pd.read_sql(stage_list[i], conn)


# pipe refresh
alter_list = [
'alter pipe WG_FW_EVENTSALARMS_PIPE refresh',
'alter pipe WG_FW_NETWORKTRAFFIC_PIPE refresh',
'alter pipe MS_WIN_SECURITYAUDITING_PIPE refresh',
'alter pipe MS_WIN_SECURITYAUDITING_NETTRAFFIC_PIPE refresh',
'alter pipe MS_EXCH_AGENT_PIPE refresh',
'alter pipe MS_EXCH_CONNECTIVITY_PIPE refresh',
'alter pipe MS_IIS_ACCESS_PIPE refresh',
'alter pipe SYM_ES_ENDPOINTPROTECTIONCLIENT_PIPE refresh',
'alter pipe SYM_ES_NETWORKPROTECTION_PIPE refresh',
'alter pipe MS_WIN_SYSMON_PIPE refresh',
'alter pipe MS_AD_COMPUTERS_PIPE refresh',
'alter pipe MS_AD_USERS_PIPE refresh',
'alter pipe MS_EXCH_MESSAGETRACKING_PIPE refresh'
]

print('****** refreshing the pipes in a stage **********')
for i in range(len(alter_list)):
    h = pd.read_sql(alter_list[i], conn)
    

print("******* Waiting for 10 minutes ***************")    
time.sleep(100)    


# procedure calls
proc_calls = [
"call SP_WG_FW_NETWORKTRAFFIC (null , 'Tenant2')" ,
"call SP_MS_WIN_SECURITYAUDITING_NETTRAFFIC (null , 'Tenant2')" ,
"call SP_WG_FW_EVENTSALARMS (null , 'Tenant2')" ,
"call SP_MS_EXCH_AGENT (null , 'Tenant2')" ,
"call SP_MS_EXCH_CONNECTIVITY (null , 'Tenant2')" ,
"CALL SP_MS_IIS_ACCESS(NULL , 'Tenant2')",
"CALL SP_SYM_ES_ENDPOINTPROTECTIONCLIENT(NULL , 'Tenant2')",
"CALL SP_SYM_ES_NETWORKPROTECTION(NULL , 'Tenant2')",
"CALL SP_MS_WIN_SYSMON(NULL , 'Tenant2')",
"CALL SP_MS_AD_COMPUTERS(NULL , 'Tenant2')",
"CALL SP_MS_AD_USERS(NULL , 'Tenant2')",
"call SP_MS_EXCH_MESSAGETRACKING (null , 'Tenant2')" ,
"call SP_MS_WIN_SECURITYAUDITING (null , 'Tenant2')" ]

# aggregation calls
agg_calls = [
'call SP_NP_USER_ENTITY_AGG()',
'call SP_NP_COMPLIANCE_AGG()',
'call SP_NP_HOSTNAME_AGG()'
]

agg_queries_list = [
'select * from  (select distinct event_time::Date as dates from NP_WG_FW_EVENTSALARMS_AGG order by event_time::Date desc)t where t.dates = current_date-1' ,
'select * from  (select distinct event_time::Date as dates from NP_MS_WIN_SECURITYAUDITING_AGG order by event_time::Date desc)t where t.dates = current_date-1' ,
'select * from  (select distinct event_time::Date as dates from NP_MS_WIN_SYSMON_AGG order by event_time::Date desc)t where t.dates = current_date-1' ,
'select * from  (select distinct event_time::Date as dates from NP_WG_FW_NETWORKTRAFFIC_AGG order by event_time::Date desc)t where t.dates = current_date-1' ,
'select * from  (select distinct event_time::Date as dates from NP_MS_EXCH_MESSAGETRACKING_AGG order by event_time::Date desc)t where t.dates = current_date-1' 
]


proc_result_list = []
agg_result_list = []
queries_result_list = []

print("******* procedure calls running ********")
for i in range(len(proc_calls)):
    proc_result = pd.read_sql(proc_calls[i], conn)
    r1 = re.findall(r"[\w']+", proc_calls[i])
    if ((proc_result.loc[0, r1[1]] == 'Succeeded') or (proc_result.loc[0, r1[1]] == 'Succeeded.')):
        success_result = proc_calls[i]+' procedure got succeeded.'
        proc_result_list.append(success_result)     
    else:
        failure_result = proc_calls[i]+' procedure got failed.'
        proc_result_list.append(failure_result)
        

print("******* aggregated procedure calls running ********")
for i in range(len(agg_calls)):
    agg_result = pd.read_sql(agg_calls[i], conn)
    r1 = re.findall(r"[\w']+", agg_calls[i])
    # print(agg_calls[i])
    # print(agg_result)
    # print(r1[1])
    if ((agg_result.loc[0, r1[1]] == 'Succeeded') or (agg_result.loc[0, r1[1]] == 'Succeeded.')):
        success_result = agg_calls[i]+' procedure got succeeded.'
        agg_result_list.append(success_result)     
    else:
        failure_result = agg_calls[i]+' procedure got failed.'
        agg_result_list.append(failure_result)
        
        
print("******* aggregated queries running ********")
for i in range(len(agg_queries_list)):
    query_result = pd.read_sql(agg_queries_list[i],conn)
    
    if query_result.loc[0, 'DATES']    == yesterday:
        success_result = "Data is there in all the aggregated tables"
        queries_result_list.append(success_result)
    else:
        failure_result = agg_queries_list[i]+' got failed.'
        queries_result_list.append(failure_result)
        
print(proc_result_list)        
print(agg_result_list)
print(queries_result_list)

print("******* running the ML procedure *********** ")
ml_result = pd.read_sql('call SP_NP_PROFILE_ALERT_LC()',conn)


str1 = " "
str2 = str1.join(proc_result_list)


import smtplib
import os

# EMAIL_ADDRESS = os.environ.get('email_user')
# EMAIL_PASSWORD = os.environ.get('email_password')


EMAIL_ADDRESS = 'anithasingamsetti@gmail.com'
EMAIL_PASSWORD = 'ukryefhdbvoiaoku'

print(EMAIL_ADDRESS, EMAIL_PASSWORD)

with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
    smtp.ehlo()
    smtp.starttls()
    smtp.ehlo()
    smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    
    subject = "testing  email configuration in python for daily housekeeping jobs"
    body = str2
    
    msg = f'Subject: {subject}\n\n{body}'
    
    smtp.sendmail(EMAIL_ADDRESS, 'Aravind.Sivaji@sstech.us', msg)
    
    print('email sent')

