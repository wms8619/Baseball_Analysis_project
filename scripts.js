// Sample player data (in a real app, this would come from an API)
const players = [
    {
        name: "B Bonds",
        position: "LF",
        games: 2986,
        atBat: 9847,
        runs: 2227,
        hits: 2935,
        doubles: 601,
        triples: 77,
        homeRuns: 762,
        rbi: 1996,
        walks: 2558,
        strikeouts: 1539,
        stolenBases: 514,
        caughtStealing: 141,
        avg: 0.298,
        obp: 0.444,
        slg: 0.607,
        ops: 1.051
    },
    {
        name: "H Aaron",
        position: "RF",
        games: 3298,
        atBat: 12364,
        runs: 2174,
        hits: 3771,
        doubles: 624,
        triples: 98,
        homeRuns: 755,
        rbi: 2297,
        walks: 1402,
        strikeouts: 1383,
        stolenBases: 240,
        caughtStealing: 73,
        avg: 0.305,
        obp: 0.374,
        slg: 0.555,
        ops: 0.929
    },
    // Add more players from your dataset...
];

let selectedPlayers = [];
let barChart, radarChart, timelineChart;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the player list
    populatePlayerList();
    
    // Set up event listeners
    document.getElementById('searchInput').addEventListener('input', filterPlayers);
    document.getElementById('compareBtn').addEventListener('click', updateCharts);
    
    // Initialize empty charts
    initializeCharts();
});

function populatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name} (${player.position})`;
        li.dataset.player = JSON.stringify(player);
        li.addEventListener('click', () => togglePlayerSelection(li, player));
        playerList.appendChild(li);
    });
}

function filterPlayers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const playerItems = document.querySelectorAll('#playerList li');
    
    playerItems.forEach(item => {
        const playerName = item.textContent.toLowerCase();
        if (playerName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function togglePlayerSelection(element, player) {
    element.classList.toggle('selected');
    
    const index = selectedPlayers.findIndex(p => p.name === player.name);
    if (index === -1) {
        selectedPlayers.push(player);
        addSelectedPlayerCard(player);
    } else {
        selectedPlayers.splice(index, 1);
        removeSelectedPlayerCard(player.name);
    }
    
    updateCharts();
}

function addSelectedPlayerCard(player) {
    const card = document.createElement('div');
    card.className = 'selected-player flex items-center space-x-3';
    card.innerHTML = `
        <div>
            <h3 class="font-bold">${player.name}</h3>
            <p class="text-sm text-gray-600">${player.position}</p>
        </div>
        <span class="remove-player" data-name="${player.name}">×</span>
    `;
    
    document.getElementById('selectedPlayersList').appendChild(card);
    
    // Add event listener to remove button
    card.querySelector('.remove-player').addEventListener('click', (e) => {
        e.stopPropagation();
        removeSelectedPlayerCard(player.name);
        
        // Also remove from player list selection
        const playerItems = document.querySelectorAll('#playerList li');
        playerItems.forEach(item => {
            if (item.textContent.includes(player.name)) {
                item.classList.remove('selected');
            }
        });
        
        // Remove from selectedPlayers array
        const index = selectedPlayers.findIndex(p => p.name === player.name);
        if (index !== -1) {
            selectedPlayers.splice(index, 1);
        }
        
        updateCharts();
    });
}

function removeSelectedPlayerCard(playerName) {
    const cards = document.querySelectorAll('.selected-player');
    cards.forEach(card => {
        if (card.querySelector('h3').textContent === playerName) {
            card.remove();
        }
    });
}

function initializeCharts() {
    const barCtx = document.getElementById('barChart').getContext('2d');
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    const timelineCtx = document.getElementById('careerTimeline').getContext('2d');
    
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Stat Comparison'
                }
            }
        }
    });
    
    radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['HR', 'RBI', 'AVG', 'OBP', 'SLG', 'OPS'],
            datasets: []
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Skill Radar'
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0
                }
            }
        }
    });
    
    timelineChart = new Chart(timelineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Career Timeline'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateCharts() {
    const selectedStat = document.getElementById('statSelect').value;
    const statLabel = getStatLabel(selectedStat);
    
    // Update bar chart
    barChart.data.labels = selectedPlayers.map(p => p.name);
    barChart.data.datasets = [{
        label: statLabel,
        data: selectedPlayers.map(p => p[selectedStat.toLowerCase()]),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        borderColor: ['#1d4ed8', '#059669', '#d97706', '#dc2626', '#7c3aed'],
        borderWidth: 1
    }];
    barChart.update();
    
    // Update radar chart
    radarChart.data.datasets = selectedPlayers.map((player, i) => ({
        label: player.name,
        data: [
            player.homeruns,
            player.rbi,
            player.avg * 1000, // Scale for radar
            player.obp * 1000,
            player.slg * 1000,
            player.ops * 1000
        ],
        backgroundColor: getTransparentColor(i),
        borderColor: getSolidColor(i),
        borderWidth: 2
    }));
    radarChart.update();
    
    // Update timeline chart (simplified example)
    timelineChart.data.labels = ['First 5 Years', 'Peak 5 Years', 'Last 5 Years'];
    timelineChart.data.datasets = selectedPlayers.map((player, i) => ({
        label: player.name,
        data: [
            player.homeruns * 0.3, // Simulated early career
            player.homeruns,        // Peak
            player.homeruns * 0.5  // Late career
        ],
        backgroundColor: getTransparentColor(i),
        borderColor: getSolidColor(i),
        borderWidth: 2,
        fill: false
    }));
    timelineChart.update();
}

function getStatLabel(stat) {
    const labels = {
        'AVG': 'Batting Average',
        'HR': 'Home Runs',
        'RBI': 'Runs Batted In',
        'R': 'Runs',
        'H': 'Hits',
        '2B': 'Doubles',
        '3B': 'Triples',
        'SB': 'Stolen Bases',
        'OBP': 'On-Base Percentage',
        'SLG': 'Slugging Percentage',
        'OPS': 'On-Base Plus Slugging'
    };
    return labels[stat] || stat;
}

function getSolidColor(index) {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return colors[index % colors.length];
}

function getTransparentColor(index) {
    const colors = ['rgba(59, 130, 246, 0.2)', 'rgba(16, 185, 129, 0.2)', 'rgba(245, 158, 11, 0.2)', 'rgba(239, 68, 68, 0.2)', 'rgba(139, 92, 246, 0.2)'];
    return colors[index % colors.length];
}