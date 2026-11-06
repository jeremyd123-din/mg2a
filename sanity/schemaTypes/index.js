import { mg2aDocuments, mg2aBlocks } from "./mg2a";
import Page from "./documents/Page";
import Post from "./documents/Post";
import PostCategory from "./documents/PostCategory";
export default [...mg2aDocuments, Page, Post, PostCategory, ...mg2aBlocks];
