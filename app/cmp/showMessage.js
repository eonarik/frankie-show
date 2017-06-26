module.exports = function(message, type = 0){

	/* alert(message); */
    document.getElementById('toast').MaterialSnackbar.showSnackbar({
        message: message,
    });
}
