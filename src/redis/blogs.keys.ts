/*
    KEY USED TO STORE BLOGS VIEWS IN REDIS  
*/
export const BLOG_VIEWS_KEY = (
    blog_id: string,
) => `blog:views:${blog_id}`;
