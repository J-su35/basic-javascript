
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

//Original code
async function populateSelect() {
    try {
        // Step 1: Fetch data from the API
        const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
        
        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Step 2: Process the data (if needed)
        // Assume the data is an array of objects with 'id' and 'name' properties

        // Step 3: Populate the select element
        const provinces = document.getElementById('provinces');        
        
        data.forEach(_province => {
            const option = document.createElement('option');
            option.value = _province.id;  // Set the value attribute
            option.textContent = _province.name_en;  // Set the display text
            provinces.appendChild(option);  // Add the option to the select
        });

        document.getElementById('provinces').addEventListener('change', () => {
    
            let selectedProvice = Number(document.getElementById("provinces").value);
            
            if (selectedProvice) {   
                amphureSelect.disabled = false;
        
                let provinceIndex = data[selectedProvice - 1].amphure;
                
                const Amphure = document.getElementById('amphureSelect');        
                
                
                provinceIndex.forEach(_amphure => {
                    const option = document.createElement('option');
                    option.value = _amphure.id;  // Set the value attribute
                    option.textContent = _amphure.name_en;  // Set the display text
                    Amphure.appendChild(option);  // Add the option to the select
                });

                Amphure.addEventListener('change', () => {
                    let selectedAmphure = Number(Amphure.value);

                    if (selectedAmphure) {
                        tambolSelect.disabled = false;

                        const Tambol = document.getElementById('tambolSelect');

                        data.forEach(_amphure => {
                            
                            let _tambol = _amphure.amphure.filter(_amphureId => {
                                return _amphureId.id == selectedAmphure;
                            });
                            if (_tambol.length > 0) {
                                _tambol.forEach(_Tambol => {
                                    _Tambol.tambon.forEach(T3 => {
                                        const optionFortambol = document.createElement('option');
                                        optionFortambol.value = T3.zip_code;  // Set the value attribute
                                        optionFortambol.textContent = T3.name_en;  // Set the display text
                                        Tambol.appendChild(optionFortambol);  // Add the option to the select
                                    });
                                });                                
                            }                            
                        });
                        
                        Tambol.addEventListener('change', () => {
                            document.getElementById("zipcode").innerHTML = `ZipCode : ${Tambol.value}`;
                        })
                        
                        const submitZipcode = document.getElementById('save');
                        const inputZipcode = document.getElementById('txtZipCode');
                        const modalForm = document.getElementById('exampleModal');
                        submitZipcode.addEventListener('click', (zip) => {
                            const zipCodevalue = Tambol.value;
                            inputZipcode.value = zipCodevalue;
                        });
                    }
                });
            }
        });

        
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}

window.onload = populateSelect;

//example
// function amp(data) {
//     // console.log(data);
//     let _Amphure = data[0].amphure;
//     _Amphure.forEach(_amphure => {
//       console.log(_amphure);
//     })
//   };

//example 2
// ProvinceData.forEach((_amp) => {
// console.log(_amp);
//     let a3 = _amp.amphure.filter(_ampId => {
//       return _ampId.id == 1001;
//     });
//     if (a3.length > 0) {
//       console.log("Hi");
//       console.log(a3);
//     }
//   });