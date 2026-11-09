import { mg2aDocuments, mg2aBlocks } from "./mg2a";
import Page from "./documents/Page";
import Post from "./documents/Post";
import PostCategory from "./documents/PostCategory";
import Form from "./documents/Form";
import FormSubmission from "./documents/FormSubmission";
export default [
  ...mg2aDocuments,
  Page,
  Post,
  PostCategory,
  Form,
  FormSubmission,
  ...mg2aBlocks,
];
