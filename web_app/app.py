import os
import numpy as np
import pandas as pd
import sqlalchemy
import pymysql
pymysql.install_as_MySQLdb()

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import extract

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

app = Flask(__name__)



# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///../ETL/diseases.sqlite"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///diseases.sqlite"
engine = create_engine("sqlite:///diseases.sqlite")
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Disease_Data = Base.classes.diseases
session = Session(engine)
# from models.py import Disease



@app.route("/")
def home():
    return render_template("index.html")

## Route for Vaccine dates
@app.route("/vaccine")
def vaccine():
    vaccine_data = [{
        "diptheria":1920,
        "hep_b":1982,
        "hep_a":1995,
        "measles":1963,
        "mumps":1967,
        "pertussis":1930,
        "rubella":1969,
        "smallpox":1796,
        "tetanus":1924,
        "tuberculosis":1921,
        "typhoid":1896,
        "varicella":1995,
        "yellow_fever":1951
    }]
    return jsonify(vaccine_data)

@app.route("/basic")
def basic():
    # Query grouped by Disease & Year
    results = db.session.query(Disease_Data.Disease,func.sum(Disease_Data.CountValue),func.sum(Disease_Data.Fatalities),Disease_Data.Year).\
    group_by(Disease_Data.Disease).group_by(Disease_Data.Year).all()

    disease_data = []
    for result in results:
        disease_dict = {}
        disease_dict["Disease"] = result[0]
        disease_dict["Count"] = result[1]
        disease_dict["Fatalities"] = result[2]
        disease_dict["Year"] = result[3]
        disease_data.append(disease_dict)

    return jsonify(disease_data)

## Route for state by state data on specific disease
@app.route("/state/<disease>")
def state(disease):

    #Query for Specific Disease => gives Data for that disease by state (all time)
    results = db.session.query(Disease_Data.Disease,Disease_Data.State,func.sum(Disease_Data.CountValue),func.sum(Disease_Data.Fatalities),Disease_Data.Year).\
    group_by(Disease_Data.State).group_by(Disease_Data.Year).filter(Disease_Data.Disease == disease).all()
                                    

    disease_data = []
    for result in results:
        disease_dict = {}
        disease_dict["Disease"] = result[0]
        disease_dict["State"] = result[1]
        disease_dict["Count"] = result[2]
        disease_dict["Fatalities"] = result[3]
        disease_dict["Year"] = result[4]
        disease_data.append(disease_dict)

    return jsonify(disease_data)

#Route for every year of specific disease
@app.route("/year/<disease>")
def yearly(disease):

    #Query for Specific Disease => gives Data for that disease by year (all states)
    results = db.session.query(Disease_Data.Disease,Disease_Data.Year,func.sum(Disease_Data.CountValue),func.sum(Disease_Data.Fatalities),Disease_Data.Year).\
    group_by(Disease_Data.Year).filter(Disease_Data.Disease == disease).all()
                                    

    disease_data = []
    for result in results:
        disease_dict = {}
        disease_dict["Disease"] = result[0]
        disease_dict["Year"] = result[1]
        disease_dict["Count"] = result[2]
        disease_dict["Fatalities"] = result[3]
        disease_data.append(disease_dict)

    return jsonify(disease_data)

## Route for every instance of every disease by specific year
@app.route('/<int:year>')
def year(year):

    #Query for Specific Year => gives Data for that year by disease (all states)
    results = db.session.query(Disease_Data.Disease,func.sum(Disease_Data.CountValue),func.sum(Disease_Data.Fatalities)).\
    group_by(Disease_Data.Disease).filter(Disease_Data.Year == year).all()
                                    

    disease_data = []
    for result in results:
        disease_dict = {}
        disease_dict["Disease"] = result[0]
        disease_dict["Count"] = result[1]
        disease_dict["Fatalities"] = result[2]
        disease_data.append(disease_dict)

    return jsonify(disease_data)

## Route for every Disease for specific year & state
@app.route('/<int:year>/<state>')
def year_state(year, state):

    #Query for Specific Year & State => gives Data for all registered diseases matching year & state
    results = db.session.query(Disease_Data.Disease,func.sum(Disease_Data.CountValue),func.sum(Disease_Data.Fatalities)).\
    group_by(Disease_Data.Disease).filter(Disease_Data.Year == year).filter(Disease_Data.State == state).all()
                                    

    disease_data = []
    for result in results:
        disease_dict = {}
        disease_dict["Disease"] = result[0]
        disease_dict["Count"] = result[1]
        disease_dict["Fatalities"] = result[2]
        disease_data.append(disease_dict)

    return jsonify(disease_data)

## Route for every State by disease and year:
@app.route('/<disease>/<int:year>')
def year_disease(disease, year):

    #Query for Specific Year & State => gives Data for all registered diseases matching year & state
    results = db.session.query(Disease_Data.Disease,Disease_Data.State,func.sum(Disease_Data.CountValue),func.sum(Disease_Data.Fatalities)).\
    group_by(Disease_Data.State).filter(Disease_Data.Year == year).filter(Disease_Data.Disease == disease).all()
                                    

    disease_data = []
    for result in results:
        disease_dict = {}
        disease_dict["Disease"] = result[0]
        disease_dict["State"] = result[1]
        disease_dict["Count"] = result[2]
        disease_dict["Fatalities"] = result[3]
        disease_data.append(disease_dict)

    return jsonify(disease_data)

if __name__ == "__main__":
    app.run()
