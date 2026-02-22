document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('crimeForm');
    const loadingDiv = document.getElementById('loading');
    const resultDisplay = document.getElementById('resultDisplay');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // 1. Initialize Map (Default location set to India)
    let map = L.map('map').setView([20.5937, 78.9629], 5);
    let mapMarker;

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const crimeType = document.getElementById('crimeType').value;
        const locationInput = document.getElementById('location').value;

        // Hide results and show loading
        resultDisplay.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        analyzeBtn.disabled = true;

        // 2. Fetch coordinates for the entered location using Nominatim API
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}`)
            .then(response => response.json())
            .then(data => {
                setTimeout(() => { // Simulated delay for realism
                    // Mock calculation
                    const mockRatio = (Math.random() * 14.5 + 0.5).toFixed(2);
                    
                    let statusText = "";
                    let color = "";
                    
                    if (mockRatio < 3) {
                        statusText = "Below national average (Low Risk)";
                        color = "#27ae60"; 
                    } else if (mockRatio < 8) {
                        statusText = "Near national average (Moderate Risk)";
                        color = "#f39c12"; 
                    } else {
                        statusText = "Above national average (High Risk)";
                        color = "#c0392b"; 
                    }

                    // Update Text DOM
                    document.getElementById('displayCrime').textContent = crimeType;
                    document.getElementById('displayLocation').textContent = locationInput;
                    
                    const ratioElement = document.getElementById('displayRatio');
                    ratioElement.textContent = `${mockRatio}%`;
                    ratioElement.style.color = color;
                    document.getElementById('ratioStatus').textContent = statusText;

                    // Update Map DOM
                    if (data && data.length > 0) {
                        // Get Latitude and Longitude from API response
                        const lat = data[0].lat;
                        const lon = data[0].lon;

                        // Move map to the new location
                        map.setView([lat, lon], 12);

                        // Remove old marker if exists
                        if (mapMarker) {
                            map.removeLayer(mapMarker);
                        }

                        // Add new marker and popup
                        mapMarker = L.marker([lat, lon]).addTo(map);
                        mapMarker.bindPopup(`<b>${locationInput}</b><br>${crimeType} Ratio: <b>${mockRatio}%</b>`).openPopup();
                    } else {
                        alert("Location map par nahi mili, par data show ho raha hai.");
                    }

                    // Show results
                    loadingDiv.classList.add('hidden');
                    resultDisplay.classList.remove('hidden');
                    analyzeBtn.disabled = false;
                    
                    // Fix map rendering issue when unhiding div
                    setTimeout(() => { map.invalidateSize(); }, 100);

                }, 1500);
            })
            .catch(error => {
                console.error("Error fetching location:", error);
                alert("Map load karne mein problem aayi, try again.");
                loadingDiv.classList.add('hidden');
                analyzeBtn.disabled = false;
            });
    });
});