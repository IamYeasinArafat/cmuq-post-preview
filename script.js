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
    cardData.name = document.getElementById('name').value;
    cardData.handle = document.getElementById('handle').value;
    cardData.major = document.getElementById('major').value;
    cardData.location = document.getElementById('location').value;

    const templateSource = document.getElementById('template').innerHTML;
    const renderedHTML = nunjucks.renderString(templateSource, cardData);
    
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


async function downloadImage() {
    const exportContainer = document.getElementById('export-container');
    const templateSource = document.getElementById('template').innerHTML;
    
    // 1. We wrap the template in a dummy div to parse it
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = templateSource;
    
    // 2. Extract the styles
    const styles = tempDiv.querySelector('style').outerHTML;
    // 3. Extract the card content
    const cardContent = tempDiv.querySelector('.insta-card').outerHTML;
    
    // 4. Inject into export container: Styles + Rendered Template
    const renderedCard = nunjucks.renderString(cardContent, cardData);
    exportContainer.innerHTML = styles + renderedCard;
    
    // 5. Wait for images
    const images = Array.from(exportContainer.querySelectorAll('img'));
    await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
    }));

    // 6. Capture
    const node = exportContainer.querySelector('.insta-card');
    
    domtoimage.toJpeg(node, { width: 1080, height: 1440, quality: 1.0 })
    .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = 'instagram-template.jpg';
        link.href = dataUrl;
        link.click();
        exportContainer.innerHTML = ''; 
    })
    .catch(function (error) {
        console.error('Download failed', error);
    });
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
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

    // File Uploads
    document.getElementById('prof_up').addEventListener('change', (e) => handleFileSelect(e, 'profile_image_data'));
    document.getElementById('bg_up').addEventListener('change', (e) => handleFileSelect(e, 'bg_image_data'));
    document.getElementById('seal_up').addEventListener('change', (e) => handleFileSelect(e, 'seal_image_data'));

    // Download Button
    document.getElementById('download-btn').addEventListener('click', downloadImage);

    // Initial Run
    updatePreview();
});