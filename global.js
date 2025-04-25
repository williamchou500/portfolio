console.log('IT’S ALIVE!');

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

export async function fetchJSON(url) {
    try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
    }
  }

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';

    for (let project of projects) {
        const article = document.createElement('article');

        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src ="${project.image}" alt="${project.title}"></img>
            <p>${project.description}</p>
        `

        containerElement.appendChild(article);
    }
}

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}
  