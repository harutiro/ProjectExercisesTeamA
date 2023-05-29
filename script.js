window.onload = function () {
    let ptArr = getLS('pts');
    if (ptArr == null) {
        ptArr = [0, 0, 0, 0, 0, 0];
        setLS('pts', ptArr);
    }
    initScores();
}