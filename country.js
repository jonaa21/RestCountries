var countryData = [];

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

function populateCountryInfo(selectedCountry){
    if (selectedCountry){
        document.getElementById('capital').innerHTML = selectedCountry.capital;
        document.getElementById('timezone').innerHTML = selectedCountry.timezones[0];
        document.getElementById('language').innerHTML = selectedCountry.languages[0].name;
        document.getElementById('currency').innerHTML = selectedCountry.currencies[0].name;

        const countryTable = document.getElementById('regionInfo');
        countryTable.innerHTML='';
        selectedCountry.regionalBlocs.forEach(region =>{
            const html = `
            <tr>
                <td>${region.acronym}</td>
                <td>${region.name}</td>
            </tr>
            `;
            countryTable.innerHTML += html;
        });
        //Flag
        document.getElementById('flag').setAttribute('src', selectedCountry.flag);

    //    Borders
        const borders = document.getElementById('borders');
        borders.innerHTML='';
        selectedCountry.borders.forEach(border => {
            const html = `
            <li>${border}</li>
            `;
            borders.innerHTML += html;
        });
        geoLocation(selectedCountry);
    }

    function geoLocation(country) {
        const location = document.getElementById('maps');
        let template = 'https://www.openstreetmap.org/#map=6/'+
            country.latlng[0]+'/'+country.latlng[1]+'.png';
        const provider = new MM.TemplatedLayer(template);
        const map = new MM.Map(location, provider);
        map.setZoom(10).setCenter({ lat:country.latlng[0], lon:country.latlng[1] });
        location.innerHTML = map;
    }
}
