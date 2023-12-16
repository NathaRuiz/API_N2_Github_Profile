const APIURL = 'https://api.github.com/users/';

const form = document.getElementById('form');


form.addEventListener("submit", async function(event){
  event.preventDefault();

  const input = document.getElementById("search");
  const userName = input.value;

  if(userName.trim() === ""){
    alert("Ingrese un nombre de usuario para iniciar la busqueda");
    return;
  }

  try {
    const response = await axios.get(APIURL + userName);
    printUserHTML(response.data);
   console.log(response);
   input.value = '';
  } catch (error) {
    alert("Usuario no encontrado");
  }

})


async function printUserHTML(userData) {
  const main = document.getElementById("main");
  main.innerHTML = "";

  const section = document.createElement("section");
  section.classList.add("container");

  const imgDiv = document.createElement("div")
  imgDiv.classList.add("imgContainer");
  const avatar = document.createElement('img');
  avatar.src = userData.avatar_url;
  avatar.alt = 'User Avatar';
  imgDiv.appendChild(avatar);

  const infoDiv = document.createElement("div")
  infoDiv.classList.add("infoContainer");

  const reposContainer = document.createElement("div");
  reposContainer.classList.add("flex_repos");

  try {
    const response = await axios.get(`https://api.github.com/users/${userData.login}/repos`);
    
    for (let i = 0; i < 5; i++) {
      const repo = response.data[i];
      if (repo) {
        const repoSpan = document.createElement("span");
        repoSpan.textContent = repo.name;
        reposContainer.appendChild(repoSpan);
      } else {
        break;
      }
    }

    infoDiv.innerHTML = `<h2>${userData.login}</h2>
            <p>${userData.bio || 'No se encuentra una biografia'}</p>
            <div class="flex"> 
                <span>${userData.followers} Followers</span>
                <span>${userData.following} Following</span>
                <span>${userData.public_repos} Repos</span>
            </div>`;

    infoDiv.appendChild(reposContainer);
    section.appendChild(imgDiv);
    section.appendChild(infoDiv);
    main.appendChild(section);

  } catch (error) {
    console.error("Error al obtener repositorios:", error);
    alert("Repositorios no encontrados");
  }
}

