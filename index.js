require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

console.log(process.env.MAPBOX_KEY);

const main = async () => {
    let opt;
    const busquedas = new Busquedas();
    
    do {

        opt = await inquirerMenu( );
        switch ( opt ) {
            case 1:
                //mostrar mensaje 
                const termino = await leerInput('Ciudad: ');

                //buscar los lugares
                const lugares = await busquedas.ciudad( termino );

                //seleccionar el lugar 
                const idSeleccionado = await listarLugares( lugares );                
                if ( idSeleccionado === '0') continue; 

                const lugarSeleccionado = lugares.find( l => l.id === idSeleccionado);
                
                busquedas.agregarHistorial( lugarSeleccionado.nombre );
                //Clima
                const clima = await busquedas.climaLugar( lugarSeleccionado.lat, lugarSeleccionado.lng);
                
                //mostrar resultados 
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre.green );
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Máxima:', clima.max);
                console.log('Mínima:', clima.min);
                console.log('Cómo está el clima:', clima.desc.green);
                break;

                case 2:
                    busquedas.historialCapitalizado.forEach( (lugar, indice) => {
                        const idx = `${ indice + 1 }.`.green;
                        console.log( `${ idx } ${ lugar } `);
                    });
                    break;

        }

        if ( opt !== 0 )  await pausa();

    } while( opt !== 0)
} //main


main();