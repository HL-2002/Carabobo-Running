document.addEventListener('DOMContentLoaded', ()=>{

const form = document.getElementById('form');


form.addEventListener('submit', (e)=>{
    e.preventDefault()
const data = new FormData(form);

const people = { 
    name: data.get('nombre'),
    cedula: data.get('cedula'),
    municipio: data.get('municipio'),
    age: data.get('edad'),
}

const localdata = localStorage.getItem('records');
let records = [];
if(localdata){
    records = JSON.parse(localdata);
}
records.push(people);
localStorage.setItem('records', JSON.stringify(records));

form.reset()
})












})