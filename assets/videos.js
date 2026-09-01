// ---- Dynamic Project Videos ----
const VIDEOS_API_BASE = "https://turn-india-next.vercel.app"; // <-- your deployed Next.js URL
//const VIDEOS_API_BASE = "http://127.0.0.1:3000"; // <-- your deployed Next.js URL
// Local testing
// const VIDEOS_API_BASE = "http://127.0.0.1:3000";

async function loadProjectVideos(page = 1) {
  const grid = document.getElementById("videoGrid");
  const loading = document.getElementById("videosLoading");
  const empty = document.getElementById("videosEmpty");

//   console.log("=== VIDEO LOAD START ===");
//   console.log("Grid:", grid);

  if (!grid) {
    console.error("videoGrid not found!");
    return;
  }

  if (loading) loading.style.display = "flex";
  if (empty) empty.style.display = "none";

  try {
    const apiUrl =`${VIDEOS_API_BASE}/api/public/videos?page=${page}&limit=12`;
    // console.log("Fetching API:", apiUrl);
    const res = await fetch(apiUrl);
    // console.log("Response status:", res.status);
    // console.log("Response OK:", res.ok);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const result = await res.json();
    // console.log("API RESULT:", result);
    // console.log("VIDEO DATA:", result.data);

    if (loading) loading.style.display = "none";

    if (
      !result.success ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      console.log("No videos found");

      if (empty) {
        empty.style.display = "flex";
      }

      return;
    }

    // console.log(`Rendering ${result.data.length} videos`);

    grid.innerHTML = result.data
      .map((video) => renderVideoCard(video))
      .join("");

    // console.log("Grid HTML injected:", grid.innerHTML);
    attachPlayHandlers(result.data);
  } catch (err) {
    console.error("Failed to load videos:", err);

    if (loading) {
      loading.style.display = "flex";

      const heading = loading.querySelector("h3");
      const paragraph = loading.querySelector("p");

      if (heading) {
        heading.textContent = "Couldn't load videos";
      }

      if (paragraph) {
        paragraph.textContent = err.message;
      }
    }
  }
}


function renderVideoCard(video) {
//   console.log("Rendering video:", video);

  const date = video.createdAt
    ? new Date(video.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return `
    <article class="video">
      
      <div class="thumb">

        <button 
          type="button"
          class="play"
          data-id="${video._id}"
        >
          ▶
        </button>

        <small>${date}</small>

      </div>

      <div class="video-content">

        <em>${escapeHtml(video.category || "Project")}</em>

        <h3>
          ${escapeHtml(video.name || "Untitled Video")}
        </h3>

        <p>
          ${escapeHtml(video.description || "")}
        </p>

        <small>
          By ${escapeHtml(video.author || "TURN India")}
        </small>

      </div>

    </article>
  `;
}


function attachPlayHandlers(videos) {
  const buttons = document.querySelectorAll(".play[data-id]");
//   console.log("Play buttons found:", buttons.length);

  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const videoId = this.dataset.id;
    //   console.log("Clicked video ID:", videoId);
      const video = videos.find(
        (v) => String(v._id) === String(videoId)
      );
    //   console.log("Selected video:", video);

      if (video) {
        openVideoModal(video);
      } else {
        console.error("Video not found!");
      }
    });
  });
}


function openVideoModal(video) {
//   console.log("Opening video modal");
//   console.log("Video URL:", video.url);

  const modal = document.getElementById("videoModal");
  const player = document.getElementById("videoModalPlayer");
  const title = document.getElementById("videoModalTitle");
  const desc = document.getElementById("videoModalDesc");

  if (!modal || !player) {
    console.error("Video modal elements not found!");
    return;
  }

  if (title) {
    title.textContent = video.name || "";
  }

  if (desc) {
    desc.textContent = video.description || "";
  }

  player.pause();
  player.removeAttribute("src");

  // Bind video URL
  player.src = video.url;

  // Important: reload video
  player.load();

  modal.classList.add("open");

//   console.log("Video source bound:", player.src);

  player.play().catch((error) => {
    console.warn("Autoplay prevented or video failed:", error);
  });
}


function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  const player = document.getElementById("videoModalPlayer");

  if (player) {
    player.pause();
    player.removeAttribute("src");
    player.load();
  }

  if (modal) {
    modal.classList.remove("open");
  }
}


function escapeHtml(value) {
  const div = document.createElement("div");

  div.textContent =
    value === null || value === undefined
      ? ""
      : String(value);

  return div.innerHTML;
}


document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  loadProjectVideos();

  const closeButton =
    document.getElementById("videoModalClose");

  const backdrop =
    document.getElementById("videoModalBackdrop");

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      closeVideoModal
    );
  }

  if (backdrop) {
    backdrop.addEventListener(
      "click",
      closeVideoModal
    );
  }
});