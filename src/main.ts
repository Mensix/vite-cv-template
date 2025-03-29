function injectPageA4Class() {
    const pages = document.querySelectorAll('div[id^="page"]');
    pages.forEach(page => {
        if (!page.classList.contains('page-a4')) {
            page.classList.add('page-a4');
        }
    });
}

function injectBodyClass() {
    document.body.classList.add('bg-gray-100', 'p-8', 'flex', 'flex-col', 'items-center', 'space-y-8');
}

function injectPdfButton() {
    if (document.getElementById('pdf-button-container')) {
        return;
    }
    
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'pdf-button-container';
    buttonContainer.className = 'fixed bottom-8 right-8 z-50';
    buttonContainer.innerHTML = `
    <a href="/generate-pdf" id="pdf-button"
      class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-200 no-underline flex items-center gap-2">
      <span>Download CV</span>
    </a>
  `;
    document.body.appendChild(buttonContainer);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    injectPageA4Class();
    injectPdfButton();
    injectBodyClass();
}); 