
import memberForm from './member-form.js';
import memberModel from './member-model.js';
import memberService from './member-service.js';
const membersData = [];

const Members = {
    data: membersData,
    form: memberForm,
    model: memberModel,
    service:memberService
};



export { Members }; 

//Refactor already but not work
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

function createOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
}

function populateSelect(selectElement, options) {
    options.forEach(option => {
        selectElement.appendChild(createOption(option.id, option.name_en));
    });
}

function clearSelect(selectElement) {
    selectElement.innerHTML = '<option value="">Select</option>';
}

async function populateProvinces(data) {
    const provincesSelect = document.getElementById('provinces');
    populateSelect(provincesSelect, data);
    provincesSelect.addEventListener('change', () => handleProvinceChange(data));
}

function handleProvinceChange(data) {
    const selectedProvinceId = Number(document.getElementById("provinces").value);
    const amphureSelect = document.getElementById('amphureSelect');
    clearSelect(amphureSelect);

    if (selectedProvinceId) {
        amphureSelect.disabled = false;
        const selectedProvince = data.find(province => province.id === selectedProvinceId);
        populateSelect(amphureSelect, selectedProvince.amphure);
        amphureSelect.addEventListener('change', () => handleAmphureChange(data));
    } else {
        amphureSelect.disabled = true;
    }
}

function handleAmphureChange(data) {
    const selectedAmphureId = Number(document.getElementById('amphureSelect').value);
    const tambolSelect = document.getElementById('tambolSelect');
    clearSelect(tambolSelect);

    if (selectedAmphureId) {
        tambolSelect.disabled = false;
        const selectedAmphure = data
            .flatMap(province => province.amphure)
            .find(amphure => amphure.id === selectedAmphureId);
        
        populateSelect(tambolSelect, selectedAmphure.tambon);
        tambolSelect.addEventListener('change', updateZipCode);
        setupZipCodeSubmission();
    } else {
        tambolSelect.disabled = true;
    }
}

function updateZipCode() {
    const zipcode = document.getElementById('tambolSelect').value;
    document.getElementById("zipcode").textContent = `ZipCode: ${zipcode}`;
}

function setupZipCodeSubmission() {
    const submitZipcode = document.getElementById('save');
    const inputZipcode = document.getElementById('txtZipCode');
    const tambolSelect = document.getElementById('tambolSelect');

    submitZipcode.addEventListener('click', () => {
        inputZipcode.value = tambolSelect.value;
    });
}

async function initializeSelects() {
    try {
        const data = await fetchData('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
        await populateProvinces(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

window.onload = initializeSelects;