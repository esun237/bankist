"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

//Open and Close Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//Smooth navigation

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  console.log("e.target:", e.target);
  console.log("this:", this);
  const id = e.target.getAttribute("href");
  if (e.target.classList.contains("nav__link")) {
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//Building a tabbed component
const tabs = document.querySelectorAll(".operations__tab");
const contents = document.querySelectorAll(".operations__content");
const tabContainer = document.querySelector(".operations__tab-container");

tabContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".operations__tab");
  if (!clicked) return;

  //Remove active tabs and active contents
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  contents.forEach((content) =>
    content.classList.remove("operations__content--active")
  );

  //activate clicked tab and conent
  clicked.classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//Menu fade animation
const nav = document.querySelector(".nav");

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

//Sticky navigation - the intersection observer API
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshhold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Revealing Elements on Scroll
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

//Lazy Loading Images

const allLazyImages = document.querySelectorAll("img[data-src]");

const fullLoadingImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(fullLoadingImage, {
  root: null,
  threshhold: 0,
  rootMargin: "200px",
});

allLazyImages.forEach((img) => imageObserver.observe(img));

//Building a slider component

//Remove the following codes as we don't need to re-scale these images
// const slider = document.querySelector(".slider");
// slider.style.transform = "scale(0.4) translateX(-800px)";
// slider.style.overflow = "visible";

//Slider function
const slider = function () {
  //defining variables
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  let currentSlide = 0;
  const maxSlide = slides.length - 1;
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");

  //functions
  const slideTransform = (currentSlide) => {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - currentSlide) * 100}%)`)
    );
  };

  //move to the next slide
  const nextSlide = () => {
    if (currentSlide === maxSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    slideTransform(currentSlide);
    activateDot(currentSlide);
  };

  //move to the previous slide
  const previousSlide = () => {
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide--;
    }
    slideTransform(currentSlide);
    activateDot(currentSlide);
  };

  // creating dots under slides
  const createDots = function () {
    slides.forEach(function (_, index) {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${index}"></button>`
      );
    });
  };

  // removing "active" from all dots
  // adding "active" class to current slide
  const activateDot = function (currentSlide) {
    document.querySelectorAll(".dots__dot").forEach((dot) => {
      dot.classList.remove("dots__dot--active");
      if (dot.dataset.slide === String(currentSlide)) {
        dot.classList.add("dots__dot--active");
      }
    });
  };

  //setting initial condition
  const init = function () {
    slideTransform(0);
    createDots();
    activateDot(0);
  };

  init();

  //Event handlers

  document.addEventListener("keydown", (e) => {
    e.key === "ArrowRight" && previousSlide();
    e.key === "ArrowLeft" && nextSlide();
  }); //enabling arrow key sliding

  btnLeft.addEventListener("click", nextSlide);
  btnRight.addEventListener("click", previousSlide);
  // enabling button clicking sliding

  dotsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dots__dot")) {
      const slideSelected = Number(e.target.dataset.slide);
      slideTransform(slideSelected);
      activateDot(slideSelected);
    }
  }); //enabling dots clicking sliding
};

slider();

//Tutorial************************************************************

// document.addEventListener("DOMContentLoaded", function (e) {
//   console.log("HTML loaded and parsed, and DOM tree is built!", e);
// });

// window.addEventListener("load", function (e) {
//   console.log("page fully loaded, including stylesheets and images!", e);
// });

// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = "";
// });
// const h1 = document.querySelector("h1");
// console.log("h1 childNodes: ", h1.childNodes);
// console.log("h1 children: ", h1.children);
// console.log("h1 first element child:", h1.firstElementChild);
// console.log("h1 last element child: ", h1.lastElementChild);
// h1.lastElementChild.style.color = "orangered";

// console.log("h1 parentNodes: ", h1.parentNode);
// console.log("h1 parentElement: ", h1.parentElement);

// console.log("h1 previousSibling: ", h1.previousSibling);
// console.log("h1 previousElementSibling: ", h1.previousElementSibling);

// console.log("h1 all siblings: ", h1.parentElement.children);
// [...h1.parentElement.children].forEach((el) => {
//   if (el !== h1) el.style.color = "blue";
// });

// document.querySelectorAll(".nav__link").forEach((el) => {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     console.log("e.target:", e.target);
//     console.log("el:", el);
//     console.log("this:", this);
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomRGB = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomRGB();
//   console.log("Link", e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
//   e.stopPropagation();
// });

// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomRGB();
//   console.log("Links Container", e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// });

// document.querySelector(".nav").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomRGB();
//   console.log("NAV", e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// });

// const h1 = document.querySelector("h1");
// const alertH1 = function (e) {
//   alert("Great! You are reading the header 😉");
//   h1.removeEventListener("mouseenter", alertH1);
// };
// h1.addEventListener("mouseenter", alertH1);

// setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 3000);

// const btnScrollTo = document.querySelector(".btn--scroll-to");
// const section1 = document.querySelector("#section--1");

// btnScrollTo.addEventListener("click", function () {
//   section1.scrollIntoView({ behavior: "smooth" });
// });
// console.log(logo.dataset.versionNumber);
// const logo = document.querySelector(".nav__logo");
// console.log(`logo class is: ${logo.className} `);
// console.log(`logo alt is: ${logo.alt}`);
// logo.alt = "Beautiful Logo";
// console.log(`logo alt is: ${logo.alt}`);

// console.log(`logo designer is: ${logo.designer}`);
// console.log(`logo designer is: ${logo.getAttribute("designer")}`);

// logo.setAttribute("company", "Bankist");
// console.log(`logo company is: ${logo.company}`);
// console.log(`logo company is: ${logo.getAttribute("company")}`);

// console.log(`logo absolute src is: ${logo.src}`);
// console.log(`logo relative src is: ${logo.getAttribute("src")}`);

// const link = document.querySelector(".nav__link");
// console.log(`logo absolute link is: ${link.href}`);
// console.log(`logo relative link is: ${link.getAttribute("href")}`);

//Creating and Inserting Elements
// const header = document.querySelector(".header");
// const message = document.createElement("div");
// message.classList.add("cookie-message");
// message.innerHTML =
//   "We use cookies for improved functionality. <button class='btn btn--close--cookie'>Got it!</button>";
// header.prepend(message);

// document
//   .querySelector(".btn--close--cookie")
//   .addEventListener("click", function () {
//     message.parentElement.removeChild(message);
//   });

// // Styles
// message.style.backgroundColor = "#37383d";
// message.style.width = "50%";

// console.log(`Message Style Color is ${message.style.color}`);
// console.log(
//   `Message Style Background Color is : ${message.style.backgroundColor}`
// );

// console.log(`message Style Color is ${getComputedStyle(message).color}`);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

// document.documentElement.style.setProperty("--color-primary", "#ff585f");

//Selecting elements
// console.log(document);
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// document.querySelector(".header");
// const allSections = document.querySelectorAll(".section");
// console.log(allSections);

// document.getElementById("section--1");
// const allButtons = document.getElementsByTagName("button");
// console.log(allButtons);

// console.log(document.getElementsByClassName("btn"));
