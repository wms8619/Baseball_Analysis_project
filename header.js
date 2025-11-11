class CustomHeader extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background-color: #1a365d;
                    color: white;
                    padding: 1.5rem 0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                
                .logo i {
                    width: 32px;
                    height: 32px;
                }
                
                nav ul {
                    display: flex;
                    gap: 1.5rem;
                    list-style: none;
                }
                
                nav a {
                    color: white;
                    text-decoration: none;
                    font-weight: 500;
                    transition: opacity 0.2s;
                }
                
                nav a:hover {
                    opacity: 0.8;
                }
                
                @media (max-width: 768px) {
                    .container {
                        flex-direction: column;
                        gap: 1rem;
                    }
                    
                    nav ul {
                        gap: 1rem;
                    }
                }
            </style>
            
            <header>
                <div class="container">
                    <div class="logo">
                        <i data-feather="bar-chart-2"></i>
                        <span>Baseball Legends Visualizer</span>
                    </div>
                    <nav>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Players</a></li>
                            <li><a href="#">About</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
    }
}

customElements.define('custom-header', CustomHeader);