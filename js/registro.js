document.addEventListener('DOMContentLoaded', ()=>{

const form = document.getElementById('form');


form.addEventListener('submit', (e)=>{
    e.preventDefault()
const data = new FormData(form);
const person =  JSON.parse(localStorage.getItem('records') ?? '[]');

const Exist = person.find(person => person.cedula == data.get('cedula'));

if(Exist){

    const el = document.createElement('p');
    el.textContent = 'El participante ya se encuentra registrado';
    el.style.color = 'red';
    el.style.fontSize = '16px';
    el.style.fontWeight = 'bold';
    el.style.textAlign = 'center';
    form.appendChild(el);   
    setTimeout(() => {
        el.remove();
    }
    , 3000);
    return;
}


const people = { 
    name: data.get('nombre'),
    cedula: data.get('cedula'),
    municipio: data.get('municipio'),
    age: data.get('edad'),
    presente: false,
}

const localdata = localStorage.getItem('records');
let records = [];
if(localdata){
    records = JSON.parse(localdata);
}
records.push(people);
localStorage.setItem('records', JSON.stringify(records));
form.reset()

const el = document.createElement('p');
el.textContent = 'Participante registrado con exito';
el.style.color = 'green';
el.style.fontSize = '16px';
el.style.fontWeight = 'bold';
el.style.textAlign = 'center';
form.appendChild(el);
setTimeout(() => {
    el.remove();
} , 3000);


})












})