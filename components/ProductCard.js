import { Component, html } from "../kwm-js";

export class ProductCard extends Component {
  render() {
    return html`
            <div class="product-card">
                <img src="${this.getAttribute("img") ?? "https://picsum.photos/seed/random/1080/1920"}" alt="Product Name" class="product-image">
                <div class="product-content">
                    <h3>${this.getAttribute("heading") ?? "Product Card"}</h3>
                    <p>${this.getAttribute("text") ?? "Short description of the product that explains its key benefit."}</p>
                    <a href="${this.getAttribute("link") ?? "#/"}" class="cta">Buy Now</a>
                </div>
            </div>
        `;
  }
}

customElements.define("product-card", ProductCard);
