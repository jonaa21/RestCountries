var countryData = [];

const flag = document.getElementById('flag');
flag.style.display = 'none';

const bordersDiv = document.getElementById('borderDiv');
bordersDiv.style.display = 'none';

const table = document.getElementById('table');
table.style.display = 'none';

function makeCall(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            fillList(this)
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
}

makeCall('https://restcountries.eu/rest/v2/all');

function getCountryInfo() {
    const selectedCountry = countryData.find(country =>
        country.name === document.getElementById('selectCountry').value);
    populateCountryInfo(selectedCountry);
}

function fillList(xhttp) {
    if (JSON.parse(xhttp.responseText)) {
        countryData = JSON.parse(xhttp.responseText);
        const dataList = document.getElementById('selectCountry');
        countryData.forEach((country, index) => {
            const data = `
            <option value="${country.name}">${country.name}</option>
            `;
            dataList.innerHTML += data;
        })
    }
}

function populateCountryInfo(selectedCountry) {
    if (selectedCountry) {
        document.getElementById('capital').innerHTML = selectedCountry.capital;
        document.getElementById('timezone').innerHTML = selectedCountry.timezones[0];
        document.getElementById('language').innerHTML = selectedCountry.languages[0].name;
        document.getElementById('currency').innerHTML = selectedCountry.currencies[0].name;

        //Region
        initRegionalBlocs(selectedCountry);

        //Flag
        if (selectedCountry.flag) {
            flag.setAttribute('src', selectedCountry.flag);
            flag.style.display = 'block';
        }

        //    Borders
        initBorders(selectedCountry);

        //Map
        getGeolocation(selectedCountry);
    }
}

function initRegionalBlocs(country) {
    if (country.regionalBlocs.length > 0) {
        const countryTable = document.getElementById('regionInfo');
        countryTable.innerHTML = '';
        country.regionalBlocs.forEach(region => {
            const html = `
                <tr>
                    <td>${region.acronym}</td>
                    <td>${region.name}</td>
                </tr>
                `;
            countryTable.innerHTML += html;
        });
        table.style.display = 'table';
    }
}

function initBorders(country) {
    if (country.borders) {
        const borders = document.getElementById('borders');
        borders.innerHTML = '';
        country.borders.forEach(border => {
            const html = `
                <li>${border}</li>
                `;
            borders.innerHTML += html;
        });
        bordersDiv.style.display = 'inline';
    }
}

function getGeolocation(country) {
    let lat = country.latlng[0];
    let long = country.latlng[1];
    mymap.setView([lat, long], 4);
    L.marker([lat, long]).addTo(mymap);
}

const mymap = L.map('mapid');
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.' +
    'png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);

