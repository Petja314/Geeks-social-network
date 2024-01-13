import React from "react";

export const ReactLazyWrappedHOC = (Component: any) => {
    return (props: any) => {
        return (
            <React.Suspense fallback={<>Loading...</>}>
        <Component {...props} />
        </React.Suspense>
    );
    }
    }