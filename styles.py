import tkinter as tk
from tkinter import ttk


# ---------------------------------------------------------
# COLORS
# ---------------------------------------------------------

COLORS = {
    "background": "#F4F7FB",
    "white": "#FFFFFF",
    "primary": "#172554",
    "primary_light": "#1E3A8A",
    "text": "#1F2937",
    "muted": "#64748B",
    "border": "#D8E0EA",
    "header": "#E8EEF7",
    "success": "#166534",
    "warning": "#B45309",
    "danger": "#B91C1C",
}


# ---------------------------------------------------------
# MAIN WINDOW
# ---------------------------------------------------------

def configure_window(root):
    root.configure(
        bg=COLORS["background"]
    )

    root.title(
        "Climate Intelligence Dashboard"
    )

    root.geometry(
        "1200x720"
    )

    root.minsize(
        1000,
        600
    )


# ---------------------------------------------------------
# TKINTER / TREEVIEW STYLES
# ---------------------------------------------------------

def configure_styles():
    style = ttk.Style()

    style.theme_use("clam")

    # -----------------------------
    # TABLE
    # -----------------------------

    style.configure(
        "Treeview",
        background=COLORS["white"],
        foreground=COLORS["text"],
        rowheight=32,
        fieldbackground=COLORS["white"],
        font=("Segoe UI", 10),
        borderwidth=0
    )

    style.configure(
        "Treeview.Heading",
        font=("Segoe UI", 10, "bold"),
        background=COLORS["header"],
        foreground=COLORS["text"],
        relief="flat"
    )

    style.map(
        "Treeview",
        background=[
            ("selected", "#DCEBFF")
        ],
        foreground=[
            ("selected", "#111827")
        ]
    )

    # -----------------------------
    # SCROLLBAR
    # -----------------------------

    style.configure(
        "Vertical.TScrollbar",
        background=COLORS["header"],
        troughcolor=COLORS["background"],
        bordercolor=COLORS["background"],
        arrowcolor=COLORS["primary"]
    )


# ---------------------------------------------------------
# HEADER
# ---------------------------------------------------------

def create_header(parent):

    header = tk.Frame(
        parent,
        bg=COLORS["primary"],
        height=90
    )

    header.pack(
        fill="x"
    )

    header.pack_propagate(False)

    title = tk.Label(
        header,
        text="Climate Intelligence Dashboard",
        font=("Segoe UI", 24, "bold"),
        bg=COLORS["primary"],
        fg=COLORS["white"]
    )

    title.pack(
        anchor="w",
        padx=30,
        pady=(15, 0)
    )

    subtitle = tk.Label(
        header,
        text=(
            "Weather Monitoring • "
            "Heatwave Detection • "
            "Temperature Analysis"
        ),
        font=("Segoe UI", 10),
        bg=COLORS["primary"],
        fg="#D7E3F4"
    )

    subtitle.pack(
        anchor="w",
        padx=32
    )

    return header


# ---------------------------------------------------------
# STAT CARD
# ---------------------------------------------------------

def create_card(parent, title_text, value_text):

    card = tk.Frame(
        parent,
        bg=COLORS["white"],
        highlightbackground=COLORS["border"],
        highlightthickness=1
    )

    card.pack(
        side="left",
        expand=True,
        fill="both",
        padx=7
    )

    title = tk.Label(
        card,
        text=title_text,
        font=("Segoe UI", 10),
        bg=COLORS["white"],
        fg=COLORS["muted"]
    )

    title.pack(
        anchor="w",
        padx=18,
        pady=(15, 2)
    )

    value = tk.Label(
        card,
        text=value_text,
        font=("Segoe UI", 20, "bold"),
        bg=COLORS["white"],
        fg=COLORS["primary"]
    )

    value.pack(
        anchor="w",
        padx=18,
        pady=(0, 15)
    )

    return card


# ---------------------------------------------------------
# TABLE FRAME
# ---------------------------------------------------------

def create_table_frame(parent):

    table_frame = tk.Frame(
        parent,
        bg=COLORS["white"],
        highlightbackground=COLORS["border"],
        highlightthickness=1
    )

    table_frame.pack(
        fill="both",
        expand=True,
        padx=32,
        pady=(0, 20)
    )

    return table_frame


# ---------------------------------------------------------
# TABLE TITLE
# ---------------------------------------------------------

def create_table_title(parent):

    title = tk.Label(
        parent,
        text="Meteorological Data",
        font=("Segoe UI", 14, "bold"),
        bg=COLORS["white"],
        fg=COLORS["primary"]
    )

    title.pack(
        anchor="w",
        padx=18,
        pady=(15, 10)
    )

    return title


# ---------------------------------------------------------
# FOOTER
# ---------------------------------------------------------

def create_footer(parent, record_count):

    footer = tk.Label(
        parent,
        text=(
            f"Data records: {record_count}   |   "
            "Heatwave threshold: ≥ 35 °C   |   "
            "Source: PostgreSQL climate_ai database"
        ),
        font=("Segoe UI", 9),
        bg=COLORS["background"],
        fg=COLORS["muted"]
    )

    footer.pack(
        pady=(0, 12)
    )

    return footer