import {observable} from "../kwm-js";

export class BlogModel {
    posts = observable([]);

    constructor() {
        this.loadPosts();
    }

    loadPosts() {
        fetch('https://dummyjson.com/posts?limit=30')
            .then(res => res.json())
            .then(data => {
                this.posts.set(data.posts);
            })
            .catch(err => console.log(err));
    }
}
