import tkinter as tk
from tkinter import ttk, messagebox
from functools import reduce

from database import get_all_weather_data
from styles import (
    COLORS,
    configure_window,
    configure_styles,
    create_header,
    create_card,
    create_table_frame,
    create_table_title,
    create_footer
)


# =========================================================
# CLIMATE INTELLIGENCE FUNCTIONS
# =========================================================

def celsius_to_fahrenheit(temperature):
    """
    Convert Celsius temperature to Fahrenheit.
    """
    return (temperature * 9 / 5) + 32


def analyze_temperatures(temperatures):
    """
    Analyze temperature data using Python
    functional programming concepts.
    """

    if not temperatures:
        return {
            "average": 0,
            "maximum": 0,
            "minimum": 0,
            "heatwave_count": 0,
            "total": 0,
            "fahrenheit": []
        }

    # -----------------------------------------------------
    # map() + lambda
    # Celsius → Fahrenheit
    # -----------------------------------------------------

    fahrenheit_values = list(
        map(
            lambda temp: celsius_to_fahrenheit(temp),
            temperatures
        )
    )

    # -----------------------------------------------------
    # filter() + lambda
    # Heatwave threshold = 35°C
    # -----------------------------------------------------

    heatwave_values = list(
        filter(
            lambda temp: temp >= 35,
            temperatures
        )
    )

    # -----------------------------------------------------
    # reduce() + lambda
    # Aggregate temperature total
    # -----------------------------------------------------

    total_temperature = reduce(
        lambda x, y: x + y,
        temperatures
    )

    return {
        "average": total_temperature / len(temperatures),
        "maximum": max(temperatures),
        "minimum": min(temperatures),
        "heatwave_count": len(heatwave_values),
        "total": total_temperature,
        "fahrenheit": fahrenheit_values
    }


# =========================================================
# LOAD DATABASE DATA
# =========================================================

weather_data = get_all_weather_data()


if not weather_data:

    messagebox.showerror(
        "Database Error",
        "Could not load climate data from PostgreSQL."
    )

    raise SystemExit


# =========================================================
# EXTRACT TEMPERATURES
# =========================================================

temperatures = [
    row[2]
    for row in weather_data
]


# =========================================================
# ANALYZE TEMPERATURES
# =========================================================

analysis = analyze_temperatures(
    temperatures
)


# =========================================================
# MAIN WINDOW
# =========================================================

root = tk.Tk()

configure_window(root)

configure_styles()


# =========================================================
# HEADER
# =========================================================

create_header(root)


# =========================================================
# STATISTICS CARDS
# =========================================================

cards_frame = tk.Frame(
    root,
    bg=COLORS["background"]
)

cards_frame.pack(
    fill="x",
    padx=25,
    pady=20
)


create_card(
    cards_frame,
    "AVERAGE TEMPERATURE",
    f"{analysis['average']:.1f} °C"
)


create_card(
    cards_frame,
    "MAXIMUM TEMPERATURE",
    f"{analysis['maximum']:.1f} °C"
)


create_card(
    cards_frame,
    "MINIMUM TEMPERATURE",
    f"{analysis['minimum']:.1f} °C"
)


create_card(
    cards_frame,
    "HEATWAVE READINGS",
    str(analysis["heatwave_count"])
)


# =========================================================
# DATA TABLE
# =========================================================

table_frame = create_table_frame(
    root
)


create_table_title(
    table_frame
)


# =========================================================
# TABLE COLUMNS
# =========================================================

columns = (
    "Data ID",
    "Timestamp",
    "Temperature",
    "Fahrenheit",
    "Longitude",
    "Latitude",
    "Region",
    "Station ID"
)


tree = ttk.Treeview(
    table_frame,
    columns=columns,
    show="headings"
)


# =========================================================
# TABLE HEADINGS
# =========================================================

for column in columns:

    tree.heading(
        column,
        text=column
    )

    tree.column(
        column,
        width=120,
        anchor="center"
    )


# Individual column widths

tree.column(
    "Data ID",
    width=70
)

tree.column(
    "Timestamp",
    width=150
)

tree.column(
    "Temperature",
    width=100
)

tree.column(
    "Fahrenheit",
    width=100
)

tree.column(
    "Longitude",
    width=100
)

tree.column(
    "Latitude",
    width=100
)

tree.column(
    "Region",
    width=120
)

tree.column(
    "Station ID",
    width=80
)


# =========================================================
# SCROLLBAR
# =========================================================

scrollbar = ttk.Scrollbar(
    table_frame,
    orient="vertical",
    command=tree.yview
)


tree.configure(
    yscrollcommand=scrollbar.set
)


tree.pack(
    side="left",
    fill="both",
    expand=True,
    padx=(18, 0),
    pady=(0, 18)
)


scrollbar.pack(
    side="right",
    fill="y",
    padx=(0, 18),
    pady=(0, 18)
)


# =========================================================
# INSERT DATABASE RECORDS
# =========================================================

for row in weather_data:

    data_id = row[0]

    timestamp = row[1]

    temperature = row[2]

    longitude = row[3]

    latitude = row[4]

    region = row[5]

    station_id = row[6]


    # Convert Celsius → Fahrenheit

    fahrenheit = celsius_to_fahrenheit(
        temperature
    )


    # Insert record into table

    tree.insert(
        "",
        "end",
        values=(
            data_id,
            timestamp.strftime(
                "%Y-%m-%d %H:%M"
            ),
            f"{temperature:.1f} °C",
            f"{fahrenheit:.1f} °F",
            longitude,
            latitude,
            region,
            station_id
        )
    )


# =========================================================
# FOOTER
# =========================================================

create_footer(
    root,
    len(weather_data)
)


# =========================================================
# START APPLICATION
# =========================================================

root.mainloop()