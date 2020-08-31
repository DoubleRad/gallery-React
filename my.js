const e = React.createElement ;

function show(){
    var btn = document.getElementById('showbtn');
    var obj = document.getElementById('inputpanel');

    btn.addEventListener('click' , ()=>{
        obj.classList.toggle('hidden')
    })
}

show();

//Скрипты галереи на реакте

        class Gallery1 extends React.Component{
            constructor( props ){
                super( props ) ;
                this.state = { images: [ ] } ;
                this.deleteImg = this.deleteImg.bind( this );

            }

            componentDidMount( ) {
                fetch( '/files' )
                .then( resp => resp.json() )
                .then( arr => { this.setState( { images: arr } ) }/* console.log */)
            }

            render( ){
                return <div className="gallery_padding">
                    { this.state.images.map( x => 
                        <div className="gal-img">
                            <div className="img-box">
                                <img src={ '/images/' + x.src } />
                                <span>{x.desc}</span>
                                <div mysrc = {x.src} className='delete_btn' onClick = { () => this.deleteImg(x.src)} >Удалить</div>
                            </div>
                        </div>
                        )}
                    </div>
            }

            deleteImg( s ) {
                // s = это переменная, в которой приходит src из обьекта общего
                fetch('/remove?src=' + s)
                .then( r => r.json( ) )
                .then( arr => { this.setState( { images: arr } ) } )
                /*
                    console.log(s)
                    console.log( event.target.getAttribute('mysrc') )
                */
            }

        }

        ReactDOM.render( 

            e ( Gallery1 , {} , null ) ,
            document.getElementById( 'gallery' ) 

        )

        //Отправка запроса удаления

        