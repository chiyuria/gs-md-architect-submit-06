import {
  saveEditor,
  loadEditor,
  getVersions,
  loadVersion,
  commitVersion,
} from "./editorStore.js";
import { renderMdPreview, autosaveEditor } from "./markdownRenderer.js";

//Role: UI Controller for Editor

// State: Prevent multiple runs
let isRunning = false;

// Input Collection
function getInput() {
  return {
    src: $("#md-editor").val(),
    instructions: $("#instructions").val(),
    fewshot: $("#fewshot").val(),
  };
}

// Gemini Trigger
$("#send").on("click", async function () {
  if (isRunning) return;

  isRunning = true;

  const originalLabel = $("#send").html();
  const userInput = getInput();

  try {
    if (userInput.src.trim() === "") {
      await mkOk("Editor is blank. Please enter some text.");
      return;
    } else if (userInput.instructions.trim() === "") {
      await mkOk("Instructions are blank. Please enter a prompt.");
      return;
    }

    $("#send").addClass("btn-disabled btn-waiting");
    $("#send").html("generating...");
    $("#md-preview").addClass("md-preview-waiting");

    const response = await fetch("http://localhost:3000/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInput),
    });

    const data = await response.json();

    $("#md-editor").val(data.result);
    renderMdPreview(data.result);
    autosaveEditor(); //add: autosave after AI edit
  } catch (err) {
    console.error(err);
    await mkOk("An error occurred while processing your request.");
  } finally {
    isRunning = false;
    $("#send").removeClass("btn-disabled btn-waiting");
    $("#send").html(originalLabel);
    $("#md-preview").removeClass("md-preview-waiting");
  }
});

// Commit
$("#commit").on("click", async function () {
  const body = $("#md-editor").val();

  await saveEditor(body);
  await commitVersion(body);
});

// Load Versions
$("#load").on("click", async function () {
  const versions = await getVersions();
  const list = $("#version-list");

  list.empty();

  versions.forEach(function (version) {
    let createdTime = "";

    if (version.createdAt) {
      const date = version.createdAt.toDate();
      createdTime = date.toLocaleString();
    }

    console.log(version.title, createdTime);

    const li = $("<li>");
    li.text(version.title + " - " + createdTime);

    li.data("versionId", version.id);

    list.append(li);
  });

  $("#version-modal").removeClass("mk-hidden");
});

//Apply selected version
$("#version-list").on("click", "li", async function () {
  const versionId = $(this).data("versionId");
  const body = await loadVersion(versionId);

  $("#md-editor").val(body);
  renderMdPreview(body);

  $("#version-modal").addClass("mk-hidden");
});

// Close Versions Modal
$("#close-version").on("click", function () {
  $("#version-modal").addClass("mk-hidden");
});


// Initial Load
async function initEditor() {
  const body = await loadEditor();
  $("#md-editor").val(body);
  renderMdPreview(body);
}

initEditor();
