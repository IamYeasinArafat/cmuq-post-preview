// --- Initial Data ---
let cardData = {
    name: "Yeasin Arafat Rafio",
    handle: "@yeasin_arafat_rafio",
    major: "Biological Sciences",
    location: "Doha, Qatar",
    bg_image_data: "assets/background.png", 
    profile_image_data: "assets/profile-placeholder.png",
    seal_image_data: "assets/seal.png"
};

// --- Core Functions ---
function updatePreview() {
    // 1. Collect values from inputs
    cardData.name = document.getElementById('name').value;
    cardData.handle = document.getElementById('handle').value;
    cardData.major = document.getElementById('major').value;
    cardData.location = document.getElementById('location').value;

    // 2. Render Template via Nunjucks
    const templateSource = document.getElementById('template').innerHTML;
    const renderedHTML = nunjucks.renderString(templateSource, cardData);
    
    // 3. Inject into Iframe
    const iframe = document.getElementById('preview-frame');
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(renderedHTML);
    doc.close();
}

function handleFileSelect(event, dataKey) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        cardData[dataKey] = e.target.result;
        updatePreview();
    };
    reader.readAsDataURL(file);
}

// --- Event Listeners (Industry Standard) ---
document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Real-time Text Updates
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // File Upload Listeners
    document.getElementById('prof_up').addEventListener('change', (e) => handleFileSelect(e, 'profile_image_data'));
    document.getElementById('bg_up').addEventListener('change', (e) => handleFileSelect(e, 'bg_image_data'));
    document.getElementById('seal_up').addEventListener('change', (e) => handleFileSelect(e, 'seal_image_data'));

    // Initial Run
    updatePreview();

    document.getElementById('download-btn').addEventListener('click', downloadImage);
});


function downloadImage() {
    const iframe = document.getElementById('preview-frame');
    const cardElement = iframe.contentDocument.querySelector('.insta-card');

    // Use html2canvas to render the specific element
    html2canvas(cardElement, {
        allowTaint: true,
        useCORS: true,
        width: 1080, // Match your card width
        height: 1440 // Match your card height
    }).then(canvas => {
        // Convert to data URL and trigger download
        const image = canvas.toDataURL("image/jpeg", 1.0);
        const link = document.createElement('a');
        link.download = 'instagram-card.jpg';
        link.href = image;
        link.click();
    });
}