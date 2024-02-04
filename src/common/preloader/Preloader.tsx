import React from 'react';
import circle from "../../assets/images/spinning-circles.svg";

export type PreloaderType = {
    isFetching : boolean
}

const Preloader = (props : PreloaderType) => {
    // debugger
    return (
        <div>
            {/*<img src={circle} />*/}
            {props.isFetching ?  <div>Loading...</div> : null}
        </div>
    );
};

export default Preloader;