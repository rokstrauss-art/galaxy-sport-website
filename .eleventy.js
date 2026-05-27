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

  // urlencode filter for safe mailto: links
  eleventyConfig.addFilter("urlencode", function (str) {
    return encodeURIComponent(str || "");
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
