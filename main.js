$(document).ready(function() {
    const dataBase = window.localStorage;
    
    const inputBusqueda = $('#busqueda');
    const boton = $('#btnBuscar');
    const resultado = $('#resultado');
    
    const filter = () => {
        const users = JSON.parse(dataBase.getItem('usuarios'));
        const options = {
            keys: ['id', 'nombre', 'apellido', 'telefono', 'direccion'],
            includeScore: true,
            threshold: 0.0, // Establece el umbral para que coincida exactamente
            distance: 0 
        };
        
        const fuse = new Fuse(users, options);
        
        let usuariosEncontrados = fuse.search(inputBusqueda.val());
        
        resultado.empty();
        
        if (usuariosEncontrados.length === 0) {
            resultado.append('<li>No se encontraron resultados</li>');
        } else {
            for(let contacto of usuariosEncontrados){
                resultado.append(`
                    <li>
                        ${contacto.item.nombre} ${contacto.item.apellido} <span style="margin-left: 25px;">  <b>| Telefono:</b> ${contacto.item.telefono} 
                        <span style="margin-left: 25px;"> <b>| Direccion:</b> ${contacto.item.direccion}
                    </li>
                `);
            }
        }
    }

    boton.on('click', filter);
    
    $('.btn-agregar-contacto').on('click', function() {
        let contacto = {
            id: Math.random(1, 1000),
            nombre: $('.nombre').val(),
            apellido: $('.apellido').val(),
            telefono: $('.telefono').val(),
            direccion: $('.direccion').val(),
        }
        guardarContacto(dataBase, contacto);
    });

    const guardarContacto = (dataBase, contacto) => {
        let entradas = JSON.parse(dataBase.getItem('usuarios')) || [];
        entradas.push(contacto)
        dataBase.setItem('usuarios', JSON.stringify(entradas))
        window.location.href = '/'
    }

    const subirContactos = (dataBase, parentNode) => {
        let ids = Object.keys(dataBase)
        
        for(id of ids){
            let contactos = JSON.parse(dataBase.getItem('usuarios'))
            for(contacto of contactos){
                crearContacto(parentNode, contacto, dataBase)
            }
        }
    }

    const crearContacto = (parentNode, contacto, dataBase) => {
        let boxContacto = $('<div class="tarea"></div>');
        let nombreContacto = $(`<p>${contacto.nombre}</p>`);
        let apellidoContacto = $(`<p>${contacto.apellido}</p>`);
        let telefonoContacto = $(`<p>${contacto.telefono}</p>`);
        let direccionContacto = $(`<p>${contacto.direccion}</p>`);
        let icon = $('<span class="material-symbols-outlined icono">delete</span>');

        boxContacto.append(nombreContacto, apellidoContacto, telefonoContacto, direccionContacto, icon);

        parentNode.append(boxContacto);

        icon.on('click', function() {
            let entradas = JSON.parse(dataBase.getItem('usuarios')) || [];
            let index = entradas.map((entrada) => entrada['id']).indexOf(contacto.id)
            entradas.splice(index, 1)
            dataBase.setItem('usuarios', JSON.stringify(entradas))
            window.location.href = ('/')
        });
    }

    subirContactos(dataBase, $('.listado'));
});



