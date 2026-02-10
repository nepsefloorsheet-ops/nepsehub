/**
 * Features Page JavaScript
 * Handles accordion functionality and page interactivity
 */

document.addEventListener('DOMContentLoaded', function() {
  initAccordion();
});

/**
 * Initialize accordion functionality
 */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const item = this.closest('.accordion-item');
      const isActive = item.classList.contains('active');
      
      // Close all other accordions
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current accordion
      item.classList.toggle('active', !isActive);
    });
  });
}
