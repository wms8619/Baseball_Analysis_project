class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    background-color: #1a365d;
                    color: white;
                    padding: 2rem 0;
                    margin-top: 2rem;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                }
                
                .footer-section h3 {
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                    border-bottom: 2px solid #3b82f6;