import React from "react"
import { Link, graphql } from "gatsby"
import parse from "html-react-parser"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({
  data,
  pageContext: { nextPagePath, previousPagePath },
}) => {
  const posts = data.allWpPost.nodes

  if (!posts.length) {
    return (
      <Layout isHomePage>
        <Seo title="All Facts" />
        <Bio />
        <p>
          No facts found.
        </p>
      </Layout>
    )
  }

  return (
    <Layout isHomePage>
      <Seo title="All Facts" />

      {/* <Bio /> */}

      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.title
          // console.log(posts);
          const factNum = post.tags.nodes[0].name;

          return (
            <li className="fact home-fact" key={post.uri}>
              <small style={{ marginRight: "10px" }}>{factNum}</small>
              {/* <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              > */}
              <h6 style={{ margin: 0 }}>
                <Link to={post.uri} itemProp="url">
                  <span itemProp="headline">{parse(title)}</span>
                </Link>
              </h6>
              {/* </article> */}
            </li>
          )
        })}
      </ol>

      {previousPagePath && (
        <>
          <Link to={previousPagePath}>Previous page</Link>
          <br />
        </>
      )}
      {nextPagePath && <Link to={nextPagePath}>Next page</Link>}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query WordPressPostArchive($offset: Int!, $postsPerPage: Int!) {
    allWpPost(
      sort: { fields: [date], order: ASC }
      limit: $postsPerPage
      skip: $offset
    ) {
      nodes {
        excerpt
        uri
        date(formatString: "MMMM DD, YYYY")
        title
        excerpt
        tags {
          nodes {            
            name
          }
        }     
      }
    }
  }
`
