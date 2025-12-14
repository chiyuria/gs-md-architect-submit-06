// Scroll Control
function lockScroll() {
  document.body.classList.add("is-modal-open");
}

function unlockScroll() {
  document.body.classList.remove("is-modal-open");
}

// OK Modal
function mkOk(message) {
  return new Promise(function (resolve) {
    lockScroll();

    $("#mk-ok-msg").html(message);
    $("#mk-modal-ok").removeClass("mk-hidden");

    $("#mk-ok-btn").one("click", function () {
      $("#mk-modal-ok").addClass("mk-hidden");
      unlockScroll();
      resolve(true);
    });
  });
}

// Confirm Modal
function mkConfirm(message) {
  return new Promise(function (resolve) {
    lockScroll();

    $("#mk-confirm-msg").html(message);
    $("#mk-modal-confirm").removeClass("mk-hidden");

    $("#mk-confirm-ok").one("click", function () {
      $("#mk-modal-confirm").addClass("mk-hidden");
      unlockScroll();
      resolve(true);
    });

    $("#mk-confirm-cancel").one("click", function () {
      $("#mk-modal-confirm").addClass("mk-hidden");
      unlockScroll();
      resolve(false);
    });
  });
}
