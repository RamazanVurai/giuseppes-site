(() => {
  const content = window.siteContent || {};
  const root = document.documentElement;
  if (content.fontHeading) root.style.setProperty("--font-heading", content.fontHeading);
  if (content.fontBody) root.style.setProperty("--font-body", content.fontBody);
  if (content.images?.heroImage) {
    const hero = document.querySelector(".hero");
    if (hero) hero.style.backgroundImage = `linear-gradient(90deg,#17151588,#17151544),url("${content.images.heroImage}")`;
  }
  document.querySelectorAll("[data-image]").forEach((element) => {
    const imageUrl = content.images?.[element.dataset.image];
    if (imageUrl) {
      if (element.tagName === "IMG") element.src = imageUrl;
      else element.style.backgroundImage = `url("${imageUrl}")`;
      if (element.dataset.image === "heroImage" && element.closest(".hero-visual")) {
        element.closest(".hero-visual").style.backgroundImage = `linear-gradient(#17151588,#17151588),url("${imageUrl}")`;
      }
    }
  });
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    if (content.whatsappNumber && !content.whatsappNumber.includes("999999")) {
      link.href = "https://api.whatsapp.com/send/?phone=5521964941833&text=Ol%C3%A1%21+Gostaria+de+agendar+um+hor%C3%A1rio+no+Giuseppes+Hair+Studio.&type=phone_number&app_absent=0";
      link.target = "_self";
      link.removeAttribute("rel");
    }
  });
  document.querySelectorAll(".whatsapp-chat-open[data-whatsapp]").forEach((link) => {
    link.addEventListener("click", () => {
      const widget = link.closest(".whatsapp-widget");
      if (!widget) return;
      widget.removeAttribute("open");
      widget.classList.remove("is-open");
      const panel = widget.querySelector(".whatsapp-chat");
      if (panel) panel.hidden = true;
      widget.querySelector(".whatsapp-float")?.setAttribute("aria-expanded", "false");
    });
  });
  const contactWhatsappWidget = document.querySelector(".contact-screen .whatsapp-widget");
  const contactWhatsappToggle = contactWhatsappWidget?.querySelector(".whatsapp-float");
  const contactWhatsappPanel = contactWhatsappWidget?.querySelector(".whatsapp-chat");
  const setContactWhatsappOpen = (open) => {
    if (!contactWhatsappWidget || !contactWhatsappToggle || !contactWhatsappPanel) return;
    contactWhatsappWidget.classList.toggle("is-open", open);
    contactWhatsappToggle.setAttribute("aria-expanded", String(open));
    contactWhatsappPanel.hidden = !open;
  };
  contactWhatsappToggle?.addEventListener("click", () => {
    setContactWhatsappOpen(contactWhatsappToggle.getAttribute("aria-expanded") !== "true");
  });
  contactWhatsappWidget?.querySelector(".whatsapp-chat-close")?.addEventListener("click", () => {
    setContactWhatsappOpen(false);
    contactWhatsappToggle?.focus();
  });

  const whatsappClose = document.querySelector(".about-screen .whatsapp-widget .whatsapp-chat-close");
  whatsappClose?.addEventListener("click", () => {
    const widget = whatsappClose.closest(".whatsapp-widget");
    widget?.removeAttribute("open");
    widget?.querySelector(".whatsapp-float")?.focus();
  });

  const portfolioWhatsappWidget = document.querySelector(".portfolio-screen .portfolio-whatsapp-widget");
  const portfolioWhatsappToggle = portfolioWhatsappWidget?.querySelector(".portfolio-whatsapp-float");
  portfolioWhatsappWidget?.querySelector(".whatsapp-chat-close")?.addEventListener("click", () => {
    portfolioWhatsappWidget.removeAttribute("open");
    portfolioWhatsappToggle?.focus();
  });

  const servicesWhatsappWidget = document.querySelector(".services-page .portfolio-whatsapp-widget");
  const servicesWhatsappToggle = servicesWhatsappWidget?.querySelector(".portfolio-whatsapp-float");
  servicesWhatsappWidget?.querySelector(".whatsapp-chat-close")?.addEventListener("click", () => {
    servicesWhatsappWidget.removeAttribute("open");
    servicesWhatsappToggle?.focus();
  });

  const homeWhatsappWidget = document.querySelector(".home-screen .portfolio-whatsapp-widget");
  const homeWhatsappToggle = homeWhatsappWidget?.querySelector(".portfolio-whatsapp-float");
  homeWhatsappWidget?.querySelector(".whatsapp-chat-close")?.addEventListener("click", () => {
    homeWhatsappWidget.removeAttribute("open");
    homeWhatsappToggle?.focus();
  });
  homeWhatsappWidget?.querySelector(".whatsapp-chat-open")?.addEventListener("click", () => {
    homeWhatsappWidget.removeAttribute("open");
  });

  document.querySelectorAll("[data-instagram]").forEach((link) => link.href = content.instagramUrl || "#contato");
  document.querySelectorAll("[data-google-review]").forEach((link) => link.href = content.reviewUrl || "#contato");
  const homeServiceGrid = document.querySelector("body.home-screen #servicos .service-grid");
  if (homeServiceGrid) {
    if ("IntersectionObserver" in window) {
      const serviceGridObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          homeServiceGrid.classList.add("is-visible");
          serviceGridObserver.disconnect();
        }
      }, { threshold: 0.2 });
      serviceGridObserver.observe(homeServiceGrid);
    } else {
      homeServiceGrid.classList.add("is-visible");
    }
  }
  const reviewCards = document.querySelector(".reviews-cards");
  if (reviewCards) {
    const carousel = reviewCards.closest(".reviews-carousel");
    const emptyMessage = carousel.querySelector(".reviews-empty");
    const previousButton = carousel.querySelector(".reviews-prev");
    const nextButton = carousel.querySelector(".reviews-next");
    const reviewProgress = carousel.querySelector(".reviews-progress span");
    previousButton.classList.add("is-hidden-at-start");
    previousButton.setAttribute("aria-hidden", "true");
    const pageSize = window.matchMedia("(max-width: 640px)").matches ? 1 : 3;
    const autoAdvanceDelay = 5200;
    let positiveReviews = [];
    let currentIndex = 0;
    let autoDirection = 1;
    let autoAdvanceTimer;
    let transitionTimer;
    let isSliding = false;
    const syncControls = () => {
      const maxStart = Math.max(0, positiveReviews.length - pageSize);
      previousButton.disabled = currentIndex <= 0;
      nextButton.disabled = currentIndex >= maxStart;
      previousButton.classList.toggle("is-hidden-at-start", currentIndex <= 0);
      previousButton.setAttribute("aria-hidden", currentIndex <= 0 ? "true" : "false");
      nextButton.classList.toggle("is-hidden-at-end", currentIndex >= maxStart);
      nextButton.setAttribute("aria-hidden", currentIndex >= maxStart ? "true" : "false");
      if (reviewProgress) {
        const progressRange = Math.max(0, positiveReviews.length - pageSize);
        reviewProgress.style.left = `${progressRange ? (currentIndex / progressRange) * 84 : 0}%`;
        reviewProgress.parentElement.style.opacity = progressRange ? "1" : ".45";
      }
    };
    const renderReviews = () => {
      reviewCards.replaceChildren(...positiveReviews.map((review) => {
        const card = document.createElement("article");
        card.className = "google-review-card";
        const header = document.createElement("div");
        header.className = "google-review-card-header";
        const person = document.createElement("div");
        person.className = "google-review-person";
        const avatar = document.createElement("span");
        avatar.className = "google-review-avatar";
        avatar.textContent = review.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
        if (review.name === "Nina Andrade") {
          const profilePhoto = document.createElement("img");
          profilePhoto.src = "assets/reviewers/nina-andrade.png?v=20261025z";
          profilePhoto.alt = `Foto do perfil de ${review.name}`;
          avatar.classList.add("has-photo");
          avatar.replaceChildren(profilePhoto);
        }
        if (review.name === "Bea Mendes") {
          const profilePhoto = document.createElement("img");
          profilePhoto.src = "assets/reviewers/bea-mendes.png?v=20261025a";
          profilePhoto.alt = `Foto do perfil de ${review.name}`;
          avatar.classList.add("has-photo");
          avatar.replaceChildren(profilePhoto);
        }
        if (review.name === "Cris Barban") {
          const profilePhoto = document.createElement("img");
          profilePhoto.src = "assets/reviewers/cris-barban.png?v=20261025a";
          profilePhoto.alt = `Foto do perfil de ${review.name}`;
          avatar.classList.add("has-photo");
          avatar.replaceChildren(profilePhoto);
        }
        if (review.name === "Fernanda Castro Oliveira") {
          const profilePhoto = document.createElement("img");
          profilePhoto.src = "assets/reviewers/fernanda-castro.png?v=20261025a";
          profilePhoto.alt = `Foto do perfil de ${review.name}`;
          avatar.classList.add("has-photo");
          avatar.replaceChildren(profilePhoto);
        }
        const identity = document.createElement("span");
        identity.className = "google-review-identity";
        const name = document.createElement("b");
        name.textContent = review.name;
        const date = document.createElement("small");
        date.textContent = new Intl.DateTimeFormat("pt-BR").format(new Date(`${review.date}T12:00:00`));
        identity.append(name, date);
        person.append(avatar, identity);
        const source = document.createElement("span");
        source.className = "google-review-source";
        source.textContent = "G";
        source.setAttribute("aria-label", "Google");
        header.append(person, source);
        const stars = document.createElement("div");
        stars.className = "google-review-stars";
        stars.textContent = "★".repeat(review.rating);
        stars.setAttribute("aria-label", `${review.rating} de 5 estrelas`);
        const verified = document.createElement("span");
        verified.className = "google-review-verified";
        verified.textContent = "✓";
        verified.setAttribute("aria-label", "Avaliação verificada");
        stars.append(verified);
        const text = document.createElement("p");
        text.className = "google-review-text";
        text.textContent = review.text;
        const readMore = document.createElement("button");
        readMore.className = "google-review-more";
        readMore.type = "button";
        readMore.textContent = "Leia mais";
        readMore.hidden = review.text.length <= 150;
        readMore.addEventListener("click", () => {
          const expanded = text.classList.toggle("is-expanded");
          readMore.textContent = expanded ? "Mostrar menos" : "Leia mais";
        });
        card.append(header, stars, text, readMore);
        return card;
      }));
      syncControls();
      emptyMessage.hidden = positiveReviews.length > 0;
    };
    const stopAutoAdvance = () => window.clearTimeout(autoAdvanceTimer);
    const scheduleAutoAdvance = () => {
      stopAutoAdvance();
      if (positiveReviews.length <= pageSize) return;
      autoAdvanceTimer = window.setTimeout(() => {
        const maxStart = positiveReviews.length - pageSize;
        if (currentIndex >= maxStart) autoDirection = -1;
        else if (currentIndex <= 0) autoDirection = 1;
        advanceReviews(autoDirection);
      }, autoAdvanceDelay);
    };
    const advanceReviews = (direction) => {
      const maxStart = Math.max(0, positiveReviews.length - pageSize);
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex > maxStart || isSliding) return;
      stopAutoAdvance();
      autoDirection = direction;
      isSliding = true;
      currentIndex = nextIndex;
      syncControls();
      const card = reviewCards.firstElementChild;
      const gap = Number.parseFloat(getComputedStyle(reviewCards).columnGap) || 0;
      const step = card.getBoundingClientRect().width + gap;
      reviewCards.style.transform = `translateX(-${step * currentIndex}px)`;
      transitionTimer = window.setTimeout(() => {
        isSliding = false;
        syncControls();
        scheduleAutoAdvance();
      }, 850);
    };
    previousButton.addEventListener("click", () => advanceReviews(-1));
    nextButton.addEventListener("click", () => advanceReviews(1));
    fetch("reviews.json", { cache: "no-cache" }).then((response) => {
      if (!response.ok) throw new Error("Reviews file unavailable");
      return response.json();
    }).then((reviews) => {
      positiveReviews = reviews.filter((review) => Number.isInteger(review.rating) && review.rating >= 4 && review.rating <= 5 && review.name && review.date && review.text)
        .sort((a, b) => b.rating - a.rating || new Date(b.date) - new Date(a.date));
      renderReviews();
      scheduleAutoAdvance();
    }).catch(() => {
      emptyMessage.hidden = false;
      emptyMessage.textContent = "Avaliações temporariamente indisponíveis.";
      previousButton.disabled = true;
      nextButton.disabled = true;
    });
  }
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const images = content.galleryImages || [];
    const selectedImages = gallery.dataset.gallery === "preview" ? images.slice(0, 4) : images;
    const isPortfolioGallery = document.body.classList.contains("portfolio-screen") && gallery.dataset.gallery === "full";
    gallery.innerHTML = selectedImages.map((imageUrl, index) => `<a class="gallery-image" href="${imageUrl}"${isPortfolioGallery ? "" : ' target="_blank" rel="noreferrer"'} aria-label="Abrir trabalho ${index + 1}" style="background-image:url('${imageUrl}')"></a>`).join("");

    if (!isPortfolioGallery) return;

    let currentIndex = 0;
    let pageScrollY = 0;
    let fullscreenExitRequested = false;
    const lightbox = document.createElement("div");
    lightbox.className = "portfolio-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Galeria de fotos");
    lightbox.hidden = true;
    lightbox.innerHTML = `<div class="portfolio-lightbox-bar"><span class="portfolio-lightbox-count" aria-live="polite"></span><div class="portfolio-lightbox-tools"><button type="button" class="portfolio-lightbox-fullscreen" aria-label="Abrir em tela cheia" title="Tela cheia"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M3 16v5h5m13-5v5h-5"/></svg></button><button type="button" class="portfolio-lightbox-zoom" aria-label="Ampliar foto" title="Ampliar"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.5 4.5M10.8 7.5v6.6m-3.3-3.3h6.6"/></svg></button><button type="button" class="portfolio-lightbox-share" aria-label="Compartilhar foto" title="Compartilhar" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5 20 10l-6 5v-3c-5 0-8 2-10 6 0-6 3-10 10-10V5Z"/></svg></button><div class="portfolio-share-menu" role="menu" hidden><a role="menuitem" class="portfolio-share-facebook" target="_blank" rel="noopener noreferrer"><span class="share-brand share-facebook" aria-hidden="true">f</span>Compartilhar no Facebook</a><a role="menuitem" class="portfolio-share-x" target="_blank" rel="noopener noreferrer"><span class="share-brand share-x" aria-hidden="true">𝕏</span>Compartilhar no X</a><a role="menuitem" class="portfolio-share-pinterest" target="_blank" rel="noopener noreferrer"><span class="share-brand share-pinterest" aria-hidden="true">p</span>Fixar no Pinterest</a><button type="button" role="menuitem" class="portfolio-share-download"><span class="share-brand share-download" aria-hidden="true">↓</span>Baixar imagem</button></div><button type="button" class="portfolio-lightbox-close" aria-label="Fechar galeria" title="Fechar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div></div><button type="button" class="portfolio-lightbox-hit portfolio-lightbox-hit-prev" aria-label="Foto anterior"></button><button type="button" class="portfolio-lightbox-prev" aria-label="Foto anterior">‹</button><img class="portfolio-lightbox-image" alt="Foto do portfólio"><button type="button" class="portfolio-lightbox-next" aria-label="Próxima foto">›</button><button type="button" class="portfolio-lightbox-hit portfolio-lightbox-hit-next" aria-label="Próxima foto"></button>`;
    document.body.append(lightbox);

    const lightboxImage = lightbox.querySelector(".portfolio-lightbox-image");
    const counter = lightbox.querySelector(".portfolio-lightbox-count");
    const closeButton = lightbox.querySelector(".portfolio-lightbox-close");
    const previousHitArea = lightbox.querySelector(".portfolio-lightbox-hit-prev");
    const nextHitArea = lightbox.querySelector(".portfolio-lightbox-hit-next");
    const shareButton = lightbox.querySelector(".portfolio-lightbox-share");
    const shareMenu = lightbox.querySelector(".portfolio-share-menu");
    const zoomButton = lightbox.querySelector(".portfolio-lightbox-zoom");
    let imageChangeTimer;
    const resetZoom = () => {
      lightboxImage.classList.remove("is-zoomed");
      zoomButton.setAttribute("aria-label", "Ampliar foto");
      zoomButton.title = "Ampliar";
      zoomButton.querySelector("path:last-child")?.setAttribute("d", "m16 16 4.5 4.5M10.8 7.5v6.6m-3.3-3.3h6.6");
    };
    const toggleZoom = () => {
      const zoomed = lightboxImage.classList.toggle("is-zoomed");
      zoomButton.setAttribute("aria-label", zoomed ? "Reduzir foto" : "Ampliar foto");
      zoomButton.title = zoomed ? "Reduzir" : "Ampliar";
      zoomButton.querySelector("path:last-child")?.setAttribute("d", zoomed ? "m16 16 4.5 4.5M7.5 10.8h6.6" : "m16 16 4.5 4.5M10.8 7.5v6.6m-3.3-3.3h6.6");
      requestAnimationFrame(updateHitAreas);
    };
    const setShareMenuOpen = (open) => {
      shareMenu.hidden = !open;
      shareButton.setAttribute("aria-expanded", String(open));
    };
    const updateHitAreas = () => {
      const bounds = lightboxImage.getBoundingClientRect();
      const edgeNavigationWidth = Math.min(280, window.innerWidth * 0.2);
      previousHitArea.style.width = `${Math.min(Math.max(0, bounds.left), edgeNavigationWidth)}px`;
      previousHitArea.style.top = `${Math.max(0, bounds.top)}px`;
      previousHitArea.style.bottom = `${Math.max(0, window.innerHeight - bounds.bottom)}px`;
      nextHitArea.style.left = `${Math.max(0, window.innerWidth - edgeNavigationWidth)}px`;
      nextHitArea.style.width = `${Math.min(Math.max(0, window.innerWidth - bounds.right), edgeNavigationWidth)}px`;
      nextHitArea.style.top = `${Math.max(0, bounds.top)}px`;
      nextHitArea.style.bottom = `${Math.max(0, window.innerHeight - bounds.bottom)}px`;
    };
    const showImage = (index) => {
      currentIndex = (index + selectedImages.length) % selectedImages.length;
      resetZoom();
      window.clearTimeout(imageChangeTimer);
      lightboxImage.classList.add("is-changing");
      counter.textContent = `${currentIndex + 1} / ${selectedImages.length}`;
      const nextImage = selectedImages[currentIndex];
      imageChangeTimer = window.setTimeout(() => {
        lightboxImage.alt = `Trabalho ${currentIndex + 1} de ${selectedImages.length}`;
        lightboxImage.onload = () => requestAnimationFrame(() => {
          updateHitAreas();
          lightboxImage.classList.remove("is-changing");
        });
        lightboxImage.onerror = () => lightboxImage.classList.remove("is-changing");
        lightboxImage.src = nextImage;
        if (lightboxImage.complete) requestAnimationFrame(() => {
          updateHitAreas();
          lightboxImage.classList.remove("is-changing");
        });
      }, 180);
    };
    const closeLightbox = () => {
      if (document.fullscreenElement === lightbox) document.exitFullscreen().catch(() => {});
      resetZoom();
      lightbox.hidden = true;
      lightbox.classList.remove("is-expanded");
      document.body.classList.remove("portfolio-lightbox-open");
      window.scrollTo(0, pageScrollY);
      gallery.querySelectorAll(".gallery-image")[currentIndex]?.focus();
    };
    gallery.querySelectorAll(".gallery-image").forEach((link, index) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        pageScrollY = window.scrollY;
        showImage(index);
        lightbox.hidden = false;
        document.body.classList.add("portfolio-lightbox-open");
        closeButton.focus();
      });
    });
    lightbox.querySelectorAll(".portfolio-lightbox-prev, .portfolio-lightbox-hit-prev").forEach((button) => button.addEventListener("click", (event) => {
      showImage(currentIndex - 1);
    }));
    lightbox.querySelectorAll(".portfolio-lightbox-next, .portfolio-lightbox-hit-next").forEach((button) => button.addEventListener("click", (event) => {
      showImage(currentIndex + 1);
    }));
    window.addEventListener("resize", updateHitAreas);
    closeButton.addEventListener("click", closeLightbox);
    zoomButton.addEventListener("click", toggleZoom);
    lightboxImage.addEventListener("dblclick", (event) => {
      event.preventDefault();
      toggleZoom();
    });
    const fullscreenButton = lightbox.querySelector(".portfolio-lightbox-fullscreen");
    fullscreenButton.addEventListener("click", async () => {
      try {
        if (document.fullscreenElement === lightbox) {
          fullscreenExitRequested = true;
          await document.exitFullscreen();
        } else {
          fullscreenExitRequested = false;
          await lightbox.requestFullscreen();
        }
      } catch {
        fullscreenExitRequested = false;
        const expanded = lightbox.classList.toggle("is-expanded");
        fullscreenButton.setAttribute("aria-label", expanded ? "Sair da tela cheia" : "Abrir em tela cheia");
        fullscreenButton.title = expanded ? "Sair da tela cheia" : "Tela cheia";
      }
    });
    lightbox.addEventListener("fullscreenchange", () => {
      const isFullscreen = document.fullscreenElement === lightbox;
      fullscreenButton.setAttribute("aria-label", isFullscreen ? "Sair da tela cheia" : "Abrir em tela cheia");
      fullscreenButton.title = isFullscreen ? "Sair da tela cheia" : "Tela cheia";
      if (!isFullscreen) {
        const exitedWithEscape = !fullscreenExitRequested;
        fullscreenExitRequested = false;
        if (exitedWithEscape && !lightbox.hidden) closeLightbox();
      }
    });
    shareButton.addEventListener("click", () => {
      const imageUrl = new URL(selectedImages[currentIndex], window.location.href).href;
      const pageUrl = encodeURIComponent(window.location.href);
      const description = encodeURIComponent("Giuseppes Hair Studio");
      lightbox.querySelector(".portfolio-share-facebook").href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
      lightbox.querySelector(".portfolio-share-x").href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${description}`;
      lightbox.querySelector(".portfolio-share-pinterest").href = `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${encodeURIComponent(imageUrl)}&description=${description}`;
      setShareMenuOpen(shareMenu.hidden);
    });
    lightbox.querySelector(".portfolio-share-download").addEventListener("click", () => {
      const imageUrl = selectedImages[currentIndex];
      const downloadLink = document.createElement("a");
      const resolvedImageUrl = new URL(imageUrl, window.location.href);
      downloadLink.href = resolvedImageUrl.origin === window.location.origin
        ? resolvedImageUrl.href
        : `/__download?url=${encodeURIComponent(resolvedImageUrl.href)}`;
      downloadLink.download = imageUrl.split("/").pop().split("?")[0];
      downloadLink.click();
      setShareMenuOpen(false);
    });
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
      else if (!event.target.closest(".portfolio-lightbox-tools")) setShareMenuOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape" && !shareMenu.hidden) setShareMenuOpen(false);
      else if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showImage(currentIndex - 1);
      if (event.key === "ArrowRight") showImage(currentIndex + 1);
    });
  });
  const yearElement = document.getElementById("current-year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");
  if (toggle && navigation) toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
  navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }));
  document.querySelectorAll("[data-contact-form]").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const message = ["Olá! Gostaria de falar com o Giuseppes Hair Studio.", `Nome: ${values.get("name")}`, `Telefone: ${values.get("phone")}`, `Email: ${values.get("email")}`, `Mensagem: ${values.get("message")}`].join("\n");
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${content.whatsappNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    window.location.assign(whatsappUrl);
  }));
})();
