const root = document.documentElement;
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealNodes = document.querySelectorAll("[data-reveal]");
const currentYear = document.getElementById("current-year");
const themeToggle = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const backToTop = document.querySelector(".back-to-top");
const isHomePage = document.body.dataset.page === "home";
const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeStorageKey = "portfolio-theme";
const portfolioInbox = window.atob("YW1hdHlhMjdAZ21haWwuY29t");
const formSubmitEndpoint = `https://formsubmit.co/${portfolioInbox}`;

const getSystemTheme = () => (themeQuery.matches ? "dark" : "light");

const getStoredTheme = () => {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch (error) {
    return null;
  }
};

const setStoredTheme = (theme) => {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    // Ignore storage errors and keep the in-memory theme.
  }
};

const applyTheme = (theme) => {
  root.dataset.theme = theme;

  if (themeMeta) {
    themeMeta.setAttribute("content", theme === "dark" ? "#081121" : "#f4f7fb");
  }

  if (themeToggle) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.dataset.theme = theme;
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    themeToggle.setAttribute("title", `Switch to ${nextTheme} mode`);
  }
};

applyTheme(getStoredTheme() || getSystemTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setStoredTheme(nextTheme);
    applyTheme(nextTheme);
  });
}

themeQuery.addEventListener("change", () => {
  if (!getStoredTheme()) {
    applyTheme(getSystemTheme());
  }
});

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (backToTop) {
  const syncBackToTop = () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 280);
  };

  window.addEventListener("scroll", syncBackToTop, { passive: true });
  syncBackToTop();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open", !expanded);
    root.classList.toggle("menu-open", !expanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
      root.classList.remove("menu-open");
    });
  });
}

if (revealNodes.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
}

const youtubePlayers = document.querySelectorAll("[data-youtube-player]");

youtubePlayers.forEach((player) => {
  player.addEventListener("click", () => {
    const frame = player.closest(".media-frame");
    const videoId = player.dataset.videoId;
    const videoTitle = player.dataset.videoTitle || "YouTube video player";

    if (!frame || !videoId) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.width = "560";
    iframe.height = "315";
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.title = videoTitle;
    iframe.loading = "eager";
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    );
    iframe.setAttribute("allowfullscreen", "");

    frame.replaceChildren(iframe);
    iframe.focus();
  });
});

const formSubmitForms = document.querySelectorAll("[data-formsubmit]");

formSubmitForms.forEach((form) => {
  form.setAttribute("action", formSubmitEndpoint);

  const nextInput = form.querySelector('input[name="_next"]');
  const nextPath = form.dataset.nextPath;

  if (nextInput && nextPath) {
    nextInput.value = new URL(nextPath, window.location.origin + "/").toString();
  }
});

const slideshowControllers = new WeakMap();
const lightboxImages = document.querySelectorAll(
  ".slideshow-slide img, .compact-card > img, .media-card > img, .spotlight-card > img, .project-image"
);

let lightbox = null;
let lightboxImage = null;
let lightboxClose = null;
let lightboxPrev = null;
let lightboxNext = null;
let lightboxCaption = null;
let lightboxCounter = null;
let lightboxMeta = null;
let lastFocusedElement = null;
let lightboxItems = [];
let lightboxCurrentIndex = 0;
let lightboxController = null;

if (lightboxImages.length) {
  lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-hidden", "true");

  const dialog = document.createElement("div");
  dialog.className = "image-lightbox-dialog";

  lightboxClose = document.createElement("button");
  lightboxClose.type = "button";
  lightboxClose.className = "image-lightbox-close";
  lightboxClose.setAttribute("aria-label", "Close image viewer");
  lightboxClose.textContent = "×";

  lightboxImage = document.createElement("img");
  lightboxImage.className = "image-lightbox-img";
  lightboxImage.alt = "";

  lightboxMeta = document.createElement("div");
  lightboxMeta.className = "image-lightbox-meta";
  lightboxMeta.hidden = true;

  lightboxCaption = document.createElement("p");
  lightboxCaption.className = "image-lightbox-caption";

  const lightboxControls = document.createElement("div");
  lightboxControls.className = "image-lightbox-controls";

  lightboxPrev = document.createElement("button");
  lightboxPrev.type = "button";
  lightboxPrev.className = "image-lightbox-nav";
  lightboxPrev.setAttribute("aria-label", "Previous slideshow photo");
  lightboxPrev.textContent = "‹";

  lightboxCounter = document.createElement("p");
  lightboxCounter.className = "image-lightbox-count";

  lightboxNext = document.createElement("button");
  lightboxNext.type = "button";
  lightboxNext.className = "image-lightbox-nav";
  lightboxNext.setAttribute("aria-label", "Next slideshow photo");
  lightboxNext.textContent = "›";

  lightboxControls.append(lightboxPrev, lightboxCounter, lightboxNext);
  lightboxMeta.append(lightboxCaption, lightboxControls);
  dialog.append(lightboxClose, lightboxImage, lightboxMeta);
  lightbox.append(dialog);
  document.body.append(lightbox);

  const renderLightbox = () => {
    if (!lightboxImage || !lightboxItems.length) {
      return;
    }

    const item = lightboxItems[lightboxCurrentIndex];
    const showGalleryControls = lightboxItems.length > 1;

    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt || "Expanded portfolio image";

    if (lightboxMeta && lightboxCaption && lightboxCounter && lightboxPrev && lightboxNext) {
      lightboxMeta.hidden = !showGalleryControls;
      lightboxCaption.textContent = item.caption || item.alt || "";
      lightboxCounter.textContent = showGalleryControls
        ? `${lightboxCurrentIndex + 1} / ${lightboxItems.length}`
        : "";
      lightboxPrev.hidden = !showGalleryControls;
      lightboxNext.hidden = !showGalleryControls;
    }
  };

  const syncSlideshowFromLightbox = () => {
    lightboxController?.goTo(lightboxCurrentIndex, { restart: false });
  };

  const stepLightbox = (direction) => {
    if (lightboxItems.length < 2) {
      return;
    }

    lightboxCurrentIndex =
      (lightboxCurrentIndex + direction + lightboxItems.length) % lightboxItems.length;
    syncSlideshowFromLightbox();
    renderLightbox();
  };

  const closeLightbox = () => {
    if (!lightbox) {
      return;
    }

    lightboxController?.setLightboxOpen(false);
    lightboxController = null;
    lightboxItems = [];
    lightboxCurrentIndex = 0;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const openLightbox = (image) => {
    if (!lightbox || !lightboxImage) {
      return;
    }

    lastFocusedElement = document.activeElement;
    lightboxController?.setLightboxOpen(false);
    lightboxController = null;
    lightboxItems = [];
    lightboxCurrentIndex = 0;

    const slideshow = image.closest("[data-slideshow]");

    if (slideshow) {
      const controller = slideshowControllers.get(slideshow);

      if (controller) {
        lightboxController = controller;
        lightboxItems = controller.getSlides().map((slide) => {
          const slideImage = slide.querySelector("img");
          return {
            src: slideImage?.currentSrc || slideImage?.src || "",
            alt: slideImage?.alt || "Expanded slideshow photo",
            caption: slide.dataset.caption || slideImage?.alt || "",
          };
        });
        lightboxCurrentIndex = controller.getCurrentIndex();
        controller.setLightboxOpen(true);
      }
    }

    if (!lightboxItems.length) {
      lightboxItems = [
        {
          src: image.currentSrc || image.src,
          alt: image.alt || "Expanded portfolio image",
          caption: image.alt || "",
        },
      ];
      lightboxCurrentIndex = 0;
    }

    renderLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxClose?.focus();
  };

  lightboxImages.forEach((image) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-haspopup", "dialog");
    image.setAttribute("aria-label", `${image.alt || "Portfolio image"}. Open larger view.`);

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => stepLightbox(-1));
  lightboxNext?.addEventListener("click", () => stepLightbox(1));

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepLightbox(-1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepLightbox(1);
    }
  });
}

const slideshows = document.querySelectorAll("[data-slideshow]");

slideshows.forEach((slideshow) => {
  const slides = Array.from(slideshow.querySelectorAll(".slideshow-slide"));
  const caption = slideshow.querySelector(".slideshow-caption");
  const dots = slideshow.querySelector(".slideshow-dots");
  const indexLabel = slideshow.querySelector(".slideshow-index");
  const prevButton = slideshow.querySelector('[data-slide-action="prev"]');
  const nextButton = slideshow.querySelector('[data-slide-action="next"]');
  const pauseButton = slideshow.querySelector('[data-slide-action="pause"]');
  const interval = Number(slideshow.dataset.interval || 4200);

  if (slides.length < 2 || !caption || !dots || !indexLabel) {
    return;
  }

  let currentIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let timerId = null;
  let isPaused = false;
  let isLightboxOpen = false;

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  const dotButtons = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slideshow-dot";
    dot.setAttribute("aria-label", `View training photo ${index + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = index;
      render();
      restart();
    });
    dots.appendChild(dot);
    return dot;
  });

  const stop = () => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  const start = () => {
    if (isPaused || isLightboxOpen) {
      return;
    }

    stop();
    timerId = window.setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      render();
    }, interval);
  };

  const restart = () => {
    stop();
    start();
  };

  const render = () => {
    slides.forEach((slide, index) => {
      const isActive = index === currentIndex;
      const slideImage = slide.querySelector("img");
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      dotButtons[index].classList.toggle("is-active", isActive);
      dotButtons[index].setAttribute("aria-current", isActive ? "true" : "false");

      if (slideImage) {
        slideImage.tabIndex = isActive ? 0 : -1;
      }
    });

    caption.textContent = slides[currentIndex].dataset.caption || `Training photo ${currentIndex + 1}`;
    indexLabel.textContent = `${currentIndex + 1} / ${slides.length}`;

    if (pauseButton) {
      pauseButton.textContent = isPaused ? "Play" : "Pause";
      pauseButton.setAttribute("aria-label", isPaused ? "Play slideshow" : "Pause slideshow");
    }
  };

  prevButton?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    render();
    restart();
  });

  nextButton?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    render();
    restart();
  });

  pauseButton?.addEventListener("click", () => {
    isPaused = !isPaused;
    render();
    restart();
  });

  slideshowControllers.set(slideshow, {
    getSlides: () => slides,
    getCurrentIndex: () => currentIndex,
    goTo: (index, { restart = true } = {}) => {
      currentIndex = (index + slides.length) % slides.length;
      render();
      if (restart) {
        restart();
      }
    },
    setLightboxOpen: (value) => {
      isLightboxOpen = value;
      if (value) {
        stop();
        return;
      }
      start();
    },
  });

  slideshow.addEventListener("mouseenter", stop);
  slideshow.addEventListener("mouseleave", start);
  slideshow.addEventListener("focusin", stop);
  slideshow.addEventListener("focusout", (event) => {
    if (slideshow.contains(event.relatedTarget)) {
      return;
    }
    start();
  });

  render();
  start();
});

if (isHomePage) {
  const sections = document.querySelectorAll("main section[id]");
  const sectionMap = new Map();

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) {
      return;
    }
    sectionMap.set(href.slice(1), link);
  });

  if (sections.length && sectionMap.size) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = sectionMap.get(entry.target.id);
          if (!link) {
            return;
          }
          if (entry.isIntersecting) {
            navLinks.forEach((item) => item.removeAttribute("aria-current"));
            link.setAttribute("aria-current", "page");
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    sections.forEach((section) => activeObserver.observe(section));
  }
}
