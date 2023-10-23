const form = document.querySelector(".search_form") as HTMLFormElement;
const input = document.querySelector(".search__input") as HTMLInputElement;
const button = document.querySelector(".search_button") as HTMLButtonElement;
const cardContainer = document.querySelector(".cardContainer") as HTMLElement;

interface UserData {
  id: number;
  login: string;
  avatar_url: string;
  location: string;
  html_url: string;
  url: string;
  type: string;
}

async function myCustomFetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Network was not ok - status &{response.status}`);
  }
  const data = await response.json();

  return data;
}

const showResultUi = (user: UserData) => {
  const { url, type, html_url, login, location, avatar_url } = user;
  cardContainer.insertAdjacentHTML(
    "beforeend",
    `
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
   `
  );
};

function fetchUserData(url: string) {
  myCustomFetcher<UserData[]>(url, {}).then((userInfo) => {
    for (let user of userInfo) {
      showResultUi(user);
    }
  });
}

fetchUserData("https://api.github.com/users");

// Search controller functionality add
form.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();

  const value: string = input.value.toLowerCase();

  try {
    const url = "https://api.github.com/users";
    const allUsersData = await myCustomFetcher<UserData[]>(url, {});
    const matchingUser = allUsersData.filter((user) => {
      return user.login.toLowerCase().includes(value);
    });
    cardContainer.innerHTML = "";
    if (matchingUser.length === 0) {
      cardContainer?.insertAdjacentHTML(
        "beforeend",
        `
     <h2>No Data available!</h2>
     `
      );
    } else {
      for (let singleUser of matchingUser) {
        showResultUi(singleUser);
      }
    }
  } catch (error) {
    alert("Something want wrong!! " + error);
  }
});

// https://api.github.com/users
