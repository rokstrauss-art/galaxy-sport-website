module.exports = function (eleventyConfig) {
  // Copy static assets straight through to the output
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/netlify.toml");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  // Watch data + includes for live reload during local dev
  eleventyConfig.addWatchTarget("src/_data/");
  eleventyConfig.addWatchTarget("src/_includes/");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "html"],
  };
};
