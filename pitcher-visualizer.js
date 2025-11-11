class PitcherVisualizer extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 2rem 0;
        }
        .visualizer-container {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .chart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .chart-container {
          position: relative;
          height: 300px;
        }
        h2 {
          margin: 0 0 1rem 0;
          color: #1a365d;
          font-size: 1.5rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .stat-card {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 4px solid #3b82f6;
        }
        .stat-name {
          font-weight: 600;
          color: #64748b;
          margin-bottom: 0.5rem;
        }
        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }
      </style>
      <div class="visualizer-container">
        <h2>Pitcher Performance</h2>
        <div class="stats-grid" id="keyStats"></div>
        <div class="chart-grid">
          <div class="chart-container">
            <canvas id="pitchTypesChart"></canvas>
          </div>
          <div class="chart-container">
            <canvas id="eraTimelineChart"></canvas>
          </div>
        </div>
      </div>
    `;

    this.initializeCharts();
    this.loadData();
  }

  async loadData() {
    try {
      // In a real app, this would fetch from your CSV file
      // For now, we'll use mock data that matches your CSV structure
      const response = await fetch('components/baseball_pitcher.csv');
      const text = await response.text();
      const data = this.parseCSV(text);
      this.updateVisualization(data[0]); // Using first pitcher for demo
    } catch (error) {
      console.error('Error loading pitcher data:', error);
      // Fallback to demo data
      this.updateVisualization(this.getDemoData());
    }
  }

  parseCSV(text) {
    // Simple CSV parser - in a real app you might use PapaParse
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, i) => {
        obj[header.trim()] = values[i]?.trim();
        return obj;
      }, {});
    });
  }

  getDemoData() {
    return {
      name: "Jacob deGrom",
      team: "TEX",
      age: 35,
      wins: 84,
      losses: 57,
      era: 2.53,
      games: 209,
      games_started: 209,
      complete_games: 8,
      shutouts: 4,
      saves: 0,
      innings_pitched: 1356.1,
      hits: 1066,
      runs: 444,
      earned_runs: 381,
      home_runs: 117,
      walks: 286,
      strikeouts: 1607,
      whip: 1.00,
      fastball_percent: 52.3,
      slider_percent: 32.1,
      curveball_percent: 10.5,
      changeup_percent: 5.1
    };
  }

  initializeCharts() {
    const pitchTypesCtx = this.shadowRoot.getElementById('pitchTypesChart').getContext('2d');
    const eraTimelineCtx = this.shadowRoot.getElementById('eraTimelineChart').getContext('2d');

    this.pitchTypesChart = new Chart(pitchTypesCtx, {
      type: 'doughnut',
      data: {
        labels: ['Fastball', 'Slider', 'Curveball', 'Changeup'],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          },
          title: {
            display: true,
            text: 'Pitch Types (%)'
          }
        }
      }
    });

    this.eraTimelineChart = new Chart(eraTimelineCtx, {
      type: 'line',
      data: {
        labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
          label: 'ERA',
          data: [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'ERA Over Time'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            reverse: true,
            title: {
              display: true,
              text: 'ERA'
            }
          }
        }
      }
    });
  }

  updateVisualization(pitcherData) {
    // Update key stats
    const keyStatsContainer = this.shadowRoot.getElementById('keyStats');
    keyStatsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-name">Name</div>
        <div class="stat-value">${pitcherData.name}</div>
      </div>
      <div class="stat-card">
        <div class="stat-name">Team</div>
        <div class="stat-value">${pitcherData.team}</div>
      </div>
      <div class="stat-card">
        <div class="stat-name">W-L Record</div>
        <div class="stat-value">${pitcherData.wins}-${pitcherData.losses}</div>
      </div>
      <div class="stat-card">
        <div class="stat-name">ERA</div>
        <div class="stat-value">${pitcherData.era}</div>
      </div>
      <div class="stat-card">
        <div class="stat-name">Strikeouts</div>
        <div class="stat-value">${pitcherData.strikeouts}</div>
      </div>
      <div class="stat-card">
        <div class="stat-name">WHIP</div>
        <div class="stat-value">${pitcherData.whip}</div>
      </div>
    `;

    // Update pitch types chart
    this.pitchTypesChart.data.datasets[0].data = [
      pitcherData.fastball_percent || 0,
      pitcherData.slider_percent || 0,
      pitcherData.curveball_percent || 0,
      pitcherData.changeup_percent || 0
    ];
    this.pitchTypesChart.update();

    // Update ERA timeline (simulated data)
    const baseEra = parseFloat(pitcherData.era) || 3.00;
    const eraTimeline = Array(10).fill(0).map((_, i) => {
      // Simulate some variation around the pitcher's career ERA
      const variation = (Math.random() * 0.5 - 0.25);
      return (baseEra + variation).toFixed(2);
    });
    this.eraTimelineChart.data.datasets[0].data = eraTimeline;
    this.eraTimelineChart.update();
  }
}

customElements.define('pitcher-visualizer', PitcherVisualizer);