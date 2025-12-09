// ✅ Your brand color: #3A7CA5
const BRAND_PRIMARY = '#3A7CA5';
const BRAND_PRIMARY_DARK = '#2a5d7a';

// ✅ Use your real API key (safe here — it's already in frontend)
const API_KEY = 'bfcd612ed8e04162af449fc3df8da3b9';

// ✅ Refined health-focused queries (global, clinical, public health)
const HEALTH_GLOBAL = "https://newsapi.org/v2/top-headlines?category=health&language=en&pageSize=20&apiKey=";
const HEALTH_AFRICA = "https://newsapi.org/v2/everything?q=health%20AND%20(Nigeria%20OR%20Africa)&language=en&sortBy=publishedAt&pageSize=20&apiKey=";
const HEALTH_RESEARCH = "https://newsapi.org/v2/everything?q=medical%20research%20OR%20clinical%20trial%20OR%20vaccine%20development&language=en&sortBy=publishedAt&pageSize=20&apiKey=";
const HEALTH_POLICY = "https://newsapi.org/v2/everything?q=healthcare%20policy%20OR%20universal%20health%20coverage&language=en&sortBy=publishedAt&pageSize=20&apiKey=";

// DOM elements
const newsQuery = document.getElementById('newsQuery');
const newsType = document.getElementById('newsType');
const newsdetails = document.getElementById('newsdetails');
let newsDataArr = [];

// Initialize on DOM ready
window.addEventListener("DOMContentLoaded", () => {
    // Validate elements
    if (!newsType || !newsdetails) {
        console.error("Missing DOM elements: #newsType or #newsdetails");
        return;
    }

    // Load global health news on startup
    newsType.innerHTML = "<h4><i class='fas fa-globe-africa me-2'></i> Global Health News</h4>";
    fetchHealthNews(HEALTH_GLOBAL);

    // Add event listeners only if buttons exist
    attachButtonListener("general", "🏥 General Health", HEALTH_GLOBAL);
    attachButtonListener("africa", "🌍 Africa Health", HEALTH_AFRICA);
    attachButtonListener("research", "🔬 Medical Research", HEALTH_RESEARCH);
    attachButtonListener("policy", "⚖️ Health Policy", HEALTH_POLICY);

    // Search button
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", handleSearch);
        if (newsQuery) {
            newsQuery.addEventListener("keypress", (e) => {
                if (e.key === "Enter") handleSearch();
            });
        }
    }
});

function attachButtonListener(id, title, url) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener("click", () => {
            // Update title with icon
            const icons = {
                'general': '🏥',
                'africa': '🌍',
                'research': '🔬',
                'policy': '⚖️'
            };
            const icon = icons[id] || '📰';
            newsType.innerHTML = `<h4>${icon} ${title}</h4>`;
            fetchHealthNews(url);
        });
    }
}

function handleSearch() {
    const query = newsQuery?.value?.trim();
    if (query) {
        newsType.innerHTML = `<h4><i class="fas fa-search me-2"></i> Search: "${query}"</h4>`;
        fetchSearchNews(query);
        if (newsQuery) newsQuery.value = '';
    }
}

// Fetch health news
async function fetchHealthNews(url) {
    // Remove spaces from URL + append key
    const cleanUrl = url.trim() + API_KEY;

    newsdetails.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border" role="status" style="color: ${BRAND_PRIMARY};">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Fetching global health updates…</p>
        </div>`;

    try {
        const response = await fetch(cleanUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.status === 'error') throw new Error(data.message);

        newsDataArr = data.articles || [];
        displayNews();
    } catch (err) {
        console.error("Fetch error:", err);
        newsdetails.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <h5><i class="fas fa-exclamation-triangle me-2"></i> Error Loading News</h5>
                    <p>Please check your internet connection or try again later.</p>
                </div>
            </div>`;
    }
}

// Search news
async function fetchSearchNews(query) {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;
    fetchHealthNews(url); // Reuse same loader & error handling
}

// Display news with YOUR brand color
function displayNews() {
    newsdetails.innerHTML = "";

    if (!newsDataArr || newsDataArr.length === 0) {
        newsdetails.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    <i class="fas fa-info-circle me-2"></i> No health news found. Try a different category.
                </div>
            </div>`;
        return;
    }

    newsDataArr.forEach(article => {
        const title = article.title?.replace(/&#8217;/g, "'") || "Health Update";
        const desc = article.description || article.content || "Read the full story.";
        const img = article.urlToImage || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80";
        const url = article.url;
        const source = article.source?.name || "News Source";
        const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "";

        const col = document.createElement('div');
        col.className = "col-sm-12 col-md-6 col-lg-4 p-2";

        const card = document.createElement('div');
        card.className = "card h-100 shadow-sm border-0";
        card.style.borderRadius = "12px";
        card.style.overflow = "hidden";

        const imgTag = document.createElement('img');
        imgTag.src = img;
        imgTag.className = "card-img-top";
        imgTag.style.height = "200px";
        imgTag.style.objectFit = "cover";
        imgTag.alt = title;
        imgTag.onerror = () => imgTag.src = "https://images.unsplash.com/photo-1581094794329-1de0f42b7e9a?auto=format&fit=crop&w=600&q=80";

        const cardBody = document.createElement('div');
        cardBody.className = "card-body d-flex flex-column";

        const meta = document.createElement('small');
        meta.className = "text-muted";
        meta.innerHTML = `<i class="fas fa-newspaper me-1"></i> ${source} • ${date}`;

        const titleEl = document.createElement('h5');
        titleEl.className = "card-title mt-2 fw-bold";
        titleEl.style.fontSize = "1.1rem";
        titleEl.textContent = title.length > 80 ? title.substring(0, 78) + "…" : title;

        const descEl = document.createElement('p');
        descEl.className = "card-text text-muted flex-grow-1";
        descEl.style.fontSize = "0.95rem";
        descEl.textContent = desc.length > 120 ? desc.substring(0, 118) + "…" : desc;

        const link = document.createElement('a');
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        // ✅ YOUR BRAND BUTTON STYLE
        link.className = "btn mt-auto";
        link.style.backgroundColor = BRAND_PRIMARY;
        link.style.borderColor = BRAND_PRIMARY;
        link.style.color = "white";
        link.style.fontWeight = "500";
        link.innerHTML = "<i class='fas fa-arrow-right me-1'></i> Read Full";

        // Hover effect
        link.onmouseover = () => link.style.backgroundColor = BRAND_PRIMARY_DARK;
        link.onmouseout = () => link.style.backgroundColor = BRAND_PRIMARY;

        cardBody.appendChild(meta);
        cardBody.appendChild(titleEl);
        cardBody.appendChild(descEl);
        cardBody.appendChild(link);

        card.appendChild(imgTag);
        card.appendChild(cardBody);
        col.appendChild(card);
        newsdetails.appendChild(col);
    });
}