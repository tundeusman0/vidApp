let showz = document.querySelectorAll(".admin_userLick")
let showing = document.querySelectorAll(".User_details");
console.log(showz)
console.log(showing)
for (let ind = 0; ind < showz.length; ind++) {
    showz[ind].addEventListener('click', () => {
        if (showing[ind].style.display === "none") {
            showing.forEach(show => show.style.display = "none");
            showing[ind].style.display = "flex";
        } else if (showing[ind].style.display === "flex") {
            showing.forEach(show => show.style.display = "none");
            showing[ind].style.display = "none";
        } else {
            showing.forEach(show => show.style.display = "none");
            showing[ind].style.display = "flex";
        }
    });
}