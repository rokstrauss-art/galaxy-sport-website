module.exports = function (eleventyConfig) {

  // Convert a YouTube or Vimeo URL into a responsive embed
  eleventyConfig.addFilter("videoEmbed", function (url) {
    if (!url) return "";
    url = String(url).trim();
    function tail(s, m) { var i = s.indexOf(m); return i === -1 ? "" : s.substring(i + m.length); }
    function clean(s) { return s.split("?")[0].split("&")[0].split("#")[0].split("/")[0]; }
    var src = "";
    if (url.indexOf("youtu.be/") !== -1) src = "https://www.youtube.com/embed/" + clean(tail(url, "youtu.be/"));
    else if (url.indexOf("watch?v=") !== -1) src = "https://www.youtube.com/embed/" + clean(tail(url, "watch?v="));
    else if (url.indexOf("/embed/") !== -1) src = "https://www.youtube.com/embed/" + clean(tail(url, "/embed/"));
    else if (url.indexOf("/shorts/") !== -1) src = "https://www.youtube.com/embed/" + clean(tail(url, "/shorts/"));
    else if (url.indexOf("vimeo.com/") !== -1) src = "https://player.vimeo.com/video/" + clean(tail(url, "vimeo.com/"));
    else return "";
    return '<div class="video-embed"><iframe src="' + src + '" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>';
  });

  // Escape text and convert newlines to <br>
  eleventyConfig.addFilter("nl2br", function (s) {
    if (!s) return "";
    var NL = String.fromCharCode(10), CR = String.fromCharCode(13);
    s = String(s).split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
    s = s.split(CR + NL).join(NL).split(CR).join(NL);
    return s.split(NL).join("<br>" + NL);
  });

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
