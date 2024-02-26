document.addEventListener('DOMContentLoaded', function() {
const table = document.getElementById('body');
const peopleSelect = document.getElementById('people');
const dataTime  = document.getElementById('time');
const btnInicio = document.getElementById('time-submit');
const btnPresent = document.getElementById('presente');
const selectPresent = document.getElementById('idpeople');
const maraton = document.getElementById('maraton');
const ciclismo = document.getElementById('ciclismo');
const nado = document.getElementById('nado');


// distance in km
const DIST_MARATON = 10;
const DIST_NADO = 20;
const DIST_CICLISMO = 50;

// velocity in km/s
const VEL_MARATON = 7/3600;
const VEL_NADO = 6.192/3600;
const VEL_CICLISMO = 45/3600;

// interval to update the table
const INTERVAL = 1000;



const makePresent = (peoplePresent) => {

    peoplePresent.forEach(person => {
        const option = document.createElement('option');
        option.value = person.cedula;
        option.textContent = person.cedula;
        selectPresent.appendChild(option);
    })
    }




const peopleArray = JSON.parse(localStorage.getItem('records')) ?? [];

const peoplePresent =  peopleArray.filter(person => person.presente == false);

// render people present in the select element
makePresent(peoplePresent);



// add event listener to the button to change the state of the person
btnPresent.addEventListener('click', (e) => {

const cedula = selectPresent.value;

const peopleArray = JSON.parse(localStorage.getItem('records'));
const personselected = peopleArray.find (person => person.cedula == cedula);
personselected.presente = true;

localStorage.setItem('records', JSON.stringify(peopleArray));
const peopleisPresent =  peopleArray.filter(person => person.presente == true);
localStorage.setItem('race', JSON.stringify(peopleisPresent));   



const peoplePresent =  peopleArray.filter(person => person.presente == false);
selectPresent.innerHTML = '';
makePresent(peoplePresent);

})




// start the race
btnInicio.addEventListener('click', (e) => {

    btnPresent.disabled = true;
    selectPresent.disabled = true;
    btnInicio.disabled = true;
    dataTime.disabled = true;



    const initialArray = JSON.parse(localStorage.getItem('race')) ?? [];

    peopleSelect.innerHTML = '';
    
    initialArray.forEach(person => {
    const option = document.createElement('option');
    option.value = person.name;
    option.textContent = person.name;
    peopleSelect.appendChild(option);
})

    initialArray.forEach(person => {
        person.inicio1 = '';
        person.fin1 = '';
        person.inicio2 = '';
        person.fin2 = '';
        person.inicio3 = '';
        person.fin3 = '';
        person.total = 0;
        person.distance = 0;
    })
    localStorage.setItem('race', JSON.stringify(initialArray));



    window.race =  setInterval(()=>{
    // draw the table
    makeRow()

    // draw distance
    const peopleArray = JSON.parse(localStorage.getItem('race'));
    const personselected = peopleArray.find (person => person.name == peopleSelect.value);
    maraton.value =  personselected.distance;
    nado.value =  personselected.distance -  DIST_MARATON;
    ciclismo.value =   personselected.distance - DIST_NADO;
    }, INTERVAL);
    makeRow()
})

let finished;

const makeRow = () =>{
    const people = localStorage.getItem('race') ?? '[]';
    const nextPeople = []
const peopleArray = JSON.parse(people);


// sort by distance and end time
peopleArray.sort((a, b) => { 
    // calculate timer
    let timeA = a.fin3?.split(':') ?? "100:0:0";
    let timeB = b.fin3?.split(':') ?? "100:0:0";
    let secondsA = parseInt(timeA[0]) * 3600 + parseInt(timeA[1]) * 60 + parseInt(timeA[2]);
    let secondsB = parseInt(timeB[0]) * 3600 + parseInt(timeB[1]) * 60 + parseInt(timeB[2]);
   
    if(a.distance >= b.distance &&
        a.fin3 != "" &&
        b.fin3 != "" &&
        secondsA > secondsB) { return  1 }else{ return -1}
}
    )


//  clear the table
table.innerHTML = '';

peopleArray.forEach(person => {

    // create the elements of the table
    const row = document.createElement('tr');
    const name = document.createElement('td');
    const cedula = document.createElement('td')
    const muni = document.createElement('td')
    const age = document.createElement('td')
    const inicio1 = document.createElement('td')
    const fin1 = document.createElement('td')
    const inicio2 = document.createElement('td')
    const fin2 = document.createElement('td')
    const inicio3 = document.createElement('td')
    const fin3 = document.createElement('td')
    const total = document.createElement('td')
    const totalDis = document.createElement('td')


    name.textContent = person.name;
    cedula.textContent = person.cedula;
    muni.textContent = person.municipio;
    age.textContent = person.age;

    let distance = person.distance ?? 0;

    if (distance < DIST_MARATON){
       distance +=    Math.random() * (VEL_MARATON) + 1/1000 ; 
       
    }else if (distance < DIST_NADO){
        distance +=  Math.random() * (VEL_NADO) + 1/1000;
    }else if (distance < DIST_CICLISMO){
        distance +=   Math.random() * (VEL_CICLISMO) + 1/1000;
    }


    if (person.fin1 == ""  && distance >= DIST_MARATON ){
        let initTime = dataTime.value.split(':')[0] * 3600 + dataTime.value.split(':')[1] * 60
        let time = person.total + initTime
  
        let str = getStrTime(time)
        person.fin1 = str ;
        person.inicio2 = str;

    }else if (person.fin2 == "" && distance >= DIST_NADO){
        let initTime = dataTime.value.split(':')[0] * 3600 + dataTime.value.split(':')[1] * 60
        let time = person.total + initTime

        let str = getStrTime(time)
        person.fin2 = str ;
        person.inicio3 = str;
    }else if (person.fin3 == "" && distance >= DIST_CICLISMO){
        let initTime = dataTime.value.split(':')[0] * 3600 + dataTime.value.split(':')[1] * 60
        let time = person.total + initTime

        let str = getStrTime(time)
        person.fin3 = str ;
    }





    // set the values of the table
    inicio1.textContent = dataTime.value;
    fin1.textContent = person.fin1 ?? "";
    inicio2.textContent = person.inicio2 ?? "";
    fin2.textContent = person.fin2 ??  "";
    inicio3.textContent = person.inicio3 ?? "";
    fin3.textContent = person.fin3 ?? "";
    total.textContent = getStrTime(person.total);
    totalDis.textContent = (distance).toFixed(2) + " km";


    // append the values to the table
    row.appendChild(name);
    row.appendChild(cedula);
    row.appendChild(muni);
    row.appendChild(age);
    row.appendChild(inicio1);
    row.appendChild(fin1);
    row.appendChild(inicio2);
    row.appendChild(fin2);
    row.appendChild(inicio3);
    row.appendChild(fin3);
    row.appendChild(total);
    table.appendChild(row);
    row.appendChild(totalDis);

    person.distance = distance;
    if (person.fin3 == ""){
    person.total = parseInt(person.total) + 1
    }
    nextPeople.push(person)
})
localStorage.setItem('race', JSON.stringify(nextPeople));

// verify if al person has finished

if (finished == true && finished != undefined){
    clearInterval(window.race)
    finished = false;
    btnPresent.disabled = false;
    selectPresent.disabled = false;
    btnInicio.disabled = false;
    dataTime.disabled = false;
    return
}


 finished = true;

peopleArray.forEach(person => {
    if (person.fin3 == ""){
        finished = false;
    }
})




}

    
})


const getStrTime = (time) => {
    let hours = Math.floor(time / 3600);
    let minutes =   Math.floor((time % 3600) / 60);
    let seconds =  Math.floor(time % 60);
    return `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2, '0')}`
}

