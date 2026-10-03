/* =========================================================
   CLIMATEIQ DASHBOARD
   ========================================================= */

let weatherData = [];
let statistics = {};

const HEATWAVE_THRESHOLD = 35;


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupNavigation();
    setupSearch();
    setupFilter();

    loadDashboard();

});


/* =========================================================
   LOAD DASHBOARD
   ========================================================= */

async function loadDashboard() {

    try {

        const weatherResponse =
            await fetch("/api/weather");

        const statisticsResponse =
            await fetch("/api/statistics");


        if (!weatherResponse.ok) {
            throw new Error("Weather API failed");
        }

        if (!statisticsResponse.ok) {
            throw new Error("Statistics API failed");
        }


        weatherData =
            await weatherResponse.json();

        statistics =
            await statisticsResponse.json();


        console.log("Climate data:", weatherData);
        console.log("Statistics:", statistics);


        updateStatistics();
        updateHero();
        renderChart();
        renderHeatwave();
        renderStations();
        renderTable();


    } catch (error) {

        console.error(error);

        showConnectionError();

    }

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach(item => {

        item.addEventListener("click", () => {

            navItems.forEach(nav =>
                nav.classList.remove("active")
            );

            item.classList.add("active");


            const section =
                item.dataset.section;


            if (section === "dashboard") {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

            else if (section === "temperature") {

                scrollToSection("temperature");

            }

            else if (section === "heatwave") {

                scrollToSection("heatwave");

            }

            else if (section === "stations") {

                scrollToSection("stations");

            }

            else if (section === "weather") {

                scrollToSection("weather");

            }

        });

    });

}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

function scrollToSection(id) {

    const element =
        document.getElementById(id);

    if (!element) return;


    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* Make function available to HTML */

window.scrollToSection = scrollToSection;


/* =========================================================
   STATISTICS
   ========================================================= */

function updateStatistics() {

    const average =
        getStatistic(
            ["average", "average_temperature", "avg_temperature"],
            calculateAverage()
        );


    const maximum =
        getStatistic(
            ["maximum", "maximum_temperature", "max_temperature"],
            calculateMaximum()
        );


    const minimum =
        getStatistic(
            ["minimum", "minimum_temperature", "min_temperature"],
            calculateMinimum()
        );


    const heatwave =
        getStatistic(
            ["heatwave_count", "heatwaves"],
            calculateHeatwaveCount()
        );


    setText(
        "average-temperature",
        `${Number(average).toFixed(1)} °C`
    );


    setText(
        "maximum-temperature",
        `${Number(maximum).toFixed(1)} °C`
    );


    setText(
        "minimum-temperature",
        `${Number(minimum).toFixed(1)} °C`
    );


    setText(
        "heatwave-count",
        heatwave
    );


    const total =
        weatherData.length;


    const percentage =
        total > 0
            ? Math.round((heatwave / total) * 100)
            : 0;


    setText(
        "heatwave-percentage",
        `${percentage}% of dataset`
    );

}


/* =========================================================
   HERO
   ========================================================= */

function updateHero() {

    const latest =
        weatherData[weatherData.length - 1];


    const maximum =
        calculateMaximum();


    const heatwave =
        calculateHeatwaveCount();


    setText(
        "dataset-count",
        weatherData.length
    );


    setText(
        "hero-max",
        `${maximum.toFixed(1)}°`
    );


    setText(
        "hero-heatwave",
        heatwave
    );


    if (latest) {

        const temp =
            getTemperature(latest);

        setText(
            "hero-temperature",
            `${temp.toFixed(1)}°C`
        );

    }

}


/* =========================================================
   HEATWAVE
   ========================================================= */

function renderHeatwave() {

    const heatwaveCount =
        calculateHeatwaveCount();


    const total =
        weatherData.length;


    const percentage =
        total > 0
            ? Math.round(
                (heatwaveCount / total) * 100
            )
            : 0;


    setText(
        "heatwave-big",
        heatwaveCount
    );


    setText(
        "heat-ring-value",
        `${percentage}%`
    );


    const ring =
        document.getElementById(
            "heat-ring-progress"
        );


    if (ring) {

        const circumference =
            2 * Math.PI * 48;

        const offset =
            circumference -
            (percentage / 100) * circumference;


        ring.style.strokeDasharray =
            circumference;

        ring.style.strokeDashoffset =
            circumference;


        setTimeout(() => {

            ring.style.strokeDashoffset =
                offset;

        }, 150);

    }


    const threshold =
        document.getElementById(
            "threshold-progress"
        );


    if (threshold) {

        const max =
            calculateMaximum();


        const visualPercentage =
            Math.min(
                100,
                Math.max(
                    0,
                    ((max - 30) / 15) * 100
                )
            );


        setTimeout(() => {

            threshold.style.width =
                `${visualPercentage}%`;

        }, 200);

    }

}


/* =========================================================
   TEMPERATURE CHART
   ========================================================= */

function renderChart() {

    const svg =
        document.getElementById(
            "temperature-chart"
        );


    const grid =
        document.getElementById(
            "chart-grid"
        );


    const line =
        document.getElementById(
            "chart-line"
        );


    const area =
        document.getElementById(
            "chart-area"
        );


    const pointsGroup =
        document.getElementById(
            "chart-points"
        );


    if (!svg ||
        !grid ||
        !line ||
        !area ||
        !pointsGroup) {

        return;

    }


    grid.innerHTML = "";
    pointsGroup.innerHTML = "";


    if (!weatherData.length) {
        return;
    }


    /*
       We use the first 20 readings so the graph
       remains visually clean.
    */

    const data =
        weatherData.slice(0, 20);


    const temperatures =
        data.map(getTemperature);


    const minTemp =
        Math.floor(
            Math.min(...temperatures) - 1
        );


    const maxTemp =
        Math.ceil(
            Math.max(...temperatures) + 1
        );


    const width = 900;
    const height = 360;

    const left = 45;
    const right = 20;

    const top = 20;
    const bottom = 40;


    const graphWidth =
        width - left - right;


    const graphHeight =
        height - top - bottom;


    /* GRID */

    const gridSteps = 6;


    for (let i = 0; i <= gridSteps; i++) {

        const y =
            top +
            (i / gridSteps) *
            graphHeight;


        const temp =
            maxTemp -
            (i / gridSteps) *
            (maxTemp - minTemp);


        const lineElement =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );


        lineElement.setAttribute(
            "x1",
            left
        );

        lineElement.setAttribute(
            "x2",
            width - right
        );

        lineElement.setAttribute(
            "y1",
            y
        );

        lineElement.setAttribute(
            "y2",
            y
        );

        lineElement.classList.add(
            "chart-grid-line"
        );


        grid.appendChild(
            lineElement
        );


        const label =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );


        label.setAttribute(
            "x",
            5
        );

        label.setAttribute(
            "y",
            y + 4
        );

        label.classList.add(
            "chart-label"
        );

        label.textContent =
            `${temp.toFixed(0)}°`;


        grid.appendChild(label);

    }


    /* POINTS */

    const points = [];


    data.forEach((row, index) => {

        const temp =
            getTemperature(row);


        const x =
            left +
            (index / Math.max(data.length - 1, 1))
            * graphWidth;


        const y =
            top +
            (
                (maxTemp - temp) /
                (maxTemp - minTemp)
            ) *
            graphHeight;


        points.push({
            x,
            y,
            temp,
            row
        });

    });


    /* LINE */

    const linePath =
        points
            .map(
                (point, index) =>
                    `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
            )
            .join(" ");


    line.setAttribute(
        "d",
        linePath
    );


    /* AREA */

    const areaPath =
        `${linePath}
         L ${points[points.length - 1].x} ${height - bottom}
         L ${points[0].x} ${height - bottom}
         Z`;


    area.setAttribute(
        "d",
        areaPath
    );


    /* DATA POINTS */

    points.forEach((point, index) => {

        const circle =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );


        circle.setAttribute(
            "cx",
            point.x
        );

        circle.setAttribute(
            "cy",
            point.y
        );

        circle.setAttribute(
            "r",
            5
        );


        circle.classList.add(
            "chart-point"
        );


        circle.addEventListener(
            "mouseenter",
            event => {

                showChartTooltip(
                    event,
                    point
                );

            }
        );


        circle.addEventListener(
            "mouseleave",
            hideChartTooltip
        );


        pointsGroup.appendChild(
            circle
        );

    });


    setText(
        "chart-range",
        `${data.length} observations`
    );

}


/* =========================================================
   CHART TOOLTIP
   ========================================================= */

function showChartTooltip(event, point) {

    const tooltip =
        document.getElementById(
            "chart-tooltip"
        );


    if (!tooltip) return;


    const row =
        point.row;


    const region =
        getRegion(row);


    const timestamp =
        getTimestamp(row);


    setText(
        "tooltip-region",
        region
    );


    setText(
        "tooltip-temp",
        `${point.temp.toFixed(1)}°C`
    );


    setText(
        "tooltip-time",
        timestamp
    );


    const wrapper =
        document.querySelector(
            ".chart-wrapper"
        );


    const rect =
        wrapper.getBoundingClientRect();


    let x =
        event.clientX -
        rect.left +
        12;


    let y =
        event.clientY -
        rect.top -
        50;


    if (x > rect.width - 160) {

        x -= 150;

    }


    tooltip.style.left =
        `${x}px`;


    tooltip.style.top =
        `${y}px`;


    tooltip.classList.add(
        "visible"
    );

}


function hideChartTooltip() {

    const tooltip =
        document.getElementById(
            "chart-tooltip"
        );


    if (tooltip) {

        tooltip.classList.remove(
            "visible"
        );

    }

}


/* =========================================================
   STATIONS
   ========================================================= */

function renderStations() {

    const container =
        document.getElementById(
            "station-grid"
        );


    if (!container) return;


    container.innerHTML = "";


    const stations =
        getStations();


    setText(
        "station-count",
        `${stations.length} stations`
    );


    stations.forEach(station => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "station-card";


        const status =
            station.temperature >=
            HEATWAVE_THRESHOLD
                ? "heatwave"
                : "normal";


        const statusText =
            status === "heatwave"
                ? "HEATWAVE"
                : "NORMAL";


        card.innerHTML = `

            <div class="station-label">
                Station ${station.id}
            </div>

            <div class="station-name">
                ${station.region}
            </div>

            <div class="station-temp">
                ${station.temperature.toFixed(1)}°C
            </div>

            <div class="station-status ${status}">
                ${statusText}
            </div>

        `;


        card.addEventListener(
            "click",
            () => {

                filterTableByRegion(
                    station.region
                );

                scrollToSection(
                    "weather"
                );

            }
        );


        container.appendChild(
            card
        );

    });

}


/* =========================================================
   TABLE
   ========================================================= */

function renderTable(
    data = weatherData
) {

    const tbody =
        document.getElementById(
            "weather-table"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    if (!data.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="loading"
                >
                    No matching readings found.
                </td>

            </tr>

        `;

        return;

    }


    data.forEach(row => {

        const temperature =
            getTemperature(row);


        const fahrenheit =
            (temperature * 9 / 5) + 32;


        const heatwave =
            temperature >=
            HEATWAVE_THRESHOLD;


        const tr =
            document.createElement(
                "tr"
            );


        tr.innerHTML = `

            <td>
                ${getDataId(row)}
            </td>

            <td>
                ${getTimestamp(row)}
            </td>

            <td class="region-cell">
                ${getRegion(row)}
            </td>

            <td class="temperature-cell">
                ${temperature.toFixed(1)} °C
            </td>

            <td>
                ${fahrenheit.toFixed(1)} °F
            </td>

            <td>
                Station ${getStationId(row)}
            </td>

            <td>

                <span class="badge ${
                    heatwave
                        ? "heatwave"
                        : "normal"
                }">

                    ${
                        heatwave
                            ? "HEATWAVE"
                            : "NORMAL"
                    }

                </span>

            </td>

        `;


        tbody.appendChild(
            tr
        );

    });

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "search-input"
        );


    if (!input) return;


    input.addEventListener(
        "input",
        applyTableFilters
    );

}


/* =========================================================
   FILTER
   ========================================================= */

function setupFilter() {

    const filter =
        document.getElementById(
            "status-filter"
        );


    if (!filter) return;


    filter.addEventListener(
        "change",
        applyTableFilters
    );

}


function applyTableFilters() {

    const searchInput =
        document.getElementById(
            "search-input"
        );


    const statusFilter =
        document.getElementById(
            "status-filter"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const status =
        statusFilter
            ? statusFilter.value
            : "all";


    const filtered =
        weatherData.filter(row => {

            const region =
                getRegion(row)
                    .toLowerCase();


            const temperature =
                getTemperature(row);


            const isHeatwave =
                temperature >=
                HEATWAVE_THRESHOLD;


            const matchesSearch =
                !search ||
                region.includes(search);


            const matchesStatus =
                status === "all" ||
                (
                    status === "heatwave" &&
                    isHeatwave
                ) ||
                (
                    status === "normal" &&
                    !isHeatwave
                );


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    renderTable(filtered);

}


/* =========================================================
   FILTER FROM STATION CARD
   ========================================================= */

function filterTableByRegion(region) {

    const input =
        document.getElementById(
            "search-input"
        );


    const filter =
        document.getElementById(
            "status-filter"
        );


    if (input) {

        input.value =
            region;

    }


    if (filter) {

        filter.value =
            "all";

    }


    renderTable(
        weatherData.filter(
            row =>
                getRegion(row)
                    .toLowerCase()
                    === region.toLowerCase()
        )
    );

}


/* =========================================================
   GET STATIONS
   ========================================================= */

function getStations() {

    const map =
        new Map();


    weatherData.forEach(row => {

        const id =
            getStationId(row);


        const temperature =
            getTemperature(row);


        const region =
            getRegion(row);


        if (!map.has(id)) {

            map.set(
                id,
                {
                    id,
                    region,
                    temperature
                }
            );

        }

        else {

            const station =
                map.get(id);


            /*
               Use the most recent/highest
               available observation.
            */

            if (
                temperature >
                station.temperature
            ) {

                station.temperature =
                    temperature;

            }

        }

    });


    return Array.from(
        map.values()
    )
    .sort(
        (a, b) =>
            Number(a.id) -
            Number(b.id)
    );

}


/* =========================================================
   DATA HELPERS
   ========================================================= */

function getTemperature(row) {

    /*
       Your PostgreSQL API currently returns:

       data_id
       timestamp
       temperature
       longitude
       latitude
       region
       station_id

       This helper also supports object-style
       API responses.
    */

    if (Array.isArray(row)) {

        return Number(row[2]);

    }


    return Number(
        row.temperature ??
        row.maximum_temperature ??
        row.max_temperature ??
        0
    );

}


function getRegion(row) {

    if (Array.isArray(row)) {

        return row[5];

    }


    return (
        row.region ??
        row.location ??
        "Unknown"
    );

}


function getStationId(row) {

    if (Array.isArray(row)) {

        return row[6];

    }


    return (
        row.station_id ??
        row.stationId ??
        "—"
    );

}


function getDataId(row) {

    if (Array.isArray(row)) {

        return row[0];

    }


    return (
        row.data_id ??
        row.id ??
        "—"
    );

}


function getTimestamp(row) {

    let value;


    if (Array.isArray(row)) {

        value = row[1];

    }

    else {

        value =
            row.timestamp ??
            row.time ??
            row.date;

    }


    if (!value) {

        return "—";

    }


    /*
       Make timestamp visually compact.
    */

    try {

        const date =
            new Date(value);


        if (!isNaN(date)) {

            return date
                .toISOString()
                .slice(0, 16)
                .replace("T", " ");

        }

    }

    catch (error) {

        console.warn(
            "Timestamp formatting error",
            error
        );

    }


    return String(value);

}


/* =========================================================
   CALCULATIONS
   ========================================================= */

function calculateAverage() {

    if (!weatherData.length) {
        return 0;
    }


    const total =
        weatherData.reduce(
            (sum, row) =>
                sum + getTemperature(row),
            0
        );


    return total /
        weatherData.length;

}


function calculateMaximum() {

    if (!weatherData.length) {
        return 0;
    }


    return Math.max(
        ...weatherData.map(
            getTemperature
        )
    );

}


function calculateMinimum() {

    if (!weatherData.length) {
        return 0;
    }


    return Math.min(
        ...weatherData.map(
            getTemperature
        )
    );

}


function calculateHeatwaveCount() {

    return weatherData.filter(
        row =>
            getTemperature(row)
            >= HEATWAVE_THRESHOLD
    ).length;

}


/* =========================================================
   STATISTIC HELPER
   ========================================================= */

function getStatistic(
    possibleKeys,
    fallback
) {

    if (!statistics) {

        return fallback;

    }


    for (
        const key of possibleKeys
    ) {

        if (
            statistics[key] !==
            undefined &&
            statistics[key] !==
            null
        ) {

            return Number(
                statistics[key]
            );

        }

    }


    return fallback;

}


/* =========================================================
   TEXT HELPER
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   ERROR STATE
   ========================================================= */

function showConnectionError() {

    const tbody =
        document.getElementById(
            "weather-table"
        );


    if (tbody) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="loading"
                >

                    Unable to load climate data.
                    Check that Flask and PostgreSQL
                    are running.

                </td>

            </tr>

        `;

    }


    setText(
        "average-temperature",
        "--.- °C"
    );

    setText(
        "maximum-temperature",
        "--.- °C"
    );

    setText(
        "minimum-temperature",
        "--.- °C"
    );

    setText(
        "heatwave-count",
        "--"
    );

}