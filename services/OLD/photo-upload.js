//==================================================
// PHOTO UPLOAD WIDGET — functional, client-side
//==================================================
// Real drag-and-drop + click-to-browse + live thumbnail
// previews + remove buttons, all working in the browser.
//
// NOTE: this collects files and previews them, but does not
// send them anywhere — there's no backend wired up yet. Hook
// the "Submit" button up to your upload endpoint (form POST,
// fetch() to an API route, etc.) when that's ready.
//==================================================

const uploadBox = document.getElementById("uploadBox");
const photoInput = document.getElementById("photoInput");
const previews = document.getElementById("uploadPreviews");
const submitBtn = document.getElementById("uploadSubmit");

const MAX_FILES = 10;
let selectedFiles = [];

function renderPreviews() {

    previews.innerHTML = "";

    selectedFiles.forEach((file, i) => {
        const url = URL.createObjectURL(file);

        const thumb = document.createElement("div");
        thumb.className = "preview-thumb";
        thumb.innerHTML =
            '<img src="' + url + '" alt="' + file.name + '">' +
            '<button type="button" class="preview-remove" data-index="' + i + '" aria-label="Remove photo">&times;</button>';

        previews.appendChild(thumb);
    });

    submitBtn.disabled = selectedFiles.length === 0;
    submitBtn.textContent = selectedFiles.length
        ? "Submit " + selectedFiles.length + " Photo" + (selectedFiles.length > 1 ? "s" : "") + " For Review"
        : "Submit Photos For Review";
}

function addFiles(fileList) {
    Array.from(fileList).forEach(file => {
        if (file.type.startsWith("image/") && selectedFiles.length < MAX_FILES) {
            selectedFiles.push(file);
        }
    });
    renderPreviews();
}

uploadBox.addEventListener("click", () => photoInput.click());

photoInput.addEventListener("change", e => addFiles(e.target.files));

["dragenter", "dragover"].forEach(evt => {
    uploadBox.addEventListener(evt, e => {
        e.preventDefault();
        uploadBox.classList.add("dragging");
    });
});

["dragleave", "drop"].forEach(evt => {
    uploadBox.addEventListener(evt, e => {
        e.preventDefault();
        uploadBox.classList.remove("dragging");
    });
});

uploadBox.addEventListener("drop", e => addFiles(e.dataTransfer.files));

previews.addEventListener("click", e => {
    if (e.target.classList.contains("preview-remove")) {
        const index = parseInt(e.target.dataset.index, 10);
        selectedFiles.splice(index, 1);
        renderPreviews();
    }
});

submitBtn.addEventListener("click", () => {
    if (!selectedFiles.length) return;

    // Placeholder confirmation — replace with a real submit
    // (fetch/FormData to your backend) once an endpoint exists.
    submitBtn.textContent = "Photos Ready — Connect This To Your Backend";
    submitBtn.disabled = true;
});
