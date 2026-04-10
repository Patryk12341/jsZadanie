class Zgloszenie {
    constructor(id, klient, urzadzenie, cena) {
        this.id = id;
        this.klient = klient;
        this.urzadzenie = urzadzenie;
        this.cena = parseFloat(cena);
        this.status = 'Aktywne';
    }
}

let bazaZgloszen = [];

const formularz = document.getElementById('formularz-zgloszenia');
const kontenerListy = document.getElementById('lista-zgloszen');
const wyswietlaczSumy = document.getElementById('suma-wartosc');

function zaladujZPamieci() {
    const dane = localStorage.getItem('moje_zlecenia');
    if (dane) {
        bazaZgloszen = JSON.parse(dane);
        wyswietlZgloszenia();
    }
}

formularz.addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Pobieramy wartości z pól
    const klient = document.getElementById('nazwaKlienta').value;
    const urzadzenie = document.getElementById('typUrzadzenia').value;
    const cena = document.getElementById('cenaUslugi').value;

    const noweZgloszenie = new Zgloszenie(Date.now(), klient, urzadzenie, cena);

    bazaZgloszen.push(noweZgloszenie);
    zapiszIDzialaj();
    formularz.reset();
});

function zapiszIDzialaj() {
    localStorage.setItem('moje_zlecenia', JSON.stringify(bazaZgloszen));
    wyswietlZgloszenia();
}

function wyswietlZgloszenia() {
    kontenerListy.innerHTML = '';
    let suma = 0;

    bazaZgloszen.forEach(function(sprzet) {
        const karta = document.createElement('div');
        karta.className = 'karta-zgloszenia';
        
        if(sprzet.status === 'Zakończone') {
            karta.classList.add('status-zakonczone');
        }

        karta.innerHTML = `
            <h3>${sprzet.urzadzenie}</h3>
            <p><strong>Klient:</strong> ${sprzet.klient}</p>
            <p><strong>Cena:</strong> ${sprzet.cena} zł</p>
            <p><strong>Status:</strong> ${sprzet.status}</p>
            <div class="przyciski-karty">
                <button class="btn-status" onclick="zmienStatus(${sprzet.id})">Zmień Status</button>
                <button class="btn-usun" onclick="usunZgloszenie(${sprzet.id})">Usuń</button>
            </div>
        `;

        kontenerListy.appendChild(karta);
        suma += sprzet.cena;
    });

    wyswietlaczSumy.innerText = suma.toFixed(2) + ' PLN';
}

function usunZgloszenie(id) {
    bazaZgloszen = bazaZgloszen.filter(z => z.id !== id);
    zapiszIDzialaj();
}

function zmienStatus(id) {
    const znalezione = bazaZgloszen.find(z => z.id === id);
    if (znalezione) {
        znalezione.status = (znalezione.status === 'Aktywne' ? 'Zakończone' : 'Aktywne');
        zapiszIDzialaj();
    }
}
zaladujZPamieci();