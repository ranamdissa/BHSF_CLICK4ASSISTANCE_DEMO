import React, {Component} from 'react';
import background from '../../images/ID300DPI_HighRes__VPB9418@2x.png'
const BackgroundImage = () => {

    const style = {
        backgroundImage:"url( " + background +" )",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }
    return(

        <div>
        <section style={style}></section>
        </div>
    )

}

export default BackgroundImage;
