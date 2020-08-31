const http = require( 'http' ) ;
const fs   = require('fs') ;
const formidable = require( 'formidable' ) ;
 
function flushFile( response, fileName ) {
    fs.readFile( fileName, (err, data) => {
        if( err ) {
            console.error( err ) ;
            return ;
        }
        response.end( data ) ;
    });
}
 
function serverFunction( request, response ) {

    var url = request.url.substr( 1 ) ;  // Убираем первый символ (/) из запроса
    var method = request.method.toUpperCase() ;

    //Обрабатываю запрос удаления
urlParts = url.split( '?' ) ; 
if( urlParts.length > 1) {
    dataParts = urlParts [ 1 ].split( '=' ) ;
    if( urlParts[0] == 'remove' && dataParts[0] == 'src' ) {
        //Команда на удаление по src : dataParts[1]

        fs.readFile( 'gallery.json' , (err, data)=>{
            // Из файлов в обьект
            var filesList = JSON.parse( data ) ;
            // Нашли - удалили, не нашли - попытка атаки
            var remList = [];
            for( let x of filesList ) {
                if( x.src != dataParts[1]) {
                    remList.push( x ) ;
                }
            }

            // console.log( remList ) ;
            
            // переводим JSON в стрку
            var jList = JSON.stringify( remList )
            // console.log( jList ) ;

            // Сохраняем
            fs.writeFile( 'gallery.json', jList , ()=>{} ) ;
            //Отправляем ответ - измененный список файлов ( jList )
            response.end( jList ) ;
        } ) ;


        return ;

    }
    
}
    
    if(method == 'POST' ){
        if( url == 'upload' ){  //Данные форм
            // Необходим пакет по работе с формами , особенно с файлами
            // npm i formidable

            var form = formidable.IncomingForm() ; //Обьект по работе с формами                 

            form.parse( request , function( err, fields, files ) {
                if( err ){
                    console.error( err ) ;
                    return;
                }
                    console.log( fields , files) ;
                if( files.galfile.size > 0 ) {
                    var rs = fs.createReadStream( files.galfile.path ) ; // Сохраненный файл формы
                    var ws = fs.createWriteStream( './images/' + files.galfile.name ) ;
                    rs.pipe( ws ) ; // Пайпинг - копирование файлов
                    // Добавляем данные в json (gallery.json)
                    fs.readFile( 'gallery.json' , (err, data)=>{
                        // Из файлов в обьект
                        var filesList = JSON.parse( data ) ;
                        // Добавили к обьекту новое имя
                        filesList.push( {"src": files.galfile.name, "desc": fields.galdescription} ) ;
                        // Сохраняем
                        fs.writeFile( 'gallery.json', JSON.stringify( filesList ), ()=>{} ) ;
                    } ) ;

                    // Отправляем домашнюю страницу
                    flushFile( response, 'home.html' ) ;

                    

                }
            } );

            return ;

        }
    }
 
    if( url == 'files' ) {  // Запрос /files - выдаем перечень файлов (gallery.json)
        url = 'gallery.json' ;
    }
    if( url == "" ) {  // Пустой запрос (localhost/) - домашняя страница
        url = 'home.html' ;
    }
    if( url == "questions" ) {  // Пустой запрос (localhost/) - домашняя страница
        response.end( JSON.stringify(
            [
                {id:1 , txt: 'Простота понимания кода' },
                {id:2 , txt: 'Быстрота оформ ления кода, создания модулей' },
                {id:4 , txt: 'Простота создания основных элементов' },
                {id:5 , txt: 'Удобство и гибкость настройки стилей элементов' }

            ]
        ) )
        return ;
    }
 
    if( fs.existsSync( url ) ) {
        flushFile( response, url ) ;
        return ;
    }

    
 
    response.end( "<h1>Gallery</h1>" ) ;
}
 
http.createServer( serverFunction ).listen( 88, () => {
    console.log( "Server starting..." ) ;
})


