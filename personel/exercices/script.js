function sendMessage(form) {
    //get the input with id firstname
    var firstname = document.getElementById("firstname");
    var lastname = document.getElementById("lastname");
    var email = document.getElementById("email");
    var cgu = document.getElementById("cgu");
    if (cgu.checked === false) {
        alert("Vous devez accepter les CGU");
        return false;
    }else {
        alert("Bonjour " + firstname.value + " " + lastname.value + " (" + email.value + ")")
        //Clear le form
        //form.reset();
    }
    return true;
}