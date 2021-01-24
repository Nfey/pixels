function startTickTimer(seconds, map){
    setTimeout(seconds * 1000, () => tick())
}
function stopTickTimer(){

}
function tick(){    // Runs when timer goes off
    // Import database access here

    // Call combat management functions here. Insert pixel and map info from database as parameters 

    // Call currency adjustment functions here:
    // Function 1: Updates the database so that users' resources are subtracted for each new pixel they placed (may need to go before combat management)
    // Function 2: Updates the database so that users are awarded gold based on votes since last time


    if (currentTick == tickTotal){
        //Run end-of-game sequence

    }
    currentTick++
}
