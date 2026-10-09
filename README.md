# ClimateIQ --- Climate Intelligence DBMS

## Project overview

ClimateIQ is a GUI application for viewing meteorological observations
and highlighting readings that meet the project's heatwave threshold. It
presents climate data through a dashboard, temperature analysis, station
overview and a searchable/filterable weather-data table.

**AI use case:** Climate Intelligence for Heatwave Monitoring,
Prediction and Early Warning.

## Main GUI features

* **Dashboard:** introduces the system and its purpose.
* **Temperature:** displays average, maximum and minimum recorded
temperatures and a temperature-trend chart.
* **Heatwave Monitor:** shows the count and proportion of readings at
or above the configured threshold (shown as 35°C in the GUI).
* **Stations:** displays the temperatures associated with the listed
monitoring locations.
* **Weather Data:** lists records with data ID, timestamp, region,
temperature in Celsius and Fahrenheit, station, and status.
* **Search and filter:** lets users search by region and filter
records by status.

## Technologies

* **PostgreSQL:** stores relational data.
* **pgAdmin:** graphical administration tool for PostgreSQL; used to
inspect the database and run SQL.
* **Python:** application logic.
* **Flask:** serves the web application and handles requests.
* **psycopg2:** Python driver for connecting to PostgreSQL, if used by
the current backend.
* **HTML/CSS/JavaScript:** builds and styles the browser interface.

> Keep this list aligned with the packages and code actually present in
> the submitted project.

## Application flow

1. The user opens the GUI in a browser on the project laptop.
2. The frontend sends a request to the Python/Flask backend.
3. The backend calls database-access functions.
4. The database-access layer queries PostgreSQL.
5. PostgreSQL returns records.
6. The backend returns the result to the GUI, which displays the data
and summaries.

**Flow:** Browser GUI → Flask backend → database-access code →
PostgreSQL → backend response → GUI.

## Database and pgAdmin

The project uses a PostgreSQL database referred to in the project setup
as `climate\_ai`. PostgreSQL is the database engine. pgAdmin is the tool
used to connect to PostgreSQL, inspect tables and execute SQL queries. A
database contains organised data; tables contain records (rows) and
fields (columns).

Before evaluation, verify the actual database name, table names, and
schema in pgAdmin and update this document if necessary.

## DBMS concepts

The project connects the DBMS lab work to a practical climate-data use
case. Depending on which experiments are present in the submitted schema
and SQL scripts, relevant concepts may include: - relational tables and
data types; - primary keys and foreign keys; - DDL commands for creating
or modifying structures; - DML queries for retrieving or changing
records; - filtering, sorting, joins and aggregate functions; - grouping
and summaries.

Only claim a concept as implemented if you can show the relevant SQL,
table, or code during evaluation.

## Run locally for evaluation

Public deployment is not required if the instructor has approved a local
demonstration.

General preparation: 1. Ensure PostgreSQL is installed and running. 2.
Confirm the project database and required tables exist. 3. Install the
Python packages listed in the project's `requirements.txt` from the
correct project folder. 4. Check the database connection settings used
by the backend. Do not publish passwords or secret keys. 5. Start the
application using the start method already used by your group. 6. Open
the local address printed by the application in a browser.

Use the exact commands and configuration from the submitted code; do not
guess or include credentials in this file.

## Screenshots

The GUI screenshot documentation is provided separately in the Word
document submitted with the project.

## Repository

Source-code repository (if required for sharing code):
https://github.com/aprasad-dotcom/ClimateAI\_DBMS

GitHub is a platform for storing and sharing project files. A repository
does not automatically mean that the website is deployed. This project
can be run locally on the laptop without a public website URL when local
evaluation is permitted.

