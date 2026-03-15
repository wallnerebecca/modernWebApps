import {Component, html, observable, on} from "../kwm-js";
import {BlogModel} from "../models/BlogModel";

export class BlogComponent extends Component {
    model = new BlogModel();
    selectTag = observable(null);

    selectFilterTag(tag) {
        this.selectTag.set(tag);
    }

    clearFilterTag() {
        this.selectTag.set(null);
    }

    render() {
        const activeTag = this.selectTag.get();

        const allTags = [];
        this.model.posts.get().forEach(post => {
            allTags.push(...post.tags);
        });
        // Remove duplicates
        const uniqueTags = [...new Set(allTags)];

        const filteredPosts = this.selectTag.get()
            ? this.model.posts.get().filter(post => post.tags.includes(this.selectTag.get()))
            : this.model.posts.get();

        return html`
            <div class="blog-page">
                <h2>Blog</h2>

                <div class="blog-filters">
                    <span class="blog-filter-label">Filter by tag:</span>
                    ${uniqueTags.map((tag) => html`
                      <button
                        class="blog-tag-btn ${activeTag === tag ? "blog-tag-btn--active" : ""}"
                        ${on("click", () => this.selectFilterTag(tag))}
                      >
                        ${tag}
                      </button>
                    `)}
                    ${activeTag !== null
                        ? html`<button class="blog-clear-btn" ${on("click", () => this.clearFilterTag())}>Clear</button>`
                        : ""
                    }
                </div>

                <p class="blog-count">
                    ${filteredPosts.length} article${filteredPosts.length !== 1 ? "s" : ""}${activeTag !== null ? ` tagged "${activeTag}"` : ""}
                </p>

                <div class="blog-grid">
                    ${filteredPosts.map((post) => html`
                  <article class="blog-card">
                    <h3 class="blog-card-title">${post.title}</h3>
                    <p class="blog-card-body">${post.body}</p>
                    <div class="blog-card-tags">
                      ${post.tags.map((tag) => html`
                          <span
                            class="blog-card-tag ${activeTag === tag ? "blog-card-tag--active" : ""}"
                            ${on("click", () => this.selectFilterTag(tag))}
                          >
                            ${tag}
                          </span>
                        `)}
                    </div>
                    <div class="blog-card-meta">
                      <span>${post.views} views</span>
                      <span>${post.reactions?.likes ?? 0} likes</span>
                    </div>
                  </article>
                `)}
                </div>
            </div>
        `;
    }
}

customElements.define('blog-component', BlogComponent);
