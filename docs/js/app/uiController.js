// font size toggle
let fontSizes = ["100%", "125%", "150%"];
let fontIndex = 1; //default 125%

$("#exp-preview").on("click", function () {
  fontIndex++;
  if (fontIndex >= fontSizes.length) {
    fontIndex = 0;
  }

  $(".md-preview").css("--md-base", fontSizes[fontIndex]);
});

// copy to clipboard
$("#copy-preview").on("click", async function () {
  const mdContent = $("#md-editor").val();

  if (mdContent.trim() === "") return;

  await navigator.clipboard.writeText(mdContent);
  await toast("Copied to clipboard!");
});
