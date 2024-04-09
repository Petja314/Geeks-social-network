const checkLocation = (pathname: string, paths: string[]) => {
    const pathToCheck = pathname.split("/")[1];
    return paths.some(path => path === pathToCheck);
}

export default checkLocation;