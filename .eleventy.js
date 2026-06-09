module.exports = function (eleventyConfig) {
  // Copy static assets straight through to the output
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/netlify.toml");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  // Watch data + includes for live reload during local dev
  eleventyConfig.addWatchTarget("src/_data/");
  eleventyConfig.addWatchTarget("src/_includes/");

  // Events collection — read every .md file in src/events/, sorted by date_start
  eleventyConfig.addCollection("events", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/events/*.md")
      .sort((a, b) => {
        const dateA = new Date(a.data.date_start || 0);
        const dateB = new Date(b.data.date_start || 0);
        return dateA - dateB;
      });
  });

  // Blog collection — read every .md file in src/blog/, sorted newest first
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => {
        const dateA = new Date(a.data.date || 0);
        const dateB = new Date(b.data.date || 0);
        return dateB - dateA;
      });
  });

  // urlencode filter for safe mailto: links
  eleventyConfig.addFilter("urlencode", function (str) {
    return encodeURIComponent(str || "");
  });

  // Slovenian date format: "20. maj 2026"
  eleventyConfig.addFilter("slovenianDate", function (dateInput) {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    const months = ["januar","februar","marec","april","maj","junij","julij","avgust","september","oktober","november","december"];
    return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "html", "md"],
  };
};
