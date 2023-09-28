"use strict";

// const { clearCache } = require("ejs");

const account1 = {
  owner: "Emma Sun",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-09-03T17:01:17.194Z",
    "2023-09-05T23:36:17.929Z",
    "2023-09-06T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions
// Create User Name
const createUserName = function (accs) {
  accs.forEach((acc) => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((el) => el[0])
      .join("");
  });
};

createUserName(accounts);

// Logout Timer
let currentAccount, timer;
const startLogOutTimer = function () {
  let time = 300;
  const countDown = function () {
    const minutes = String(Math.floor(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
    }
    time--;
  };
  countDown();
  timer = setInterval(countDown, 1000);
  console.log(timer, typeof timer);
  return timer;
};

//Logout button
const logOut = document.querySelector(".logout");
logOut.addEventListener("click", function () {
  window.location.href = "/index.html";
});

//Format currency
const formattedCur = function (value, locale, currency) {
  const options = {
    style: "currency",
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(value);
};

// Display dates
const displayDate = (dateString, locale) => {
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs((day2 - day1) / (1000 * 60 * 60 * 24)));
  const date = new Date(dateString);
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // const year = date.getFullYear();
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// Display Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formattedCur(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
  labelDate.textContent = displayDate(new Date());
};
// calcDisplayBalance(account1.movements);

// Display deposits or withdrawals
const diplayMovements = function (acc, sort = false) {
  let movements = acc.movements;
  let movementDates = acc.movementsDates;
  let paired = movements.map((value, index) => [value, movementDates[index]]);
  paired.sort((a, b) => a[0] - b[0]);
  const movs = sort ? paired.map((item) => item[0]) : movements;
  const movDates = sort ? paired.map((item) => item[1]) : movementDates;
  containerMovements.innerHTML = "";
  movs.forEach(function (movement, index) {
    const movementDate = displayDate(movDates[index], acc.locale);
    const type = movement > 0 ? "deposit" : "withdrawal";
    const numberFormatted = formattedCur(movement, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type} </div>
        <div class="movements__date">${movementDate}</div>
        <div class="movements__value">${numberFormatted}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// diplayMovements(account1.movements);

// Display In, Out and Interest Summary
const calcDisplaySummary = function (acc) {
  const inSummary = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formattedCur(
    inSummary,
    acc.locale,
    acc.currency
  )}`;
  const outSummary = acc.movements
    .filter((mov) => mov < 0)
    .map((mov) => Math.abs(mov))
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formattedCur(
    outSummary,
    acc.locale,
    acc.currency
  )}`;
  const interestRate = acc.interestRate / 100;
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => deposit * interestRate)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${formattedCur(
    interest,
    acc.locale,
    acc.currency
  )}`;
};

//Update UI
const updateUI = function (acc) {
  calcDisplayBalance(acc);
  diplayMovements(acc);
  calcDisplaySummary(acc);
};

// Event Handler User Login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    //remove user and pin; add logout
    inputLoginUsername.classList.add("hidden");
    inputLoginPin.classList.add("hidden");
    btnLogin.classList.add("hidden");
    logOut.classList.remove("hidden");
    //Clear user input
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  } else {
    labelWelcome.textContent = "Wrong user name or pin. Please try again!";
  }
});

// Transfer Money
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  const tranferAmount = Number(inputTransferAmount.value);
  const time = new Date().toISOString();
  if (
    tranferAmount > 0 &&
    receiverAcc &&
    receiverAcc !== currentAccount &&
    tranferAmount <= currentAccount.balance
  ) {
    currentAccount.movements.push(-tranferAmount);
    receiverAcc.movements.push(tranferAmount);
    currentAccount.movementsDates.push(time);
    receiverAcc.movementsDates.push(time);
    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferAmount.blur();
    //re-set timer
    clearInterval(timer);
    timer = startLogOutTimer();
    console.log(timer, typeof timer);
    updateUI(currentAccount);
  } else {
    alert(`Transfer not allowed!`);
    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferAmount.blur();
  }
});

// Ask for loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loan = Math.floor(inputLoanAmount.value);
  const time = new Date().toISOString();
  if (loan > 0 && currentAccount.movements.some((mov) => mov > loan * 0.1)) {
    currentAccount.movements.push(loan);
    currentAccount.movementsDates.push(time);
    clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
    inputLoanAmount.value = "";
  } else {
    alert("Loan rejected!");
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }
});

//Close Account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );

    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;

    //clear the content in "Close account"
    inputCloseUsername.value = inputClosePin.value = "";
    inputClosePin.blur();
  }
});

//Sorting movements
let sorted = false;
btnSort.addEventListener("click", function () {
  diplayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// // Tutorial

// const number = 1234567.89;
// console.log(
//   new Intl.NumberFormat("en-US", { style: "decimal" }).format(number)
// ); // "1,234,567.89"

// console.log(
//   new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
//     number
//   )
// ); // "$1,234.56"

// const percentage = 0.85;
// console.log(
//   new Intl.NumberFormat("en-US", { style: "percent" }).format(percentage)
// ); // "85%"

// const speed = 55;
// console.log(
//   new Intl.NumberFormat("en-US", {
//     style: "unit",
//     unit: "mile-per-hour",
//   }).format(speed)
// ); // "55 mi/h"

// console.log(
//   new Intl.NumberFormat("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(10)
// ); // "10.00"

// console.log(
//   new Intl.NumberFormat("en-US", { minimumIntegerDigits: 3 }).format(10)
// ); // "010"

// console.log(
//   new Intl.NumberFormat("en-US", { useGrouping: false }).format(1000)
// ); // "1000" instead of "1,000"

// const options = {
//   style: "currency",
//   currency: "EUR",
// };
// console.log(navigator.language);
// console.log(new Intl.NumberFormat(navigator.language, options).format(number));

// Lecture
// setInterval(() => {
//   const now = new Date();
//   const options = {
//     second: "numeric",
//     hour: "numeric",
//     minute: "numeric",
//   };
//   console.log(new Intl.DateTimeFormat("en-Au", options).format(now));
// }, 1000);
// const ingredients = ["mushroom", "spinach", "olives"];

// const pizzaTimer = setTimeout(
//   (ingr1, ingr2, ingr3) =>
//     console.log(
//       `Here is your pizza 🍕 made with ${ingr1} + ${ingr2} + ${ingr3}!`
//     ),
//   3000,
//   ...ingredients
// );
// console.log("Waiting for 3 seconds....");

// if (ingredients.includes("mushroom")) clearTimeout(pizzaTimer);

// Dates Formatted with Inernationalising API
// const now = new Date();
// console.log(new Intl.DateTimeFormat("en-US").format(now));
// console.log(new Intl.DateTimeFormat("en-AU").format(now));
// console.log(new Intl.DateTimeFormat("zh-CN").format(now));

// const options = {
//   hour: "numeric",
//   minute: "numeric",
//   day: "numeric",
//   month: "long",
//   year: "numeric",
//   weekday: "long",
// };
// console.log(new Intl.DateTimeFormat("en-AU", options).format(now));

// const options2 = {
//   hour: "numeric",
//   minute: "numeric",
//   day: "numeric",
//   month: "2-digit",
//   year: "numeric",
//   weekday: "short",
// };
// console.log(new Intl.DateTimeFormat("en-AU", options2).format(now));

// const locale = navigator.language;
// console.log(locale);
// console.log(new Intl.DateTimeFormat(locale, options).format(now));
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(Number(future));
// console.log(+future);

// const calcDaysPassed = (day1, day2) =>
//   Math.round(Math.abs((day2 - day1) / (1000 * 60 * 60 * 24)));

// console.log(
//   `Between now and future is ${calcDaysPassed(future, new Date())} days`
// );
// Create a date
// const now = new Date();
// console.log(now);

// console.log(new Date("Sep 09 2023 16:02:23"));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(2037, 10, 33, 15, 23, 5));

// console.log(new Date(0));
// console.log(new Date(3));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// console.log(new Date(3 * 1000));

// //Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(
//   future.getFullYear(),
//   future.getMonth(),
//   future.getDate(),
//   future.getDay(),
//   future.getHours(),
//   future.getMinutes(),
//   future.getSeconds()
// );

// console.log(future.toISOString());

// console.log(future.getTime());
// console.log(new Date(future.getTime()));

// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future);
// const huge = 223999959302845857299917n;
// const num = 23;
// console.log(huge * BigInt(num));
// console.log(huge + " is Really big!!!");

// console.log(20n > 15);
// console.log(20n === 20);
// console.log(20n == 20);
// console.log(typeof 20n);

// console.log(11n / 3n);
// console.log(11 / 3);

// let binaryLiteral = 0b1010_0001_1000_0101; // Binary format
// let hexLiteral = 0xa0_b0_c0; // Hexadecimal format

// console.log(`BinaryLiteral is: ${binaryLiteral}`);
// console.log(`Hex Literal is: ${hexLiteral}`);
// console.log(0b1010_0001_1000_0101);
// console.log(0b1010000110000101);
// console.log(0xa0b0c0);
// const diameter = 287_460_315_002;
// console.log(diameter);

// const price1 = 349_87;
// const price2 = 34_987;
// console.log(`price1: ${price1}; price2: ${price2}`);

// console.log(`PI: ${Math.PI}`);
// const PI = 3.14_15;
// console.log(PI);

// console.log(Number("230_000"));
// console.log(parseInt("230_000"));

// console.log(8 % 3);
// const isEven = (n) => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(19));

// labelBalance.addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = "purple";
//     if (i % 3 === 0) row.style.backgroundColor = "blue";
//   });
// });

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(64 ** (1 / 3));
// console.log(Math.round(64 ** (1 / 3)));

// console.log(Math.max(5, 18, 23, 11, 2));
// console.log(Math.max(5, 18, "23", 11, 2));
// console.log(Math.max(5, 18, "23rem", 11, 2));

// console.log(Math.min(5, 18, 23, 11, 2));
// console.log(Math.PI);
// console.log(Math.PI * Number.parseFloat("10px") ** 2);

// console.log(Math.trunc(Math.random() * 6 + 1));

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(10, 20));
// console.log(randomInt(-20, -10));

// //Rounding Integers
// console.log(Math.round(23.3));
// console.log(Math.round("23.9"));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil("23.9"));

// console.log(Math.floor(23.3));
// console.log(Math.trunc(23.3));
// console.log(Math.floor("23.9"));

// console.log(Math.floor(-23.3));
// console.log(Math.trunc(-23.9));

// //Rounding
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.345).toFixed(2));
// console.log(+(2.345).toFixed(2));

// //Sorting movements
// let sorted = false;
// btnSort.addEventListener("click", function () {
//   diplayMovements(currentAccount, !sorted);
//   sorted = !sorted;
// });

// //Tutorial and exercise
// console.log(23 === 23.0);
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);

// //Conversion of string to number
// console.log(Number("23"));
// console.log(+"23");

// //Parsing
// console.log(Number.parseInt("30px", 10));
// console.log(Number.parseInt("e23", 10));
// console.log(Number.parseInt(" 2.5rem "));
// console.log(Number.parseFloat(" 2.5rem "));

// //Check if a value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite("20"));
// console.log(Number.isFinite(+"20X"));
// console.log(Number.isFinite(23 / 0));

// //Check if a value is an integer
// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23.02));
// console.log(Number.isInteger(23 / 0));
