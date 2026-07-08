const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add('show');

        }

    });

});

window.addEventListener("scroll", () => {

    const header = document.querySelector(".header");

    header.classList.toggle("scrolled", window.scrollY > 50);

});

document
.querySelectorAll('.card, .hero-card')
.forEach(el => observer.observe(el));


