import { saveEditor } from "./editorStore.js";

//Role: Markdown Preview Renderer and React to Input Changes

let autosaveTimer = null;

// Markdown Preview Renderer
export function renderMdPreview(text) {
  $("#md-preview").html(marked.parse(text));

  $("#md-preview pre code").each(function () {
    hljs.highlightElement(this);
  });
}

// Input Event for Live Preview & Autosave
$("#md-editor").on("input", function () {
  const txt = $(this).val();

  renderMdPreview(txt);

  if (autosaveTimer) clearTimeout(autosaveTimer);

  autosaveTimer = setTimeout(() => {
    autosaveEditor();
  }, 1500);
});

// Autosave Function
export function autosaveEditor() {
  const body = $("#md-editor").val();
  saveEditor(body);
}
