document.addEventListener("DOMContentLoaded", () => {
  console.log("Advance TA page loaded");

  // Initialize common components if needed
  // Layout and Global scripts handle the header/sidebar

  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      console.log("Refresh clicked");
      // Add refresh logic here
      const btnIcon = refreshBtn.querySelector("i");
      if (btnIcon) btnIcon.classList.add("fa-spin");

      setTimeout(() => {
        if (btnIcon) btnIcon.classList.remove("fa-spin");
        alert("Data refreshed (simulated)");
      }, 1000);
    });
  }
});
