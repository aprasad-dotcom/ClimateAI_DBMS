import psycopg2


def get_connection():
    try:
        connection = psycopg2.connect(
            host="localhost",
            port="5432",
            database="climate_ai",
            user="postgres",
            password="anamika@12345"
        )

        print("Database connected successfully!")
        return connection

    except psycopg2.Error as error:
        print("Database connection failed:", error)
        return None

def get_all_weather_data():
    connection = get_connection()

    if connection is None:
        return []

    try:
        cursor = connection.cursor()

        query = """
        SELECT
            data_id,
            timestamp,
            maximum_temperature,
            longitude,
            latitude,
            region,
            station_id
        FROM meteorological_data
        ORDER BY timestamp;
        """

        cursor.execute(query)
        data = cursor.fetchall()

        cursor.close()
        connection.close()

        return data

    except psycopg2.Error as error:
        print("Error fetching weather data:", error)
        return []

def get_temperature_data():
    connection = get_connection()

    if connection is None:
        return []

    try:
        cursor = connection.cursor()

        query = """
        SELECT maximum_temperature
        FROM meteorological_data
        ORDER BY timestamp;
        """

        cursor.execute(query)
        temperatures = [row[0] for row in cursor.fetchall()]

        cursor.close()
        connection.close()

        return temperatures

    except psycopg2.Error as error:
        print("Error fetching temperatures:", error)
        return []

def get_dashboard_statistics():
    connection = get_connection()

    if connection is None:
        return None

    try:
        cursor = connection.cursor()

        query = """
        SELECT
            COUNT(*) AS total_records,
            ROUND(AVG(maximum_temperature)::numeric, 1) AS average_temperature,
            MAX(maximum_temperature) AS maximum_temperature,
            MIN(maximum_temperature) AS minimum_temperature
        FROM meteorological_data;
        """

        cursor.execute(query)
        stats = cursor.fetchone()

        cursor.close()
        connection.close()

        return stats

    except psycopg2.Error as error:
        print("Error fetching dashboard statistics:", error)
        return None