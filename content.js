/* Customize the site's copy, images, fonts, and contact links here. */
window.siteContent = {
  whatsappNumber: "5521964941833", // Replace with the salon's WhatsApp number, digits only.
  instagramUrl: "https://www.instagram.com/p/ChkHIhiOZOe/",
  reviewUrl: "https://www.google.com/search?q=Giuseppes+Hair+Studio+Barra+da+Tijuca+avalia%C3%A7%C3%B5es",
  fontHeading: "'Montserrat', Arial, sans-serif",
  fontBody: "'Montserrat', Arial, sans-serif",
  images: {
    heroImage: "assets/home-hero-reference.webp",
    aboutImage: "assets/about-salon-client.webp",
    statementImage: "assets/statement-client-portfolio-19.jpg",
    workImageOne: "assets/sobre-nos/nossos-resultados.webp"
  },
  galleryImages: Array.from({ length: 32 }, (_, index) =>
    `assets/portfolio/portfolio-${String(index + 1).padStart(2, "0")}.jpg`
  )
};
