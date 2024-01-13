import React from 'react';
import circle from "../../assets/images/spinning-circles.svg";

export type PreloaderType = {
    isFetching : boolean
}

const Preloader = (props : PreloaderType) => {
    return (
        <div>
            {props.isFetching ? <img src={circle} /> : null}
        </div>
    );
};

export default Preloader;