const APIURL = "https://api.github.com/users/";

const form = document.getElementById("form");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const input = document.getElementById("search");
  const userName = input.value;

  if (userName.trim() === "") {
    alert("Ingrese un nombre de usuario para iniciar la busqueda");
    return;
  }

  try {
    const response = await axios.get(APIURL + userName);
    printUserHTML(response.data);
    console.log(response);
    input.value = "";
  } catch (error) {
    alert("Usuario no encontrado");
  }
});

async function printUserHTML(userData) {
  const main = document.getElementById("main");
  main.innerHTML = "";

  const section = document.createElement("section");
  section.classList.add("card");

  const imgDiv = document.createElement("div");
  imgDiv.classList.add("imgContainer");
  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = userData.avatar_url;
  avatar.alt = "User Avatar";
  imgDiv.appendChild(avatar);

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("user-info");

  const reposContainer = document.createElement("div");
  reposContainer.classList.add("flex_repos");

  try {
    const response = await axios.get(`https://api.github.com/users/${userData.login}/repos`
    );

    for (let i = 0; i < 5; i++) {
      const repo = response.data[i];
      if (repo) {
        const repoSpan = document.createElement("span");
        repoSpan.classList.add("repo");
        repoSpan.textContent = repo.name;
        reposContainer.appendChild(repoSpan);
      } else {
        break;
      }
    }

    infoDiv.innerHTML = `<h2>${userData.login}</h2>
            <p>${userData.bio || "No se encuentra una biografia"}</p>
            <ul> 
                <li>${userData.followers} Followers</li>
                <li>${userData.following} Following</li>
                <li>${userData.public_repos} Repos</li>
            </ul>`;

    infoDiv.appendChild(reposContainer);
    section.appendChild(imgDiv);
    section.appendChild(infoDiv);
    main.appendChild(section);
  } catch (error) {
    console.error("Error al obtener repositorios:", error);
    alert("Repositorios no encontrados");
  }
}
