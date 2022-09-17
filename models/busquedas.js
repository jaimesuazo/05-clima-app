const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath    = './db/database.json';

    constructor () {
        this.leerDB ();
    }

    get historialCapitalizado() {

        return this.historial.map( lugar => {
            let palabras = lugar.split( ' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join( ' ');
        });
    }

    get paramsMapBox() {
        return {                    
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsWheaters() {
       return  {
            appid: process.env.OPENWHEATER_KEY,
            units:'metric',
            lang:'es'
        }
    }

    async ciudad( lugar = '') {
        try {
            //petición http
            //console.log( 'ciudad: ', lugar);
            //const respuesta = await axios.get('https://reqres.in/api/users?page=2');

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapBox
            });
            const respuesta = await instance.get();
             return respuesta.data.features.map( lugar => ({
                 id: lugar.id,
                 nombre: lugar.place_name,
                 lng: lugar.center[0],
                 lat: lugar.center[1],
             }));
    
             // retornar los lugares que coincidan con 
        }
        catch ( error ) {
            
            return []; //si hay un error no se devuelve la exception sino que sólo se devuleve una arreglo vacío
        }
    }
    
    async climaLugar( lat, lon ) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWheaters ,
                    lat,
                    lon
                },

            });

            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log( 'climaLugar error', error  );
        }
    }

    agregarHistorial( lugar = '' ) {

        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            return;
        }

        this.historial.splice( 0, 5 );

        this.historial.unshift( lugar.toLocaleLowerCase() );

        this.guardarDB ();
    }

    guardarDB () {
        const payLoad = {
            historial : this.historial
        };
        fs.writeFileSync( this.dbPath, JSON.stringify( payLoad ));
    }

    leerDB () {
        if ( !fs.existsSync( this.dbPath) ) {
            return ;
        }

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8'});
        const data = JSON.parse( info ) ;

        this.historial = data.historial;


    }

} //de la clase 


module.exports = Busquedas;