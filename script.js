const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const isMobile =
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  window.innerWidth <= 768;

if (isMobile) {
  const volumeControl = $("#volumeControlSection");

  if (volumeControl) {
    volumeControl.remove();
  }

  const volumeWarningIntro = $("#volumeWarningIntro");

  if (volumeWarningIntro) {
    volumeWarningIntro.style.display = "block";
  }
}

const viewCount = $("#viewCount");

fetch("https://countapi.mileshilliard.com/api/v1/hit/risk_unique_site_views")
  .then(res => res.json())
  .then(data => {
    if (viewCount && data.value) {
      viewCount.textContent =
        parseInt(data.value, 10).toLocaleString();
    }
  })
  .catch(() => {
    if (viewCount) {
      viewCount.textContent = "1";
    }
  });

const intro = $("#intro");
const typing = $("#typing");
const typeWrap = $("#typeWrap");
const fadeText1 = $("#fadeText1");
const fadeText2 = $("#fadeText2");
const card = $("#card");
const video = $("#backgroundVideo");
const cursor = $("#cursor");
const cursorGlow = $("#cursorGlow");
const profileName = $("#profileName");
const volumeSlider = $("#volumeSlider");

const text = "click to enter";

let index = 0;
let entered = false;
let canClick = false;

function startIntroSequence() {
  setTimeout(() => {
    fadeText1.classList.add("active");

    setTimeout(() => {
      fadeText1.classList.remove("active");

      setTimeout(() => {
        fadeText2.classList.add("active");

        setTimeout(() => {
          fadeText2.classList.remove("active");

          setTimeout(() => {
            typeWrap.classList.add("visible");
            typeText();
          }, 600);
        }, 1600);
      }, 600);
    }, 1800);
  }, 400);
}

startIntroSequence();

function typeText() {
  if (index >= text.length) {
    canClick = true;
    return;
  }

  typing.textContent =
    text.substring(0, index + 1);

  index++;

  setTimeout(
    typeText,
    65 + Math.random() * 55
  );
}

function typeProfileName(name, done) {
  let i = 0;

  profileName.classList.add(
    "typing-active"
  );

  function step() {
    if (i <= name.length) {
      profileName.textContent =
        name.substring(0, i++);

      setTimeout(
        step,
        110 + Math.random() * 60
      );

      return;
    }

    profileName.classList.remove(
      "typing-active"
    );

    if (done) {
      done();
    }
  }

  step();
}

function revealButtons() {
  const items =
    $$(".links .link, .view-counter, .volume-control");

  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add(
        "item-visible"
      );
    }, i * 110);
  });
}

async function enterSite() {
  if (!canClick || entered) {
    return;
  }

  entered = true;

  try {
    video.muted = false;

    if (volumeSlider) {
      video.volume =
        Number(volumeSlider.value);
    } else {
      video.volume = 1;
    }

    await video.play();
  } catch (_) {}

  intro.classList.add("hidden");

  setTimeout(() => {
    card.classList.add("visible");

    setTimeout(() => {
      typeProfileName(
        "risk",
        revealButtons
      );
    }, 250);
  }, 150);
}

document.addEventListener(
  "click",
  enterSite
);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;

let glowX = window.innerWidth / 2;
let glowY = window.innerHeight / 2;

document.addEventListener(
  "mousemove",
  event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
);

function animateCursor() {
  cursorX +=
    (mouseX - cursorX) * 0.35;

  cursorY +=
    (mouseY - cursorY) * 0.35;

  cursor.style.left =
    cursorX + "px";

  cursor.style.top =
    cursorY + "px";

  glowX +=
    (mouseX - glowX) * 0.12;

  glowY +=
    (mouseY - glowY) * 0.12;

  cursorGlow.style.left =
    glowX + "px";

  cursorGlow.style.top =
    glowY + "px";

  requestAnimationFrame(
    animateCursor
  );
}

animateCursor();

$$(
  ".link, .confirm-actions button, .avatar, " +
  ".redirect-cancel-btn, .dc-modal-close, .dc-add-btn, " +
  ".tg-modal-close, .tg-add-btn, .tg-avatar-wrap, " +
  ".dc-avatar-wrap, .dc-modal-username, .tg-modal-username, " +
  ".rbx-modal-close, .rbx-avatar-wrap, .rbx-add-btn, .ctx-item"
).forEach(el => {
  el.addEventListener(
    "mouseenter",
    () => {
      cursor.style.width = "24px";
      cursor.style.height = "24px";

      cursor.style.filter =
        "drop-shadow(0 0 6px rgba(255,255,255,.25))";
    }
  );

  el.addEventListener(
    "mouseleave",
    () => {
      cursor.style.width = "20px";
      cursor.style.height = "20px";

      cursor.style.filter =
        "drop-shadow(0 0 3px rgba(255,255,255,.15))";
    }
  );
});

if (volumeSlider) {
  volumeSlider.addEventListener(
    "input",
    () => {
      video.volume =
        Number(volumeSlider.value);
    }
  );
}

const confirmOverlay =
  $("#confirmOverlay");

const confirmBox =
  $("#confirmBox");

const redirectWrapper =
  $("#redirectWrapper");

const redirectText =
  $("#redirectText");

const redirectIcon =
  $("#redirectIcon");

const redirectCancelBtn =
  $("#redirectCancelBtn");

const cancelButton =
  $("#cancelButton");

const continueButton =
  $("#continueButton");

let pendingUrl = null;
let pendingName = "";
let pendingIcon = "";

let isRedirecting = false;
let countdownInterval = null;
let currentCountdown = 3;

function getOptimizedUrl(
  url,
  name
) {
  if (!isMobile) {
    return url;
  }

  if (name === "Discord") {
    const match =
      url.match(/\/users\/(\d+)/);

    if (match) {
      return `discord://-/users/${match[1]}`;
    }
  }

  if (name === "Telegram") {
    const match =
      url.match(
        /t\.me\/([a-zA-Z0-9_]+)/
      );

    if (match) {
      return `tg://resolve?domain=${match[1]}`;
    }
  }

  if (name === "Roblox") {
    const match =
      url.match(/\/users\/(\d+)/);

    if (match) {
      return `roblox://navigation/profile?userId=${match[1]}`;
    }
  }

  return url;
}

function triggerRedirectPrompt(
  url,
  name,
  icon
) {
  pendingUrl =
    getOptimizedUrl(
      url,
      name
    );

  pendingName = name;
  pendingIcon = icon || "";

  confirmBox.style.opacity = "1";
  confirmBox.style.pointerEvents = "auto";

  redirectWrapper.classList.remove(
    "visible"
  );

  confirmOverlay.classList.add(
    "visible"
  );
}

$$("a.link").forEach(link => {
  link.addEventListener(
    "click",
    event => {
      if (isRedirecting) {
        return;
      }

      event.preventDefault();

      triggerRedirectPrompt(
        link.href,
        link.getAttribute("data-name"),
        link.getAttribute("data-icon")
      );
    }
  );
});

function resetConfirmationState() {
  isRedirecting = false;
  pendingUrl = null;
  pendingName = "";
  pendingIcon = "";

  clearInterval(
    countdownInterval
  );

  currentCountdown = 3;

  redirectWrapper.classList.remove(
    "visible"
  );

  confirmOverlay.classList.remove(
    "visible"
  );

  if (redirectIcon) {
    redirectIcon.src = "";
  }

  setTimeout(() => {
    confirmBox.style.opacity = "1";
    confirmBox.style.pointerEvents =
      "auto";
  }, 200);
}

cancelButton.addEventListener(
  "click",
  () => {
    if (!isRedirecting) {
      resetConfirmationState();
    }
  }
);

redirectCancelBtn.addEventListener(
  "click",
  resetConfirmationState
);

continueButton.addEventListener(
  "click",
  () => {
    if (
      !pendingUrl ||
      isRedirecting
    ) {
      return;
    }

    isRedirecting = true;

    confirmBox.style.opacity = "0";
    confirmBox.style.pointerEvents =
      "none";

    currentCountdown = 3;

    if (redirectIcon) {
      redirectIcon.src =
        pendingIcon || "";
      redirectIcon.style.display =
        pendingIcon ? "block" : "none";
    }

    redirectText.textContent =
      `Redirecting to ${pendingName} in ${currentCountdown}...`;

    redirectWrapper.classList.add(
      "visible"
    );

    countdownInterval =
      setInterval(() => {
        currentCountdown--;

        if (currentCountdown > 0) {
          redirectText.textContent =
            `Redirecting to ${pendingName} in ${currentCountdown}...`;
        } else {
          clearInterval(
            countdownInterval
          );

          window.location.href =
            pendingUrl;
        }
      }, 1000);
  }
);

confirmOverlay.addEventListener(
  "click",
  event => {
    if (
      event.target === confirmOverlay &&
      !isRedirecting
    ) {
      resetConfirmationState();
    }
  }
);

function copyUsername(
  text,
  toast
) {
  if (!text) {
    return;
  }

  navigator.clipboard.writeText(
    text.replace(/^@/, "")
  ).then(() => {
    toast.classList.add(
      "show"
    );

    setTimeout(() => {
      toast.classList.remove(
        "show"
      );
    }, 1800);
  }).catch(() => {});
}

const DISCORD_ID =
  "1547303503213367297";

const discordLinkBtn =
  $("#discordLinkBtn");

const dcModal =
  $("#dcModal");

const dcModalClose =
  $("#dcModalClose");

const dcAddBtn =
  $("#dcAddBtn");

const dcModalUsername =
  $("#dcModalUsername");

const dcCopyToast =
  $("#dcCopyToast");

discordLinkBtn.addEventListener(
  "click",
  () => {
    fetchDiscordStatus();

    dcModal.classList.add(
      "visible"
    );
  }
);

dcModalClose.addEventListener(
  "click",
  () => {
    dcModal.classList.remove(
      "visible"
    );
  }
);

dcModal.addEventListener(
  "click",
  event => {
    if (
      event.target === dcModal
    ) {
      dcModal.classList.remove(
        "visible"
      );
    }
  }
);

dcAddBtn.addEventListener(
  "click",
  () => {
    dcModal.classList.remove(
      "visible"
    );

    triggerRedirectPrompt(
      discordLinkBtn.getAttribute(
        "data-href"
      ),
      discordLinkBtn.getAttribute(
        "data-name"
      ),
      discordLinkBtn.getAttribute(
        "data-icon"
      )
    );
  }
);

dcModalUsername.addEventListener(
  "click",
  () => {
    copyUsername(
      dcModalUsername.textContent,
      dcCopyToast
    );
  }
);

async function fetchDiscordStatus() {
  try {
    const response =
      await fetch(
        `https://api.lanyard.rest/v1/users/${DISCORD_ID}`
      );

    const result =
      await response.json();

    if (!result.success) {
      return;
    }

    const data =
      result.data;

    const avatar =
      $("#dcModalAvatar");

    const statusDot =
      $("#dcModalStatusDot");

    const statusText =
      $("#dcModalStatusText");

    const actIcon =
      $("#dcModalActIcon");

    const actName =
      $("#dcModalActName");

    const actDesc =
      $("#dcModalActDesc");

    dcModalUsername.textContent =
      `@${data.discord_user.username}`;

    if (
      data.discord_user.avatar
    ) {
      avatar.src =
        `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data.discord_user.avatar}.png?size=128`;
    }

    const status =
      data.discord_status ||
      "offline";

    statusDot.className =
      `dc-status-indicator ${status}`;

    statusText.textContent =
      status === "dnd"
        ? "Do Not Disturb"
        : status;

    if (
      data.listening_to_spotify
    ) {
      actIcon.style.display =
        "block";

      actIcon.src =
        data.spotify.album_art_url;

      actName.textContent =
        data.spotify.song;

      actDesc.style.display =
        "block";

      actDesc.textContent =
        `by ${data.spotify.artist}`;

      return;
    }

    if (
      data.activities &&
      data.activities.length
    ) {
      const act =
        data.activities.find(
          a => a.type !== 4
        ) ||
        data.activities[0];

      if (
        act &&
        act.name
      ) {
        actName.textContent =
          act.name;

        if (
          act.details ||
          act.state
        ) {
          actDesc.style.display =
            "block";

          actDesc.textContent =
            act.details ||
            act.state;
        } else {
          actDesc.style.display =
            "none";
        }

        if (
          act.assets &&
          act.assets.large_image
        ) {
          actIcon.style.display =
            "block";

          if (
            act.assets.large_image.startsWith(
              "spotify:"
            )
          ) {
            actIcon.src =
              `https://i.scdn.co/image/${act.assets.large_image.replace("spotify:", "")}`;
          } else {
            actIcon.src =
              `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.large_image}.png`;
          }
        } else {
          actIcon.style.display =
            "none";
        }

        return;
      }
    }

    actIcon.style.display =
      "none";

    actName.textContent =
      "doing nothing right now...";

    actDesc.style.display =
      "none";
  } catch (_) {}
}

const telegramLinkBtn =
  $("#telegramLinkBtn");

const tgModal =
  $("#tgModal");

const tgModalClose =
  $("#tgModalClose");

const tgAddBtn =
  $("#tgAddBtn");

const tgModalUsername =
  $("#tgModalUsername");

const tgCopyToast =
  $("#tgCopyToast");

telegramLinkBtn.addEventListener(
  "click",
  () => {
    tgModal.classList.add(
      "visible"
    );
  }
);

tgModalClose.addEventListener(
  "click",
  () => {
    tgModal.classList.remove(
      "visible"
    );
  }
);

tgModal.addEventListener(
  "click",
  event => {
    if (
      event.target === tgModal
    ) {
      tgModal.classList.remove(
        "visible"
      );
    }
  }
);

tgAddBtn.addEventListener(
  "click",
  () => {
    tgModal.classList.remove(
      "visible"
    );

    triggerRedirectPrompt(
      telegramLinkBtn.getAttribute(
        "data-href"
      ),
      telegramLinkBtn.getAttribute(
        "data-name"
      ),
      telegramLinkBtn.getAttribute(
        "data-icon"
      )
    );
  }
);

tgModalUsername.addEventListener(
  "click",
  () => {
    copyUsername(
      tgModalUsername.textContent,
      tgCopyToast
    );
  }
);

const ROBLOX_USER_ID =
  "7626940077";

const ROBLOX_PROFILE_URL =
  "https://www.roblox.com/users/7626940077/profile";

const ROBLOX_API =
  "https://robloxapilmao.yukiriskingitfs.workers.dev/roblox/7626940077";

const robloxLinkBtn =
  $("#robloxLinkBtn");

const rbxModal =
  $("#rbxModal");

const rbxModalClose =
  $("#rbxModalClose");

const rbxAddBtn =
  $("#rbxAddBtn");

const rbxAvatar =
  $("#rbxAvatar");

const rbxModalUsername =
  $("#rbxModalUsername");

const rbxModalStatusText =
  $("#rbxModalStatusText");

const rbxFollowersCount =
  $("#rbxFollowerCount") ||
  $("#rbxFollowersCount");

const rbxFriendsCount =
  $("#rbxFriendCount") ||
  $("#rbxFriendsCount");

if (
  isMobile &&
  rbxModalClose
) {
  rbxModalClose.style.top = "10px";
  rbxModalClose.style.right = "10px";
  rbxModalClose.style.zIndex = "20";
}

async function loadRobloxData() {
  if (
    !rbxAvatar ||
    !rbxModalUsername ||
    !rbxModalStatusText ||
    !rbxFollowersCount ||
    !rbxFriendsCount
  ) {
    return;
  }

  rbxFollowersCount.textContent =
    "…";

  rbxFriendsCount.textContent =
    "…";

  try {
    const response =
      await fetch(
        ROBLOX_API,
        {
          cache: "no-store"
        }
      );

    if (!response.ok) {
      throw new Error(
        `Worker HTTP ${response.status}`
      );
    }

    const data =
      await response.json();

    if (data.avatar) {
      rbxAvatar.src =
        data.avatar;
    }

    rbxModalUsername.textContent =
      data.displayName ||
      data.username ||
      "80vcv";

    rbxModalStatusText.textContent =
      data.username
        ? `@${data.username}`
        : "@80vcv";

    rbxFollowersCount.textContent =
      typeof data.followers === "number"
        ? data.followers.toLocaleString()
        : "N/A";

    rbxFriendsCount.textContent =
      typeof data.friends === "number"
        ? data.friends.toLocaleString()
        : "N/A";

  } catch (error) {
    console.error(
      "Roblox Worker error:",
      error
    );

    rbxFollowersCount.textContent =
      "N/A";

    rbxFriendsCount.textContent =
      "N/A";
  }
}

if (
  robloxLinkBtn &&
  rbxModal
) {
  robloxLinkBtn.addEventListener(
    "click",
    () => {
      rbxModal.classList.add(
        "visible"
      );

      loadRobloxData();
    }
  );
}

if (
  rbxModalClose &&
  rbxModal
) {
  rbxModalClose.addEventListener(
    "click",
    () => {
      rbxModal.classList.remove(
        "visible"
      );
    }
  );
}

if (rbxModal) {
  rbxModal.addEventListener(
    "click",
    event => {
      if (
        event.target === rbxModal
      ) {
        rbxModal.classList.remove(
          "visible"
        );
      }
    }
  );
}

if (rbxAddBtn) {
  rbxAddBtn.addEventListener(
    "click",
    () => {
      rbxModal.classList.remove(
        "visible"
      );

      triggerRedirectPrompt(
        ROBLOX_PROFILE_URL,
        "Roblox",
        robloxLinkBtn
          ? robloxLinkBtn.getAttribute(
              "data-icon"
            )
          : ""
      );
    }
  );
}

const customCtxMenu =
  $("#customCtxMenu");

const ctxToggleAudio =
  $("#ctxToggleAudio");

const ctxAudioLabel =
  $("#ctxAudioLabel");

const ctxReloadPage =
  $("#ctxReloadPage");

document.addEventListener(
  "contextmenu",
  event => {
    event.preventDefault();

    const x =
      Math.min(
        event.clientX,
        window.innerWidth - 180
      );

    const y =
      Math.min(
        event.clientY,
        window.innerHeight - 130
      );

    customCtxMenu.style.left =
      `${x}px`;

    customCtxMenu.style.top =
      `${y}px`;

    ctxAudioLabel.textContent =
      video.paused
        ? "Play Audio"
        : "Pause Audio";

    customCtxMenu.classList.add(
      "visible"
    );
  }
);

document.addEventListener(
  "click",
  event => {
    if (
      !customCtxMenu.contains(
        event.target
      )
    ) {
      customCtxMenu.classList.remove(
        "visible"
      );
    }
  }
);

ctxToggleAudio.addEventListener(
  "click",
  () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }

    customCtxMenu.classList.remove(
      "visible"
    );
  }
);

ctxReloadPage.addEventListener(
  "click",
  () => {
    window.location.reload();
  }
);

function setupTilt(
  selector,
  maxTilt,
  scale
) {
  const el =
    $(selector);

  if (!el) {
    return;
  }

  const glare =
    el.querySelector(
      ".card-glare"
    );

  let targetX = 0;
  let targetY = 0;

  let currentX = 0;
  let currentY = 0;

  let hovered = false;

  el.style.transformStyle =
    "preserve-3d";

  window.addEventListener(
    "mousemove",
    event => {
      if (!entered) {
        return;
      }

      const rect =
        el.getBoundingClientRect();

      const centerX =
        rect.left +
        rect.width / 2;

      const centerY =
        rect.top +
        rect.height / 2;

      const x =
        (event.clientX - centerX) /
        (window.innerWidth / 2);

      const y =
        (event.clientY - centerY) /
        (window.innerHeight / 2);

      targetX =
        y * -maxTilt;

      targetY =
        x * maxTilt;

      const insideX =
        (event.clientX - rect.left) /
        rect.width;

      const insideY =
        (event.clientY - rect.top) /
        rect.height;

      if (
        insideX >= 0 &&
        insideX <= 1 &&
        insideY >= 0 &&
        insideY <= 1
      ) {
        hovered = true;

        if (glare) {
          glare.style.opacity =
            "1";

          glare.style.background =
            `radial-gradient(circle at ${insideX * 100}% ${insideY * 100}%, rgba(255, 255, 255, 0.28), transparent 60%)`;
        }
      } else {
        hovered = false;

        if (glare) {
          glare.style.opacity =
            "0";
        }
      }
    }
  );

  document.addEventListener(
    "mouseleave",
    () => {
      targetX = 0;
      targetY = 0;
      hovered = false;

      if (glare) {
        glare.style.opacity =
          "0";
      }
    }
  );

  function update() {
    currentX +=
      (targetX - currentX) *
      0.12;

    currentY +=
      (targetY - currentY) *
      0.12;

    if (entered) {
      const s =
        hovered
          ? scale
          : 1;

      el.style.transform =
        `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) scale3d(${s}, ${s}, 1)`;
    }

    requestAnimationFrame(
      update
    );
  }

  update();
}

setupTilt(
  "#card",
  16,
  1.025
);

setupTilt(
  "#dcCard",
  14,
  1.02
);

setupTilt(
  "#tgCard",
  14,
  1.02
);

setupTilt(
  "#rbxCard",
  14,
  1.02
);

const pfpViewer =
  document.getElementById(
    "pfpViewer"
  );

const pfpViewerImage =
  document.getElementById(
    "pfpViewerImage"
  );

const pfpViewerClose =
  document.getElementById(
    "pfpViewerClose"
  );

function openPfpViewer(img) {
  if (
    !img ||
    !img.src
  ) {
    return;
  }

  pfpViewerImage.src =
    img.src;

  pfpViewerImage.classList.remove(
    "zoomed"
  );

  pfpScale = 1;

  pfpViewerImage.style.transform =
    "scale(1)";

  pfpViewer.classList.add(
    "active"
  );
}

function closePfpViewer() {
  pfpViewer.classList.remove(
    "active"
  );

  pfpViewerImage.src =
    "";
}

[
  "avatarBtn",
  "dcAvatarWrap",
  "tgAvatarBtn",
  "rbxAvatarWrap"
].forEach(id => {
  const el =
    document.getElementById(
      id
    );

  if (el) {
    el.addEventListener(
      "click",
      event => {
        const img =
          el.querySelector(
            "img"
          );

        if (img) {
          event.stopPropagation();

          openPfpViewer(
            img
          );
        }
      }
    );
  }
});

pfpViewerClose.addEventListener(
  "click",
  closePfpViewer
);

pfpViewer.addEventListener(
  "click",
  event => {
    if (
      event.target === pfpViewer
    ) {
      closePfpViewer();
    }
  }
);

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key === "Escape"
    ) {
      closePfpViewer();
    }
  }
);

let pfpScale = 1;
let pfpStartDistance = 0;

pfpViewerImage.addEventListener(
  "dblclick",
  () => {
    pfpViewerImage.classList.toggle(
      "zoomed"
    );

    pfpScale =
      pfpViewerImage.classList.contains(
        "zoomed"
      )
        ? 2
        : 1;

    pfpViewerImage.style.transform =
      `scale(${pfpScale})`;
  }
);

pfpViewerImage.addEventListener(
  "wheel",
  event => {
    event.preventDefault();

    pfpScale =
      Math.min(
        4,
        Math.max(
          1,
          pfpScale +
            (event.deltaY < 0
              ? .2
              : -.2)
        )
      );

    pfpViewerImage.classList.toggle(
      "zoomed",
      pfpScale > 1
    );

    pfpViewerImage.style.transform =
      `scale(${pfpScale})`;
  },
  {
    passive: false
  }
);

pfpViewerImage.addEventListener(
  "touchstart",
  event => {
    if (
      event.touches.length === 2
    ) {
      pfpStartDistance =
        Math.hypot(
          event.touches[0].clientX -
            event.touches[1].clientX,

          event.touches[0].clientY -
            event.touches[1].clientY
        );
    }
  }
);

pfpViewerImage.addEventListener(
  "touchmove",
  event => {
    if (
      event.touches.length !== 2 ||
      !pfpStartDistance
    ) {
      return;
    }

    event.preventDefault();

    const distance =
      Math.hypot(
        event.touches[0].clientX -
          event.touches[1].clientX,

        event.touches[0].clientY -
          event.touches[1].clientY
      );

    pfpScale =
      Math.min(
        4,
        Math.max(
          1,
          pfpScale *
            (distance /
              pfpStartDistance)
        )
      );

    pfpStartDistance =
      distance;

    pfpViewerImage.classList.toggle(
      "zoomed",
      pfpScale > 1
    );

    pfpViewerImage.style.transform =
      `scale(${pfpScale})`;
  },
  {
    passive: false
  }
);

if (isMobile) {
  document
    .querySelectorAll("*")
    .forEach(el => {
      if (
        el.children.length === 0 &&
        /you may need to lower your volume/i.test(
          el.textContent || ""
        )
      ) {
        el.style.display =
          "block";
      }
    });
}
