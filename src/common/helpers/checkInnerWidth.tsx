// function to check if passed screen width is more than actual one 
const checkInnerWidth = (targetMaxScreenWidth: number) => {
    return targetMaxScreenWidth >= window.innerWidth; 
}

export default checkInnerWidth;