document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
    const tableBody = document.querySelector('#cryptoTable tbody');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const sortMarketCapButton = document.getElementById('sortMarketCapButton');
    const sortPercentageChangeButton = document.getElementById('sortPercentageChangeButton');

    let cryptoData = [];

    // Fetch data using async/await
    async function fetchData() {
        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            cryptoData = data;  // Store data for further manipulation
            renderTable(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchData();

    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach(coin => {
            const percentageChangeClass = coin.price_change_percentage_24h > 0 ? 'positive' : 'negative';
            const row = `
                <tr>
                    <td><img src="${coin.image}" alt="${coin.name}" width="30"></td>
                    <td>${coin.name}</td>
                    <td class="symbol">${coin.symbol.toUpperCase()}</td>
                    <td>$${coin.current_price.toLocaleString()}</td>
                    <td>${coin.total_volume.toLocaleString()}</td>
                    <td class="${percentageChangeClass}">${coin.price_change_percentage_24h.toFixed(2)}%</td>
                    <td>Mkt cap: $${coin.market_cap.toLocaleString()}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // Search functionality
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = cryptoData.filter(coin => coin.name.toLowerCase().includes(searchTerm));
        renderTable(filteredData);
    });

    // Sort by Market Cap functionality
    sortMarketCapButton.addEventListener('click', () => {
        const sortedData = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap);
        renderTable(sortedData);
    });

    // Sort by Percentage Change functionality
    sortPercentageChangeButton.addEventListener('click', () => {
        const sortedData = [...cryptoData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        renderTable(sortedData);
    });
});
