##########################################<< Importing Libraries >>##############################################
import time
from datetime import datetime, date, timedelta
from pyspark.sql import SparkSession
import os
import base64
from datetime import date
from pyspark.sql.types import *
from pyspark.sql.functions import lit,coalesce

##########################################<< Importing Modules >>################################################
from elysium_ml_lib_13.config import *
from elysium_ml_lib_13.pyspark_kmeans import ClusterProfileModel
from elysium_ml_lib_13.sklearn_isolation_forest import IsolationForestProfileModel
from elysium_ml_lib_13.sklearn_oneclasssvm import OneClassSVMProfileModel
from elysium_ml_lib_13.snowflake_connector import read_spark_df_from_sf_agg, write_spark_df_to_sf_batch
from elysium_ml_lib_13.z_score_calculator import calc_zscore
from elysium_ml_lib_13.abstract_logger import send_error_notification, get_log_path, configure_logger

##########################################<< Execution Steps >>################################################

def score_profile_anomaly_model(spark, src, model_dict, score_df, actor_type, timestamp_str, timestamp, logger,database):
    logger.info("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")        
    logger.info("Step 1:::::Data Preprocessing")
    score_pdf = score_df.toPandas()
    score_pdf_zsc = calc_zscore(score_pdf, numerical_columns = NUMERICAL_COLUMNS[src])
    logger.info("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++") 
    logger.info("Step 2:::::Scoring for K-Means Model Started") 
    result_df_1 = model_dict[src][timestamp_str][actor_type][PYSPARK_KMEANS].score(score_df).toPandas()
    score_pdf_zsc["pas_kmeans"] = result_df_1["PAS"].astype(float).round(4)
    
    logger.info("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++") 
    logger.info("Step 3:::::Scoring for Isolation Forest Model Started")
    result_df_2 = model_dict[src][timestamp_str][actor_type][SKLEARN_ISOLATION_FOREST].score(score_pdf)
    score_pdf_zsc["pas_isolation"] = result_df_2["PAS"].round(4)
    
    logger.info("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    logger.info("Step 4:::::Scoring for One-Class SVM Model Started")
    result_df_3 = model_dict[src][timestamp_str][actor_type][SKLEARN_ONECLASS_SVM].score(score_pdf)
    score_pdf_zsc["pas_svm"] = result_df_3["PAS"].round(4)
    
    logger.info("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    logger.info("Step 5:::::Data Post Processing")
    score_pdf_zsc.drop(['PAS'],axis=1, inplace=True)
    score_pdf_zsc["pas"] = score_pdf_zsc[["pas_kmeans", "pas_isolation", "pas_svm"]].mean(axis=1).round(4)
    sdf=spark.createDataFrame(score_pdf_zsc)

    logger.info("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    logger.info("Step 6:::::Writing the results to database")
    sdf.show(5,False)
    write_spark_df_to_sf_batch(spark=spark, src=src, sdf=sdf, timestamp=timestamp, numerical_columns = NUMERICAL_COLUMNS[src],database = database)
    logger.info("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")


def train_and_save_profile_anomaly_model(spark, src, timestamp_str, data_frame, actor_type, model_dict, logger):
    
    logger.info("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")        
    logger.info("Step 1:::::Training Cluster Profile Model") 
    kmeans_model = ClusterProfileModel.train(spark=spark, categorical_columns = CATEGORICAL_COLUMNS[src], numerical_columns = NUMERICAL_COLUMNS[src], sdf=data_frame)
    logger.info("Step 1a:::::Saving Cluster Profile Model")
    kmeans_model_path = PROFILE_ANOMALY_MODEL_PATH.format(mode='stream_c', src=src, day=timestamp_str,actor_type=actor_type,model_name=PYSPARK_KMEANS)
    kmeans_model.save(path=kmeans_model_path)
    logger.info("Step 1b:::::Loading Cluster Profile Model into a dictionary")
    model_dict[src][timestamp_str][actor_type][PYSPARK_KMEANS] = ClusterProfileModel.load(spark=spark, path=kmeans_model_path)
    
    logger.info("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    logger.info("Step 2:::::Training for Isolation Forest Model")
    isolation_model = IsolationForestProfileModel.train(spark=spark, categorical_columns = CATEGORICAL_COLUMNS[src], numerical_columns = NUMERICAL_COLUMNS[src], sdf=data_frame)
    logger.info("Step 2a:::::Saving Isolation Forest Model") 
    isolation_model_path = PROFILE_ANOMALY_MODEL_PATH.format(mode='stream_c', src=src, day=timestamp_str,actor_type=actor_type,model_name=SKLEARN_ISOLATION_FOREST)
    isolation_model.save(spark=spark, path=isolation_model_path)
    logger.info("Step 2b:::::Loading Isolation Forest model into a dictionary")
    model_dict[src][timestamp_str][actor_type][SKLEARN_ISOLATION_FOREST] = IsolationForestProfileModel.load(spark=spark, path=isolation_model_path)
    
    logger.info("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    logger.info("Step 3:::::Training for One-Class SVM Model") 
    svm_model = OneClassSVMProfileModel.train(spark=spark,categorical_columns = CATEGORICAL_COLUMNS[src], numerical_columns = NUMERICAL_COLUMNS[src], sdf=data_frame)
    logger.info("Step 3a:::::Saving One-Class SVM Model")
    svm_model_path = PROFILE_ANOMALY_MODEL_PATH.format(mode='stream_c', src=src, day=timestamp_str,actor_type=actor_type,model_name=SKLEARN_ONECLASS_SVM)
    svm_model.save(spark=spark, path=svm_model_path)   
    logger.info("Step 3b:::::Loading One-Class SVM model into a dictionary")
    model_dict[src][timestamp_str][actor_type][SKLEARN_ONECLASS_SVM] = OneClassSVMProfileModel.load(spark=spark, path=svm_model_path)
   
    logger.info("Training and loading Completed for all 3 models")
    logger.info("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

    return model_dict
  

def main(src_lst,actor_type,time_frame,date_str,database):
    model_dict = dict()
    for src in src_lst:
        model_dict[src]=dict()
        
        #Setting up Log File Parameters
        log_timestamp = int(time.time() * 1000)
        log_folder = LOG_FOLDER + "/" + date.today().strftime("%Y-%m-%d")
        log_path = get_log_path(src, log_folder, log_timestamp, PROCESS_NAME)
        logger = configure_logger(logger_name=PROCESS_NAME, log_path=log_path, log_level=LOG_LEVEL)
        
        logger.info("###################################################################################")        
        logger.info("ML Model Process Started for {src} source".format(src=src))
        #Setting up Spark Session
        app_name = src + "_" + PROCESS_NAME
        spark = SparkSession.builder.appName(app_name).enableHiveSupport().getOrCreate()
        spark.sparkContext.setLogLevel(PYSPARK_LOGLEVEL)
 
        for actor in actor_type:
            timestamp = int(time.time() * 1000)
            timestamp_str = str(timestamp)
            model_dict[src][timestamp_str] = dict()
            model_dict[src][timestamp_str][actor] = dict()
            logger.info("###################################################################################")
            logger.info("Reading the data for {day} for {actor} for {src} source".format(day=date_str, actor=actor, src=src))            
            sdf_day_actor = read_spark_df_from_sf_agg(spark=spark, src=src, actor=actor,
                                                  time_frame = time_frame, date_arg=date_str,
                                                  numerical_cols = NUMERICAL_COLUMNS[src],database=database)
          
            if sdf_day_actor.count() > 0:
                
                logger.info("###################################################################################")
                logger.info("Profile anomaly model training for {actor} started for {day} for {src} source".format(actor=actor, day=date_str, src=src))
                model_dict = train_and_save_profile_anomaly_model(spark=spark,
                                                                   src = src,
                                                                   timestamp_str=timestamp_str, 
                                                                   data_frame=sdf_day_actor, 
                                                                   actor_type=actor, 
                                                                   model_dict=model_dict, 
                                                                   logger=logger)

                logger.info("###################################################################################")
                logger.info("Profile anomaly model scoring for {actor} started for {day} for {src} source".format(actor=actor, day=date_str, src=src))
                score_profile_anomaly_model(spark=spark, 
                                            src=src,
                                            score_df=sdf_day_actor,
                                            model_dict=model_dict, 
                                            actor_type=actor, 
                                            timestamp_str=timestamp_str, 
                                            timestamp=timestamp, 
                                            logger=logger,
                                           database = database)
                                           
                logger.info("###################################################################################")
                logger.info("Profile anomaly model training and scoring for {day} for {actor} for {src} source completed successfully!".format(day=date_str, actor=actor, src=src))                       
            else:
                logger.info("No data to process for {actor} started for {day} for {src} source. Skipping this iteration".format(actor=actor, day=date_str, src=src))
    logger.info("ML Model Process Completed")
    logger.info("###################################################################################")
if __name__ == "__main__":
  dbutils.widgets.text("database","tenent1","DATA BASE")
  database = dbutils.widgets.get("database")
  src_lst = ["windowsnxlog","msexchange","wgtraffic"]
  actor_type = ["user","entity"]
  time_frame = 'D'
  date_str = (date.today()-timedelta(days=1)).strftime("%Y-%m-%d")
#   date_str = "2020-05-30"
  main(src_lst=src_lst,actor_type=actor_type,time_frame=time_frame,date_str=date_str,database=database)
