"use strict";
const form = document.querySelector(".search_form");
const input = document.querySelector(".search__input");
const button = document.querySelector(".search_button");
const cardContainer = document.querySelector(".cardContainer");
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network was not ok - status &{response.status}`);
    }
    const data = await response.json();
    return data;
}
const showResultUi = (user) => {
    const { url, type, html_url, login, location, avatar_url } = user;
    cardContainer.insertAdjacentHTML("beforeend", `
   <div class="card">
        <div class="card__image">
         <img src=${avatar_url} alt=${login}>
        </div>
        <div class="card__body">
        <h3>${login}</h3>
        <a href=${url} target="_blank">${type}</a>
        </div>
        <div class="card__footer">
        <img src=${avatar_url} alt=${login}>
         <a href=${html_url} target="_blank">GitHub</a>
        </div>
       </div>
   `);
};
function fetchUserData(url) {
    myCustomFetcher(url, {}).then((userInfo) => {
        for (let user of userInfo) {
            showResultUi(user);
        }
    });
}
fetchUserData("https://api.github.com/users");
// Search controller functionality add
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const value = input.value.toLowerCase();
    try {
        const url = "https://api.github.com/users";
        const allUsersData = await myCustomFetcher(url, {});
        const matchingUser = allUsersData.filter((user) => {
            return user.login.toLowerCase().includes(value);
        });
        cardContainer.innerHTML = "";
        if (matchingUser.length === 0) {
            cardContainer?.insertAdjacentHTML("beforeend", `
     <h2>No Data available!</h2>
     `);
        }
        else {
            for (let singleUser of matchingUser) {
                showResultUi(singleUser);
            }
        }
    }
    catch (error) {
        alert("Something want wrong!! " + error);
    }
});
// https://api.github.com/users
